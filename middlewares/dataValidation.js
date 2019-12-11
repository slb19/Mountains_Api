const dataValidation=(req,res,next)=>{

   for(let i in req.query){
       if(i==="mtm" || i==="ltm" || i==="mtf" || i==="ltf"){

           let propertyValue =isNaN(req.query[i])
          
           if(propertyValue===true){
            return next(res.status(400).json({msg:`${i} must be a number`}))
           }
       }
   }
    next()
}

module.exports=dataValidation