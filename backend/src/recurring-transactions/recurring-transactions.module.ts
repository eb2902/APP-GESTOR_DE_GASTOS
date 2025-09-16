import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringTransactionsService } from './recurring-transactions.service';
import { RecurringTransactionsController } from './recurring-transactions.controller';
import { RecurringTransactionsSchedulerService } from './recurring-transactions-scheduler.service';
import { RecurringTransaction } from './entities/recurring-transaction.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Income } from '../incomes/entities/income.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecurringTransaction, Expense, Income]),
  ],
  controllers: [RecurringTransactionsController],
  providers: [RecurringTransactionsService, RecurringTransactionsSchedulerService],
  exports: [RecurringTransactionsService],
})
export class RecurringTransactionsModule {}
