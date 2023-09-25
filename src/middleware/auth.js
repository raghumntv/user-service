const jwt = require('jsonwebtoken')
const multer = require('multer')
const speakeasy = require('speakeasy');

const User = require('../models/user')

const auth = async(req,res,next)=>{
    try {
        const token =await req.header('Authorization').replace('Bearer ','')
        const decoded =jwt.verify(token,process.env.JWT_SECRET) //extracting user id from token 
        const user = await User.findOne({_id:decoded._id,'tokens.token':token}) 
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).send('authentication failed')      
    }
}

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){

        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return cb(new Error('invalid file format'))
        }

        cb(undefined,true)

    }
})

const verifyOtp = async(secret_key,otp)=>{
    const tokenValidates = speakeasy.totp.verify({
        secret: secret_key,
        encoding: 'base32',
        token: otp,
        window:2
    });
    return tokenValidates
}


module.exports ={auth,upload,verifyOtp}