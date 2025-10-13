import { Expose } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  IsUUID
} from 'class-validator'

@Expose()
export class CreatePaymentRecordDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsUUID()
  payment_method_id: string

  @IsNotEmpty()
  @IsString()
  transaction_reference: string

  @IsNotEmpty()
  @IsDateString()
  payment_date: string

  @IsNotEmpty()
  @IsDateString()
  subscription_start_date: string

  @IsNotEmpty()
  @IsDateString()
  subscription_end_date: string
}
