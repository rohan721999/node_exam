const mongoose = require('mongoose');

const mongoConnection = mongoose.connect("mongodb+srv://rohanpanchal:me5yomEFg4IHKUQN@cluster0.3znv5lq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("Database Connected Successfully");
}).catch(err => {
    console.log("Database Not Connected. Error is => " + err);
});

module.exports = mongoConnection;