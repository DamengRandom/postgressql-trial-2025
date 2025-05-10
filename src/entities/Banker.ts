import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, UpdateDateColumn } from "typeorm";
import { Personal } from "./utils/Personal";
import { Customer } from "./Customer";

@Entity("banker")
export class Banker extends Personal {
  @Column({ type: "simple-json", nullable: true })
  address: {
    address: string;
    city: string;
    province: string;
    postcode: number;
  }

  @Column({ unique: true, length: 10000 })
  employee_number: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Customer, {
    cascade: true,
  })
  @JoinTable({
    name: "banker_customer",
    joinColumn: {
      name: "banker",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "customer",
      referencedColumnName: "id",
    },
  })
  customers: Customer[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

// Banker  Customer
// M        M

// Summary:
// one banker can have many customers
// one customer can have many bankers
