import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expense } from '../../expenses/entities/expense.entity';
import { Income } from '../../incomes/entities/income.entity';
import { Budget } from '../../budgets/entities/budget.entity';
import { RecurringTransaction } from '../../recurring-transactions/entities/recurring-transaction.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Expense, expense => expense.user)
  expenses: Expense[];

  @OneToMany(() => Income, income => income.user)
  incomes: Income[];

  @OneToMany(() => Budget, budget => budget.user)
  budgets: Budget[];

  @OneToMany(() => RecurringTransaction, recurringTransaction => recurringTransaction.user)
  recurringTransactions: RecurringTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
