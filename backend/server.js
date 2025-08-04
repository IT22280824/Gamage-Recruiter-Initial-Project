const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Media Gallery Web App API is running...');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
