const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');


const UserSchema = new Schema ({
    username: String,
    email: String,
    password: String,
    reset_password_token: String,
    reset_password_expires: Date
});


UserSchema.methods.encryptPassword = function(password) {

return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.matchPassword = function(password){
    passwordhash = bcrypt.hash(password, 10)
    return passwordhash;
};
module.exports = mongoose.model('user', UserSchema);