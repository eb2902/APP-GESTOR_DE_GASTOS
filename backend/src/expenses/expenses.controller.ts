import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo gasto' })
  @ApiResponse({ status: 201, description: 'Gasto creado exitosamente' })
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de gastos obtenida exitosamente' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'ID de la categoría' })
  findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const userId = req.user.userId;

    if (startDate && endDate) {
      return this.expensesService.findByDateRange(userId, startDate, endDate);
    }

    if (categoryId) {
      return this.expensesService.findByCategory(userId, +categoryId);
    }

    return this.expensesService.findAll(userId);
  }

  @Get('stats/monthly/:year/:month')
  @ApiOperation({ summary: 'Obtener total de gastos por mes' })
  @ApiResponse({ status: 200, description: 'Total mensual obtenido exitosamente' })
  getMonthlyTotal(
    @Request() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.expensesService.getTotalByMonth(req.user.userId, +year, +month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener gasto por ID' })
  @ApiResponse({ status: 200, description: 'Gasto obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @Request() req) {
    return this.expensesService.update(+id, updateExpenseDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(+id, req.user.userId);
  }
}
