import { Router, Request, Response } from "express";
import { AppDataSource } from "../Server";
import { Transaction } from "../entities/Transaction";

const transactionRouter = Router();

transactionRouter.get('/transactions', async (_req: Request, res: Response) => {
  try {
    const transactionRepository = AppDataSource.getRepository(Transaction);
    const transactions = await transactionRepository.find();

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions: transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch transactions ..',
      error: error,
    });
  }
});

export default transactionRouter;
