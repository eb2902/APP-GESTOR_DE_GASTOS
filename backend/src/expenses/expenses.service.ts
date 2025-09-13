import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense> {
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
      date: new Date(createExpenseDto.date),
    });

    return this.expensesRepository.save(expense);
  }

  async findAll(userId: number): Promise<Expense[]> {
    return this.expensesRepository.find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!expense) {
      throw new NotFoundException('Gasto no encontrado');
    }

    return expense;
  }

  async findByDateRange(userId: number, startDate: string, endDate: string): Promise<Expense[]> {
    return this.expensesRepository.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findByCategory(userId: number, categoryId: number): Promise<Expense[]> {
    return this.expensesRepository.find({
      where: { userId, categoryId },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async getTotalByMonth(userId: number, year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number): Promise<Expense> {
    const expense = await this.findOne(id, userId);

    if (updateExpenseDto.date) {
      updateExpenseDto.date = new Date(updateExpenseDto.date).toISOString().split('T')[0];
    }

    await this.expensesRepository.update(id, updateExpenseDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expensesRepository.remove(expense);
  }
}
