import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('budgets')
@Controller('budgets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo presupuesto' })
  @ApiResponse({ status: 201, description: 'Presupuesto creado exitosamente' })
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req) {
    return this.budgetsService.create(createBudgetDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los presupuestos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de presupuestos obtenida exitosamente' })
  @ApiQuery({ name: 'year', required: false, description: 'Año' })
  @ApiQuery({ name: 'month', required: false, description: 'Mes (1-12)' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID de la categoría' })
  findAll(
    @Request() req,
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const userId = req.user.userId;

    if (year) {
      return this.budgetsService.findByPeriod(userId, +year, month ? +month : undefined);
    }

    if (categoryId) {
      return this.budgetsService.findByCategory(userId, +categoryId);
    }

    return this.budgetsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener presupuesto por ID' })
  @ApiResponse({ status: 200, description: 'Presupuesto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Presupuesto no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.budgetsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar presupuesto' })
  @ApiResponse({ status: 200, description: 'Presupuesto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Presupuesto no encontrado' })
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto, @Request() req) {
    return this.budgetsService.update(+id, updateBudgetDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar presupuesto' })
  @ApiResponse({ status: 200, description: 'Presupuesto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Presupuesto no encontrado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.budgetsService.remove(+id, req.user.userId);
  }
}
