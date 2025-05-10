import express from "express";
import { DataSource } from "typeorm";
import customerRouter from "./routes/Customer";
import bankerRouter from "./routes/Banker";
import transactionRouter from "./routes/Transaction";

const app = express();
const port = process.env.PORT || 1895;
const dbHost = process.env.DB_HOST || "localhost";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: dbHost,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "minibank",
  entities: [__dirname + "/entities/*.ts"],
  synchronize: true,
  logging: true,
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log(`Database connection established successfully to ${dbHost}`);
    // middleware/plugins
    app.use(express.json());
    // routes
    app.use('/api/v1', customerRouter);
    app.use('/api/v1', bankerRouter);
    app.use('/api/v1', transactionRouter);
    // start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });  
  } catch (error) {

    throw new Error(`Unable to connect to the database with error of ${JSON.stringify(error)}..`);    
  }
};

startServer();
