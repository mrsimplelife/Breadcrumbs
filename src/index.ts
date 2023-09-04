import express from 'express';
import { initializeDatabase } from './db';
import pageRouter from './routes/page';

const app = express();

initializeDatabase();

app.use('/page', pageRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
