const dotenv = require('dotenv').config();


module.exports = {
    mongodb: {

        URI: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-xf0y1.mongodb.net/test?retryWrites=true&w=majority`

    }
}