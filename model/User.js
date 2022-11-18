const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
  nom: { type : String , default: "jhahahaah"},
  prenom: String,
  email: String,
  password: String,
  telephone: String
});

const User = mongoose.model("User", UserSchema);
module.exports ={User};