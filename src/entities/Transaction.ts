import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Customer } from "./Customer";

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

@Entity("transaction")
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: TransactionType })
  type: string;

  @Column({ type: "numeric" })
  amount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Customer, (customer) => customer.transactions, {
    onDelete: "CASCADE", // if customer is deleted, transactions will also be deleted
  })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;
}

// Customer  Transaction
// 1         M
// Summary:
// one transaction belongs to one customer
// one customer can have many transactions
