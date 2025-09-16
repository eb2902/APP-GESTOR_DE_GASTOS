import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CategoriesModule } from './categories/categories.module';
import { User } from './users/entities/user.entity';
import { Expense } from './expenses/entities/expense.entity';
import { Category } from './categories/entities/category.entity';
import { Income } from './incomes/entities/income.entity';
import { Budget } from './budgets/entities/budget.entity';
import { RecurringTransaction } from './recurring-transactions/entities/recurring-transaction.entity';
import { IncomesModule } from './incomes/incomes.module';
import { BudgetsModule } from './budgets/budgets.module';
import { RecurringTransactionsModule } from './recurring-transactions/recurring-transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'expenses.db',
      entities: [User, Expense, Category, Income, Budget, RecurringTransaction],
      synchronize: true, // Solo para desarrollo
      logging: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    ExpensesModule,
    CategoriesModule,
    IncomesModule,
    BudgetsModule,
    RecurringTransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
