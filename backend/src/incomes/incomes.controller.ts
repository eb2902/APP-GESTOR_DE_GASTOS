import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('incomes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto, @Req() req) {
    return this.incomesService.create(createIncomeDto, req.user.userId);
  }

  @Get()
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'ID de la categoría' })
  findAll(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: number,
  ) {
    if (startDate && endDate) {
      return this.incomesService.findByDateRange(req.user.userId, startDate, endDate);
    }
    if (categoryId) {
      return this.incomesService.findByCategory(req.user.userId, +categoryId);
    }
    return this.incomesService.findAll(req.user.userId);
  }

  @Get('stats/monthly/:year/:month')
  getTotalByMonth(
    @Req() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.incomesService.getTotalByMonth(req.user.userId, +year, +month);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.incomesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto, @Req() req) {
    return this.incomesService.update(+id, updateIncomeDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.incomesService.remove(+id, req.user.userId);
  }
}
