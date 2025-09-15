import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Income } from './entities/income.entity';

@Injectable()
export class IncomesService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
  ) {}

  async create(createIncomeDto: CreateIncomeDto, userId: number): Promise<Income> {
    const income = this.incomesRepository.create({
      ...createIncomeDto,
      userId,
      date: new Date(createIncomeDto.date),
    });

    return this.incomesRepository.save(income);
  }

  async findAll(userId: number): Promise<Income[]> {
    return this.incomesRepository.find({
      where: { userId },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Income> {
    const income = await this.incomesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!income) {
      throw new NotFoundException('Ingreso no encontrado');
    }

    return income;
  }

  async findByDateRange(userId: number, startDate: string, endDate: string): Promise<Income[]> {
    return this.incomesRepository.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findByCategory(userId: number, categoryId: number): Promise<Income[]> {
    return this.incomesRepository.find({
      where: { userId, categoryId },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async getTotalByMonth(userId: number, year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const result = await this.incomesRepository
      .createQueryBuilder('income')
      .select('SUM(income.amount)', 'total')
      .where('income.userId = :userId', { userId })
      .andWhere('income.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto, userId: number): Promise<Income> {
    const income = await this.findOne(id, userId);

    if (updateIncomeDto.date) {
      updateIncomeDto.date = new Date(updateIncomeDto.date).toISOString().split('T')[0];
    }

    await this.incomesRepository.update(id, updateIncomeDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    const income = await this.findOne(id, userId);
    await this.incomesRepository.remove(income);
  }
}
