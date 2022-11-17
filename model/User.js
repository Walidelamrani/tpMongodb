const mongoose = require('mongoose')

const Schema = mongoose.Schema;
//const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    
  //author: ObjectId,
  nom: { type : String , default: "jhahahaah"},
  prenom: String,
  email: String,
  password: String
});

const User = mongoose.model("User", UserSchema);
module.exports ={User};