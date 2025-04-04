import { config } from './src/config/config.js';
import app from './src/index.js';
import { connectDB } from './src/models/db.connect.js';
import redis from './src/utils/redis.js';

connectDB();

redis.on('connect', () => {
  console.log('Connected to Redis');
});


app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});