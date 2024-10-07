const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');

// Use PORT from .env or default to 3000
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parses URL-encoded bodies
app.use(bodyParser.json()); // Parses JSON bodies
app.use(fileUpload()); 

const AppServiceProvider = require('./src/providers/appServiceProvider');

// Serve the uploaded images from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

(async () => {
  try {
    
    await AppServiceProvider.connectDatabase();
    AppServiceProvider.initializeProviders(app);


      // Start the server
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
      });
  } catch (err) {
      console.error('Failed to start server:', err);
  }
})();

app.get('/', (req, res) => {
  res.send('Hello, World!');
});
