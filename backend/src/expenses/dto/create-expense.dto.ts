import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, IsDateString, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Título del gasto',
    example: 'Compra en supermercado',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción del gasto',
    example: 'Compra semanal de alimentos',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monto del gasto',
    example: 150.75,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({
    description: 'Fecha del gasto en formato ISO',
    example: '2024-01-15',
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
