import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringTransactionsService } from './recurring-transactions.service';

@Injectable()
export class RecurringTransactionsSchedulerService {
  constructor(
    private readonly recurringTransactionsService: RecurringTransactionsService,
  ) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRecurringTransactions() {
    console.log('Running recurring transactions scheduler...');
    try {
      await this.recurringTransactionsService.generateTransactions();
      console.log('Recurring transactions generated successfully');
    } catch (error) {
      console.error('Error generating recurring transactions:', error);
    }
  }
}
