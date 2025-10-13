import { UserRole } from '@common/enums/user-roles.enum'
import { Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsDateString,
  Length,
  Matches,
  IsOptional,
  IsObject,
  ValidateNested
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AthleteMetadataDto } from './athlete-metadata.dto'

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'newuser@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'User DNI (8 digits)',
    example: '12345678',
    minLength: 8,
    maxLength: 8,
    pattern: '^[0-9]{8}$'
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @Matches(/^[0-9]{8}$/)
  dni: string

  @ApiProperty({
    description: 'User first name',
    example: 'Juan'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    description: 'User paternal last name',
    example: 'Pérez'
  })
  @IsString()
  @IsNotEmpty()
  paternalLastName: string

  @ApiProperty({
    description: 'User maternal last name',
    example: 'García'
  })
  @IsString()
  @IsNotEmpty()
  maternalLastName: string

  @ApiProperty({
    description: 'User phone number (9-15 digits)',
    example: '987654321',
    minLength: 9,
    maxLength: 15
  })
  @IsString()
  @IsNotEmpty()
  @Length(9, 15)
  phone: string

  @ApiProperty({
    description: 'User role',
    example: 'ATHLETE',
    enum: UserRole
  })
  @IsString()
  @IsNotEmpty()
  role: string

  @ApiProperty({
    description: 'User birthdate (ISO 8601 format)',
    example: '2000-01-15',
    format: 'date'
  })
  @IsDateString()
  birthdate: string

  @ApiProperty({
    description: 'User password (must contain uppercase, lowercase and number)',
    example: 'MyP@ssw0rd123',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
  })
  password: string

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional({
    description:
      'Additional metadata based on user role (required for ATHLETE role)',
    example: {}
  })
  @ValidateNested()
  @Type((opts) => {
    switch ((opts?.object as any)?.role) {
      case UserRole.ATHLETE:
        return AthleteMetadataDto

      default:
        return class {}
    }
  })
  metadata!: AthleteMetadataDto | Record<string, never>
}
