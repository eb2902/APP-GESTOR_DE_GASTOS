import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateIncomeDto {
  @ApiProperty({
    description: 'Título del ingreso',
    example: 'Salario mensual',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción del ingreso',
    example: 'Sueldo de enero',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monto del ingreso',
    example: 1500.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({
    description: 'Fecha del ingreso en formato ISO',
    example: '2024-01-31',
  })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
