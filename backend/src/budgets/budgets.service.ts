import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetsRepository: Repository<Budget>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto, userId: number): Promise<Budget> {
    const budget = this.budgetsRepository.create({
      ...createBudgetDto,
      userId,
    });

    return this.budgetsRepository.save(budget);
  }

  async findAll(userId: number): Promise<Budget[]> {
    return this.budgetsRepository.find({
      where: { userId },
      relations: ['category'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Budget> {
    const budget = await this.budgetsRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!budget) {
      throw new NotFoundException('Presupuesto no encontrado');
    }

    return budget;
  }

  async findByPeriod(userId: number, year: number, month?: number): Promise<Budget[]> {
    const where: any = { userId, year };
    if (month) {
      where.month = month;
    }

    return this.budgetsRepository.find({
      where,
      relations: ['category'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async findByCategory(userId: number, categoryId: number): Promise<Budget[]> {
    return this.budgetsRepository.find({
      where: { userId, categoryId },
      relations: ['category'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, userId: number): Promise<Budget> {
    const budget = await this.findOne(id, userId);
    await this.budgetsRepository.update(id, updateBudgetDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const budget = await this.findOne(id, userId);
    await this.budgetsRepository.remove(budget);
  }
}
