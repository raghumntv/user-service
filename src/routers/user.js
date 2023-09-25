const express = require('express')
const sharp = require('sharp')
const User = require('../models/user')
const {auth,upload,verifyOtp} = require('../middleware/auth')
const {sendOtpInEmail} = require('../services/email')
const router = new express.Router()


router.post('/users',async(req,res)=>{

    const user = new User(req.body)
    try {
        await user.save()
        console.log(user)
        res.status(201).send(user)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
 
    }
})

router.post('/user/sign-up',async(req,res)=>{

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
 
    }
})

router.post('/user/login',async(req,res)=>{
    try {
        const user = await User.findByCredential(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})     
    } catch (err) {
        res.status(400).send({'error':err.message})
    }
})

router.post('/user/log-out',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
               return token.token !== req.token
        })
        await req.user.save()
        res.send()  
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/user/logout-all',auth,async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()  
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users',async(req,res)=>{

    try {
       const users = await User.find({})
       console.log(users)
       res.send(users)
    } catch (err) {
        res.status(500).send()
    }
})

router.get('/user/me',auth,async(req,res)=>{
    res.send(req.user)
})

router.get('/user/:user_id',async(req,res)=>{
    const _id =req.params.user_id
    console.log(_id)

    try {

        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        console.log(user)
        res.send(user)
        
    } catch (err) {
        res.status(500).send(err) 
    }
})

router.patch('/user/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','age','email','password']
    const isvalidUpdate = updates.every((key)=> allowedUpdates.includes(key))
    if(!isvalidUpdate){
        res.status(404).send('invaild fields in updates')
    }
    try {
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }

})

router.delete('/user/me',auth, async(req,res)=>{
    try {
       await req.user.remove()    
       res.send(req.user)
    } catch (error) {
        res.status(500).send() 
    }
})

router.post('/user/me/avatar',upload.single('fileUpload'),auth,async(req,res)=>{
    req.user.avatar =await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer() 
    await req.user.save()
    res.send()
},
(error,req,res,next)=>{
    res.status(400).send({error:error.message})
}
)

router.delete('/user/me/avatar',auth, async(req,res)=>{
    try {
        req.user.avatar = undefined
       await req.user.save()    
       res.send(req.user)
    } catch (error) {
        res.status(500).send() 
    }
})

router.get('/user/:user_id/avatar',async(req,res)=>{
    try {
       const user = await User.findById(req.params.user_id)
       if(!user){
           throw new Error()
       }
       res.set('Content-Type','image/png')
       res.send(user.avatar)
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/generate-otp',auth,async(req,res)=>{
    try {
        const user = await User.findByEmail(req.body.email,req.user._id)
        const {otp} = await user.generateOtp();
        await sendOtpInEmail(user.email,user.name,otp)
        res.status(200).send(otp)          
    } catch (err) {
        res.status(400).send({err:err.message})
    }
})

router.post('/verify-otp',auth,async(req,res)=>{
    try {
        const secret_key = req.user.secret
        const otp = req.body.otp
        const isvaildOtp = await verifyOtp(secret_key,otp)
        if(!isvaildOtp){
           return res.status(440).send({'message':'Invaild OTP / OTP has expired'})
        }
        res.status(200).send({'verified':isvaildOtp})
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router