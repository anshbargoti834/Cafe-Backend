const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const logger = require('./utils/logger');


const start = async () => {
try {
await connectDB();
app.listen(port, () => {
logger.info(`Server running on port ${port}`);
});
} catch (err) {
logger.error('Failed to start server: ' + (err.stack || err));
process.exit(1);
}
};


start();