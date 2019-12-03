const mongoose = require ('mongoose');
const { mongodb } = require('./keys')


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

