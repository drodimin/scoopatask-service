
const mongoose  = require('mongoose')
const validator = require('validator')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const userSchema = new mongoose.Schema({    
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password:{
        type: String,
        required: false,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Please enter your password!')
            }else if(validator.equals(value.toLowerCase(),"password")){
                throw new Error('Password is invalid!')
            }else if(validator.contains(value.toLowerCase(), "password")){
                throw new Error('Password should not contain password!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    google: {
        access_token: String,
        refresh_token: String,
        scope: String,
        token_type: String,
        id_token: String,
        expiry_date: Date
    },
    createdAt:{
      type: Date,
      default: Date.now
    },
    lastLoggedAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
  });

  userSchema.statics.checkValidCredentials = async (email, password) => {
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login 2')
    }
    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login 2')
    }

    return user
}

userSchema.methods.newAuthToken = async function(){
    const user  = this
    let token;
    try{
          token = jwt.sign({ _id: user.id.toString() },process.env.JWT_SECRET);
    }catch(e){
        console.log(e);
    }
    console.log(token);
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

//hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    //await Post.deleteMany({author: user._id})
    next()
})

const User = mongoose.model('User', userSchema);
module.exports = User;
