const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {   // MONGO_URI=mongodb://localhost:27017/testdb
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Database Connection successfull!');
}).catch((e) => {
    console.log('Database Connection failed!');
})