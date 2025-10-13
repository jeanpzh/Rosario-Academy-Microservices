/**
 * Kafka Message Types
 * Define all Kafka message payloads here for type safety
 */

/**
 * Payment processed event
 * Published when a payment is successfully processed
 */
export interface PaymentProcessedMessage {
  athlete_id: string
  subscription_id: string
  schedule_id: number
  payment_id: string
  amount: number
  payment_date: string
}

/**
 * Subscription created event
 * Published when a new subscription is created
 */
export interface SubscriptionCreatedMessage {
  athlete_id: string
  subscription_id: string
  start_date: string
  end_date: string
}

/**
 * Subscription renewed event
 * Published when a subscription is renewed
 */
export interface SubscriptionRenewedMessage {
  athlete_id: string
  subscription_id: string
  previous_end_date: string
  new_end_date: string
  payment_id: string
}

/**
 * Payment failed event
 * Published when a payment fails
 */
export interface PaymentFailedMessage {
  athlete_id: string
  payment_id: string
  reason: string
  attempted_date: string
}

/**
 * Kafka Topics
 */
export enum KafkaTopics {
  PAYMENT_PROCESSED = 'payment_processed',
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
  PAYMENT_FAILED = 'payment_failed'
}
