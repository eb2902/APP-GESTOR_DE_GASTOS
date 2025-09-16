import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, IsDateString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RecurringFrequency, TransactionType } from '../entities/recurring-transaction.entity';

export class CreateRecurringTransactionDto {
  @ApiProperty({
    description: 'Título de la transacción recurrente',
    example: 'Pago de alquiler mensual',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción de la transacción recurrente',
    example: 'Pago mensual del alquiler del apartamento',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monto de la transacción',
    example: 50000.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({
    description: 'Frecuencia de la transacción',
    enum: RecurringFrequency,
    example: RecurringFrequency.MONTHLY,
  })
  @IsEnum(RecurringFrequency)
  frequency: RecurringFrequency;

  @ApiProperty({
    description: 'Tipo de transacción',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Fecha de inicio en formato ISO',
    example: '2024-01-01',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin en formato ISO (opcional)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Si la transacción está activa',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
