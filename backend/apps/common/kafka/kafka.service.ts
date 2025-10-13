import { Injectable, Inject, Logger, OnModuleDestroy } from '@nestjs/common'
import { Producer, ProducerRecord, RecordMetadata } from 'kafkajs'

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name)

  constructor(
    @Inject('KAFKA_PRODUCER')
    private readonly producer: Producer
  ) {}

  async onModuleDestroy() {
    await this.disconnect()
  }

  /**
   * Send a single message to a Kafka topic
   * @param topic - The Kafka topic to send the message to
   * @param message - The message payload (will be JSON stringified)
   * @param key - Optional message key for partitioning
   * @returns Promise with record metadata
   */
  async sendMessage<T = any>(
    topic: string,
    message: T,
    key?: string
  ): Promise<RecordMetadata[]> {
    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: key,
            value: JSON.stringify(message)
          }
        ]
      })

      this.logger.log(
        `Message sent successfully to topic: ${topic}, partition: ${result[0].partition}, offset: ${result[0].offset}`
      )

      return result
    } catch (error) {
      this.logger.error(`Error sending message to topic ${topic}:`, error)
      throw error
    }
  }

  /**
   * Send multiple messages to a Kafka topic
   * @param topic - The Kafka topic to send messages to
   * @param messages - Array of message payloads
   * @returns Promise with record metadata
   */
  async sendMessages<T = any>(
    topic: string,
    messages: Array<{ value: T; key?: string }>
  ): Promise<RecordMetadata[]> {
    try {
      const kafkaMessages = messages.map((msg) => ({
        key: msg.key,
        value: JSON.stringify(msg.value)
      }))

      const result = await this.producer.send({
        topic,
        messages: kafkaMessages
      })

      this.logger.log(
        `${messages.length} messages sent successfully to topic: ${topic}`
      )

      return result
    } catch (error) {
      this.logger.error(`Error sending messages to topic ${topic}:`, error)
      throw error
    }
  }

  /**
   * Send a message to multiple topics
   * @param topicMessages - Array of topic-message pairs
   * @returns Promise with record metadata
   */
  async sendBatch(
    topicMessages: Array<{
      topic: string
      messages: Array<{ value: any; key?: string }>
    }>
  ): Promise<RecordMetadata[]> {
    try {
      const result = await this.producer.sendBatch({
        topicMessages: topicMessages.map((tm) => ({
          topic: tm.topic,
          messages: tm.messages.map((msg) => ({
            key: msg.key,
            value: JSON.stringify(msg.value)
          }))
        }))
      })

      this.logger.log(`Batch messages sent successfully`)
      return result
    } catch (error) {
      this.logger.error(`Error sending batch messages:`, error)
      throw error
    }
  }

  /**
   * Disconnect the producer
   */
  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect()
      this.logger.log('Kafka producer disconnected')
    } catch (error) {
      this.logger.error('Error disconnecting Kafka producer:', error)
    }
  }
}
