import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecurringTransaction, RecurringFrequency, TransactionType } from './entities/recurring-transaction.entity';
import { CreateRecurringTransactionDto } from './dto/create-recurring-transaction.dto';
import { UpdateRecurringTransactionDto } from './dto/update-recurring-transaction.dto';
import { Expense } from '../expenses/entities/expense.entity';
import { Income } from '../incomes/entities/income.entity';

@Injectable()
export class RecurringTransactionsService {
  constructor(
    @InjectRepository(RecurringTransaction)
    private readonly recurringTransactionRepository: Repository<RecurringTransaction>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  async create(createRecurringTransactionDto: CreateRecurringTransactionDto, userId: number): Promise<RecurringTransaction> {
    const recurringTransaction = this.recurringTransactionRepository.create({
      ...createRecurringTransactionDto,
      userId,
      startDate: new Date(createRecurringTransactionDto.startDate),
      endDate: createRecurringTransactionDto.endDate ? new Date(createRecurringTransactionDto.endDate) : undefined,
      isActive: createRecurringTransactionDto.isActive ?? true,
    });

    return this.recurringTransactionRepository.save(recurringTransaction);
  }

  async findAll(userId: number): Promise<RecurringTransaction[]> {
    return this.recurringTransactionRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<RecurringTransaction> {
    const recurringTransaction = await this.recurringTransactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!recurringTransaction) {
      throw new NotFoundException('Transacción recurrente no encontrada');
    }

    return recurringTransaction;
  }

  async update(id: number, updateRecurringTransactionDto: UpdateRecurringTransactionDto, userId: number): Promise<RecurringTransaction> {
    const recurringTransaction = await this.findOne(id, userId);

    if (updateRecurringTransactionDto.startDate) {
      updateRecurringTransactionDto.startDate = new Date(updateRecurringTransactionDto.startDate) as any;
    }

    if (updateRecurringTransactionDto.endDate) {
      updateRecurringTransactionDto.endDate = new Date(updateRecurringTransactionDto.endDate) as any;
    }

    Object.assign(recurringTransaction, updateRecurringTransactionDto);
    return this.recurringTransactionRepository.save(recurringTransaction);
  }

  async remove(id: number, userId: number): Promise<void> {
    const recurringTransaction = await this.findOne(id, userId);
    await this.recurringTransactionRepository.remove(recurringTransaction);
  }

  async generateTransactions(): Promise<void> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recurringTransactions = await this.recurringTransactionRepository.find({
      where: {
        isActive: true,
      },
      relations: ['user', 'category'],
    });

    for (const recurring of recurringTransactions) {
      if (this.shouldGenerateTransaction(recurring, today)) {
        await this.createTransactionFromRecurring(recurring, today);
        recurring.lastGenerated = today;
        await this.recurringTransactionRepository.save(recurring);
      }
    }
  }

  private shouldGenerateTransaction(recurring: RecurringTransaction, today: Date): boolean {
    // Check if end date has passed
    if (recurring.endDate && today > recurring.endDate) {
      return false;
    }

    // Check if start date is in the future
    if (today < recurring.startDate) {
      return false;
    }

    // Check if already generated today
    if (recurring.lastGenerated && this.isSameDate(recurring.lastGenerated, today)) {
      return false;
    }

    // Check frequency
    const daysSinceStart = Math.floor((today.getTime() - recurring.startDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (recurring.frequency) {
      case RecurringFrequency.DAILY:
        return !recurring.lastGenerated || !this.isSameDate(recurring.lastGenerated, today);
      case RecurringFrequency.WEEKLY:
        return daysSinceStart % 7 === 0;
      case RecurringFrequency.MONTHLY:
        return today.getDate() === recurring.startDate.getDate();
      case RecurringFrequency.YEARLY:
        return today.getMonth() === recurring.startDate.getMonth() && today.getDate() === recurring.startDate.getDate();
      default:
        return false;
    }
  }

  private async createTransactionFromRecurring(recurring: RecurringTransaction, date: Date): Promise<void> {
    const transactionData = {
      title: recurring.title,
      description: recurring.description,
      amount: recurring.amount,
      date: date.toISOString().split('T')[0],
      userId: recurring.userId,
      categoryId: recurring.categoryId,
    };

    if (recurring.type === TransactionType.EXPENSE) {
      const expense = this.expenseRepository.create(transactionData);
      await this.expenseRepository.save(expense);
    } else {
      const income = this.incomeRepository.create(transactionData);
      await this.incomeRepository.save(income);
    }
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
