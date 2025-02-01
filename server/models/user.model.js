import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:[true,"must provide an email"],
    unique:[true,"email must be unique"]
  },
  password:{
    type:String,
    required:[true,"must provide password"],
  }
})

const User = mongoose.model('User',userSchema);

export default User;
