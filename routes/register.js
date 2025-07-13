const router = require('express').Router();
const User=require('../models/user');

router.post('/',async(req,res)=>{
    try{
         console.log("Register request body:", req.body); 
         console.log("Checking if user exists...")
        const username=req.body.username;
        const email=req.body.email;
        const password=req.body.password;
        const user=await User.findOne({email:email});
        if(!user){
            let user=new User({
                username:username,
                email:email,
                password:password
            })
            user.password=user.generateHash(user.password);
            const token=await user.generateAuthToken();

            // it is used to set cookie name to value;
            res.cookie('jwt',token,{
                expires:new Date(Date.now()+1000*60*10),
                httpOnly:true // now user cannot edit the cookie manually means remove etc.
            });
            console.log("User does not exist, proceeding to register.");
            const registered=await user.save();
            console.log("✅ User registered successfully:", registered);

            return res.render('redirectToSuccess');
        }else{
            console.log("⚠️ Email already registered:", email);

            return res.render('redirect');
     
        }
    }catch(error){
        console.error("❌ Registration error:", error);
        return res.status(400).send(error);
    }

})

module.exports=router;