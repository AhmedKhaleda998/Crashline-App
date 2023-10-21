const mongoose = require("mongoose");

exports.connection = () => {
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to the database!");
    }).catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });
}