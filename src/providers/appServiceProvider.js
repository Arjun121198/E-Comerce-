const mongoose = require('mongoose');
const RouteProvider = require('../providers/routeServiceProvider');


require('dotenv').config();

class AppServiceProvider {

    static async connectDatabase() {
        try {
            await mongoose.connect(process.env.MONGO_DB_URI);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Database connection error", error);
            throw error; 
        }
    }

    static initializeProviders(app) {
        RouteProvider.registerRoutes(app);
        console.log("Initializing providers...");
    }
}

module.exports = AppServiceProvider;
