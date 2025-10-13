import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Logger } from '@nestjs/common'

const logger = new Logger('WorkerModule')

// Custom error types for better error handling
export class WorkerError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WorkerError'
  }
}

export class AssistantNotFoundError extends WorkerError {
  constructor(id: string) {
    super(`Assistant with ID ${id} not found`)
    this.name = 'AssistantNotFoundError'
  }
}

export class AthleteNotFoundError extends WorkerError {
  constructor(id: string) {
    super(`Athlete with ID ${id} not found`)
    this.name = 'AthleteNotFoundError'
  }
}

export class DatabaseOperationError extends WorkerError {
  constructor(operation: string, details?: string) {
    super(
      `Database operation failed: ${operation}${details ? ` - ${details}` : ''}`
    )
    this.name = 'DatabaseOperationError'
  }
}

// Error handler utility
export class WorkerErrorHandler {
  static handleRepositoryError(error: any, context: string): never {
    logger.error(`Error in ${context}: ${error.message}`, error.stack)

    if (error instanceof WorkerError) {
      throw error
    }

    // Handle Supabase/PostgreSQL specific errors
    if (error.code) {
      switch (error.code) {
        case '23505': // unique_violation
          throw new BadRequestException('El registro ya existe en el sistema')
        case '23503': // foreign_key_violation
          throw new BadRequestException(
            'Referencia inválida en la base de datos'
          )
        case '23502': // not_null_violation
          throw new BadRequestException('Faltan datos requeridos')
        case 'PGRST116': // No rows found
          throw new NotFoundException('No se encontraron registros')
        default:
          logger.error(`Unhandled database error code: ${error.code}`)
      }
    }

    // Default error
    throw new InternalServerErrorException(
      `Error inesperado en ${context}. Por favor, intente nuevamente o contacte al soporte.`
    )
  }

  static handleServiceError(error: any, context: string): never {
    logger.error(`Service error in ${context}: ${error.message}`, error.stack)

    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException ||
      error instanceof InternalServerErrorException
    ) {
      throw error
    }

    throw new InternalServerErrorException(
      `Error en el servicio: ${context}. Por favor, intente nuevamente.`
    )
  }
}
