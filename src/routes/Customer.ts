import { Router, Request, Response } from "express";
import { Customer } from "../entities/Customer";
import { AppDataSource } from "../Server";
import { Transaction } from "../entities/Transaction";

const customerRouter = Router();

customerRouter.get('/customers', async (_req: Request, res: Response) => {
  try {
    const customersRepository = AppDataSource.getRepository(Customer);
    const customers = await customersRepository.find();

    res.status(200).json({
      message: 'Customers fetched successfully',
      customers: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch customers ..',
      error: error,
    });
  }
});

// demo-only: just try to use the query builder functionality and see what it can do
customerRouter.get('/customers/transactions', async (req: Request, res: Response) => {
  try {
    const min = Number(req.query.min as string) || 0;
    const max = Number(req.query.max as string) || 1_000_000_000_000;
    
    const customersRepository = AppDataSource.getRepository(Customer);
    const customers = await customersRepository
      .createQueryBuilder('customer')
      .addSelect('customer.balance')
      .leftJoinAndSelect('customer.transactions', 'transactions')
      .where('customer.balance >= :minBalance AND customer.balance <= :maxBalance', { minBalance: min, maxBalance: max })
      .getMany();

    res.status(200).json({
      message: 'Customers fetched successfully',
      customers: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch customers ..',
      error: error,
    });
  }
});

customerRouter.get('/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customerRepository = AppDataSource.getRepository(Customer);
    const customer = await customerRepository.findOneBy({ id: Number(id) });

    res.status(200).json({
      message: 'Customer fetched successfully',
      customer: customer,
    }); 
  } catch (error) {
    res.status(500).json({
      message: `Failed to fetch customer ${id} ..`,
      error: error,
    });
  }
});

customerRouter.post('/customer', async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const customersRepository = AppDataSource.getRepository(Customer);
    const customer = customersRepository.create(req.body);
    await customersRepository.save(customer);

    res.status(201).json({
      message: `Customer ${username} created successfully`,
      customer: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create a new customer ..',
      error: error,
    });
  }
});

customerRouter.post('/customers/:id/transaction', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, amount } = req.body;

    const customerRepository = AppDataSource.getRepository(Customer);
    const customer = await customerRepository.findOneBy({ id: Number(id) });

    if (!customer) {
      return res.status(404).json({
        message: `Customer ${id} not found ..`,
      });
    }

    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transaction = transactionRepository.create({
      type,
      amount,
      customer,
    });

    await transactionRepository.save(transaction); // save the transaction to the database

    if (type === 'deposit') {
      customer.balance += amount;
    } else {
      customer.balance -= amount;
    }

    await customerRepository.save(customer); // save the customer to the database

    return res.status(201).json({
      message: 'Transaction created successfully',
      transaction: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update customer transaction ..',
      error: error,
    });
  }
});

customerRouter.delete('/customers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const customerRepository = AppDataSource.getRepository(Customer);
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const customer = await customerRepository.findOneBy({ id: Number(id) });

    if (!customer) {
      return res.status(404).json({
        message: `Customer ${id} not found ..`,
      });
    }

    // 先删除该客户的所有交易记录
    await transactionRepository.delete({ customer: { id: Number(id) } });
    
    // 然后删除客户
    await customerRepository.remove(customer);

    return res.status(200).json({
      message: `Customer ${id} and all their transactions deleted successfully`,
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      message: 'Failed to delete customer ..',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default customerRouter;
