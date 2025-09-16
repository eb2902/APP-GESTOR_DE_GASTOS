import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive, IsInt, IsIn, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBudgetDto {
  @ApiProperty({
    description: 'Título del presupuesto',
    example: 'Presupuesto mensual de alimentación',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Descripción del presupuesto',
    example: 'Presupuesto para gastos en comida',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Monto del presupuesto',
    example: 500.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({
    description: 'Período del presupuesto',
    example: 'monthly',
    enum: ['monthly', 'annual'],
  })
  @IsString()
  @IsIn(['monthly', 'annual'])
  period: string;

  @ApiProperty({
    description: 'Año del presupuesto',
    example: 2024,
  })
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({
    description: 'Mes del presupuesto (1-12, solo para mensual)',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({
    description: 'ID de la categoría',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
