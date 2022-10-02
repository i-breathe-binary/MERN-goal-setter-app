const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { errorHandler } = require('./middlewares/errorMiddleware');
const port = process.env.port || 5000;
const { connectDB } = require('./config/db');


connectDB();

const app = express();

// JSON body parser
app.use(express.json());
// For URL encoded
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend
if(process.env.NODE_ENV === 'production'){

    app.use(express.static(path.join(__dirname, '../frontend/build'))); // Serve static frontend
    app.get('*', (req, res) => {

        return res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'));

    });

}else{

    app.get('/', (req, res) => res.send('Please set to production'));

}

// Override the default express
// error handler with our own handler.
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));


