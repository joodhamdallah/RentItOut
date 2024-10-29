const express = require('express');
const app = express();
require('dotenv').config({ path: './.env' });
const authRoutes = require('./routes/authRoutes'); // Correct path from rootconst userRoutes = require('./userRoutes');
//const userRoutes = require('./routes/userRoutes'); // Correct path from root
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');



app.use(express.json());
app.use('/api/auth', authRoutes);  // Routes for login and signup
//app.use('/api/users', userRoutes); // Routes for user management (requires auth)
app.use('/api', categoryRoutes);
app.use('/api', itemRoutes);  // Prefix all routes with /api


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});