const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require('bcrypt');

const usersSchema= new mongoose.Schema({
   name:{
       type:String,
       required:true,
       trim:true
   },
   email:{
       type:String,
       trim:true,
       lowercase:true,
       unique:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Email is not valid")
           }
       }
   },
   password:{
       type:String,
       trim:true,
       required:true,
       validate(value){
           if(value.length<6){
               throw new Error("Password must be more than 6 characters")
           }
       }
   },
   apiKey:{
       type:String,
       required:true
   },
   createdAt:{
       type:Date,
       default:Date.now
   }
});

usersSchema.pre("save", async function(next){
    const user=this;

        if(user.isModified("password")){
            const salt=await bcrypt.genSalt(10);
            user.password= await bcrypt.hash(user.password,salt)
        }
        next();
});

const Users=mongoose.model("Users",usersSchema);

module.exports=Users