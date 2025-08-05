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


app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));


// OTP
const otpRoutes = require('./routes/otpRoutes');
app.use('/api/otp', otpRoutes);


// Auth 
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const session = require('express-session');
const passport = require('passport');

app.use(session({
  secret: 'random_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


// User

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


require('./middlewares/passport');
app.use(passport.initialize());




// Media
const mediaRoutes = require('./routes/mediaRoutes');
app.use('/api/media', mediaRoutes);