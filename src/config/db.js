const mongoose = require('mongoose');
const { mongoUri } = require('./env');
const logger = require('../utils/logger');


const connectDB = async () => {
if (!mongoUri) {
throw new Error('MONGO_URI is not defined in .env');
}


await mongoose.connect(mongoUri, {
useNewUrlParser: true,
useUnifiedTopology: true
});


logger.info('Connected to MongoDB');
};


module.exports = connectDB;