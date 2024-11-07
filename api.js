const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cron = require('node-cron');
const app = express();
require('dotenv').config({ path: './.env' });


const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalsRoutes');
const discountsRoutes = require('./routes/discountsRoutes');
const returningItemsRoutes = require('./routes/ReturningItemsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const billRoutes = require('./routes/billRoutes');
const ReminderService = require('./services/ReturningItems/ReminderService');
const ProfitsRoutes = require('./routes/ProfitsRoutes');



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
// Schedule the job to run at midnight every day
cron.schedule('0 0 * * *', () => {
  console.log('Running daily reminder job');
  ReminderService.sendReturnReminderEmails();
});
app.use('/api/auth', authRoutes);  
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);  
app.use('/api', userRoutes); 
app.use('/api/rentals', rentalRoutes); 
app.use('/api', discountsRoutes);
app.use('/api', returningItemsRoutes);
app.use('/api', paymentRoutes); 
app.use('/api', feedbackRoutes); 
app.use('/api', ProfitsRoutes ); 
app.use('/api/bills', billRoutes); 



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




