const mongoose = require ('mongoose');
const { mongodb } = require('./keys')

const dotenv = require('dotenv').config();
console.log(process.env.MONGODB_USERNAME);
mongoose.connect(mongodb.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.error(err))  


/*useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})*/

