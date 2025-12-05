const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();


app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
    message: 'Welcome to the Todolist API!',
    status: 'Running',
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});