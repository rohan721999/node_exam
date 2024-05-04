
const express = require('express');
const dbConnection = require('./config/mongo_db.js');
const productsRoute = require('./routes/productRoutes.js');
const usersRoute = require('./routes/userRoutes.js');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

function verifyAccessToken (token) {
    const secret = 'myfirsttoken123';
    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function authToken (req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.sendStatus(401);
    }
    const result = verifyAccessToken(token);
    if (!result.success) {
        return res.status(403).json({ error: result.error });
    }
    req.user = result.data;
    next();
}

app.use('/api/products',  authToken, productsRoute);
app.use('/api/user', usersRoute);

app.listen(3000, function(){
    console.log("Application is running on port 3000");
})