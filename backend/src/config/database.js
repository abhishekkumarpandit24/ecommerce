const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
    'mongodb+srv://abhishekpandit361:uozcY05cEhbYE8yE@namastenodejs.dqce2.mongodb.net/'
)
}

module.exports = connectDB;
