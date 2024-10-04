const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()
const path = require('path');
const fileUpload = require('express-fileupload');

// Use PORT from .env or default to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(bodyParser.json()); // Parses JSON bodies
app.use(fileUpload()); 


//Routes
const userRoutes = require('./src/routes/userRoute');
const categoryRoutes = require('./src/routes/categoryRoute');

app.use('/users', userRoutes);
app.use('/category', categoryRoutes);


// Serve the uploaded images from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error", err));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and have it listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});