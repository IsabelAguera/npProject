const mongoose = require ('mongoose');
const { mongodb } = require('./keys');


mongoose.connect('mongodb://localhost:27017/click-trip', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

.then(db => console.log('DB is connected'))
.catch(err => console.error(err))