const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config({ path: './.env' });

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const rentalRoutes = require('./routes/rentalsRoutes');




app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);  
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);  
app.use('/api', userRoutes); 
app.use('/api', rentalRoutes); 



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});