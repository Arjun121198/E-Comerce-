const userRoutes = require('../routes/userRoute');
const categoryRoutes = require('../routes/categoryRoute');
const productRoutes = require('../routes/productRoute');

class RouteProvider {
    static registerRoutes(app) {
        app.use('/users', userRoutes);
        app.use('/category', categoryRoutes);
        app.use('/product', productRoutes);
        console.log("Routes registered");
    }
}

module.exports = RouteProvider;
