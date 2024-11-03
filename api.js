const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
require('dotenv').config({ path: './.env' });

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalsRoutes');
const discountsRoutes = require('./routes/discountsRoutes');
const FeedbacksRoutes = require('./routes/FeedbacksRoutes');

const returningItemsRoutes = require('./routes/ReturningItemsRoutes');

const paymentRoutes = require('./routes/paymentRoutes');  

app.use(express.json());
app.use(cookieParser());

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

app.get('/api/debug/session', (req, res) => {
  res.status(200).json({
    session: req.session
  });
});
app.use('/api/auth', authRoutes);  
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);  
app.use('/api', userRoutes); 
app.use('/api/rentals', rentalRoutes); 
app.use('/api', discountsRoutes);
app.use('/api', FeedbacksRoutes);
app.use('/api', returningItemsRoutes);
app.use('/api', paymentRoutes); 


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});