const mongoose = require('mongoose');
const dbconfig = require('./dbconfig');

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(dbconfig.database, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log(`MongoDB connected:${conn.connection.host}`);
    }
    catch (err) {
        console.log(`ConnectDB ${err}`);
        process.exit(1);
    }
}
module.exports = connectDB;