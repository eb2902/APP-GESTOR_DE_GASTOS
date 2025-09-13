import { IsNotEmpty, IsString, IsOptional, IsHexColor } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Alimentación',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
    example: 'Gastos relacionados con comida y bebida',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Color de la categoría en formato hexadecimal',
    example: '#ff6b6b',
    default: '#007bff',
  })
  @IsHexColor()
  @IsOptional()
  color?: string;
}
