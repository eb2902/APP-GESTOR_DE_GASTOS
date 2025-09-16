import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecurringTransactionsService } from './recurring-transactions.service';
import { CreateRecurringTransactionDto } from './dto/create-recurring-transaction.dto';
import { UpdateRecurringTransactionDto } from './dto/update-recurring-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('recurring-transactions')
@Controller('recurring-transactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecurringTransactionsController {
  constructor(private readonly recurringTransactionsService: RecurringTransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva transacción recurrente' })
  @ApiResponse({ status: 201, description: 'Transacción recurrente creada exitosamente' })
  create(@Body() createRecurringTransactionDto: CreateRecurringTransactionDto, @Request() req) {
    return this.recurringTransactionsService.create(createRecurringTransactionDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones recurrentes del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de transacciones recurrentes obtenida exitosamente' })
  findAll(@Request() req) {
    return this.recurringTransactionsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener transacción recurrente por ID' })
  @ApiResponse({ status: 200, description: 'Transacción recurrente obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Transacción recurrente no encontrada' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.recurringTransactionsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar transacción recurrente' })
  @ApiResponse({ status: 200, description: 'Transacción recurrente actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Transacción recurrente no encontrada' })
  update(@Param('id') id: string, @Body() updateRecurringTransactionDto: UpdateRecurringTransactionDto, @Request() req) {
    return this.recurringTransactionsService.update(+id, updateRecurringTransactionDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar transacción recurrente' })
  @ApiResponse({ status: 200, description: 'Transacción recurrente eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Transacción recurrente no encontrada' })
  remove(@Param('id') id: string, @Request() req) {
    return this.recurringTransactionsService.remove(+id, req.user.userId);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generar transacciones recurrentes para hoy' })
  @ApiResponse({ status: 200, description: 'Transacciones generadas exitosamente' })
  generateTransactions() {
    return this.recurringTransactionsService.generateTransactions();
  }
}
