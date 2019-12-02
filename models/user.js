const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema ({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.methods.encryptPassword = async (password) => {
const salt = await bcrypt.genSalt(10);
const hash = bcrypt.hash(password, salt);
return hash;
};

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password1, this.password1);
};
module.exports = mongoose.model('user', UserSchema);