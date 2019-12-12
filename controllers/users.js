const Users=require("../models/users.js")
const sendApiKeyEmail=require("../email/email.js")
const uuidv4=require("uuid/v4");

exports.registerNewUser=async(req,res)=>{
    try{
        
        if(!req.body.name || !req.body.email){
            return res.status(400).json({error:"You have to provide all fields"})
        }
        const apiKey=uuidv4();

        const newUser=new Users(req.body);
        newUser.apiKey=apiKey;
        
            await newUser.save();
            sendApiKeyEmail(newUser.email, newUser.name, apiKey)
                res.status(201).json({name:newUser.name, email:newUser.email});

    }catch(error){
        
        if(error.errors){
            res.status(400).json({error:"Your name must be more than 3 characters"});
        }
        if(error.errmsg){
            res.status(400).json({error:"This email is already taken"});
        }else{
            res.status(500).json({error:"Server Error"});
        }   
    }  
}