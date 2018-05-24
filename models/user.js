const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//bcrypt is used for hashing ... this is original bcrypt for node not js optimization
const bcrypt = require('bcrypt');

/*
  About enum...Allows for enumeration over array
  here we are using the method property to help us check how the user logged in
*/

//create Schema
const userSchema = new Schema({
  method: {
    type: "string",
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  profile: {
    firstName:{
      type: String,
      lowercase: true,
      default:''
    },
    lastName: {
      type: String,
      lowercase: true,
      default:''
    },
    customerId:{
      type: String,
      default:''
    },
    orderHistory:[
      {
        type: String,
        default:''
      }
    ],
    locations:[
      {
        lat:String,
        lng:String
      }
    ]
  }
})

//can't use arrow function right here because of scope
userSchema.pre('save', async function(next){
  try {
    //if userSchema method is not local we skip this
    if(this.method !== "local"){
      next();
    }
    //generate salt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password, salt);

    this.local.password = passwordHash;
    next();
  } catch(err){
    next(err);
  }
})

userSchema.methods.isValidPassword = async function(newPassword){
  try{
    //we have nested the password in the local object
    return await bcrypt.compare(newPassword, this.local.password);
  } catch(err){
    throw new Error(err);
  }
}

//create model
const User = mongoose.model('user', userSchema);

//export model
module.exports = User;
