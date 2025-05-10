import { Router, Request, Response } from "express";
import { AppDataSource } from "../Server";
import { Banker } from "../entities/Banker";

const bankerRouter = Router();

bankerRouter.get('/bankers', async (_req: Request, res: Response) => {
  try {
    const bankersRepository = await AppDataSource.getRepository(Banker);
    const bankers = await bankersRepository.find();

    res.status(200).json({
      message: 'Bankers fetched successfully',
      bankers: bankers,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bankers ..',
      error: error,
    });
  }
});

bankerRouter.post('/banker', async (req: Request, res: Response) => {
  try {
    const bankerRepository = AppDataSource.getRepository(Banker);
    const banker = bankerRepository.create(req.body);
    await bankerRepository.save(banker);

    res.status(201).json({
      message: 'Banker created successfully',
      banker: banker,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create a new banker ..',
      error: error,
    });
  }
});

bankerRouter.patch('/bankers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const bankerRepository = AppDataSource.getRepository(Banker); 
    const banker = await bankerRepository.findOneBy({ id: Number(id) });

    if (!banker) {
      return res.status(404).json({
        message: `Banker ${id} not found ..`,
      });
    }

    const updatedBanker = bankerRepository.create({
      ...banker,
      ...req.body,
    });

    await bankerRepository.save(updatedBanker);

    return res.status(200).json({
      message: `Banker ${id} updated successfully`,
      banker: updatedBanker,
    }); 
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update banker ..',
      error: error,
    });
  }
});

export default bankerRouter;
