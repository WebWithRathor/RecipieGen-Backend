import { config } from './src/config/config.js';
import app from './src/index.js';
import { connectDB } from './src/models/db.connect.js';

connectDB();

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});