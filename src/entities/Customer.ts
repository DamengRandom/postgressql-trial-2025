import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, UpdateDateColumn } from "typeorm";
import { Transaction } from "./Transaction";
import { Personal } from "./utils/Personal";
import { Banker } from "./Banker";

@Entity("customer")
export class Customer extends Personal {
  @Column({ default: 0 })
  balance: number;

  @Column({ type: "simple-json", nullable: true })
  info: {
    age: number;
    hair_color: string;
  }

  @Column({ type: "simple-json", nullable: true })
  address: {
    street: string;
    city: string;
    province: string;
    postcode: number;
  }

  @Column({ type: "simple-array", default: [] })
  family_members: string[];

  @OneToMany(() => Transaction, (transaction) => transaction.customer, {
    onDelete: "CASCADE", // if customer is deleted, all transactions will be deleted
  })
  @JoinColumn({ name: "customer_transactions" })
  transactions: Transaction[];

  @ManyToMany(() => Banker, (banker) => banker.customers)
  bankers: Banker[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
