const express=require("express");
const mongoose=require("mongoose");
const uuidv4=require("uuid/v4");
const bodyParser=require("body-parser")

const app=express();

const Mountains=require("./models/mountains.js");
const Users=require("./models/users.js")
const sendApiKeyEmail=require("./email/email.js")
const dataValidation=require("./middlewares/dataValidation.js")

app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/mountainsApi-test", {useNewUrlParser: true ,
                                                            useCreateIndex:true ,
                                                            useFindAndModify:false,
                                                            useUnifiedTopology: true}).catch(error=>console.log(error));
                                                                                                                       

app.get("/", (req,res)=>{
    res.render("landing.ejs");
}); 

app.post("/register", async (req,res)=>{
   
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
});

app.get("/api/mountains", dataValidation,async(req,res)=>{
   
    try{
        if(!req.query.apiKey) return res.status(401).json({msg:"No apiKey. If you dont have an apiKey please Regiser"});

            const validApiKey=await Users.find({apiKey:req.query.apiKey})
               
            if(validApiKey.length===0){
                return res.status(401).json({msg:"You have to provide a valid apiKey. Please Register"})
            }else{

            //Search by country , range and altitude options
        if(req.query.r && req.query.c && (req.query.mtm || req.query.mtf || req.query.ltm || req.query.ltf)){

            const{r, c, mtm, mtf, ltm, ltf}=req.query;
            const range=r
            const regexR = new RegExp( '(' + range + ')', 'gi' );
            const country=c
            const regexC = new RegExp( '(' + country + ')', 'gi' );
            const moreThanMeters=Number(mtm)
            const moreThanFeet=Number(mtf)
            const lessThanMeters=Number(ltm)
            const lessThanFeet=Number(ltf)

                const rows=await Mountains.find({},"-_id Mountain Metres Feet Range Location_and_Notes")

                const data=[]
                    rows.forEach(row=>{
                        if(row.Location_and_Notes.match(regexC) && row.Range.match(regexR) && (row.Metres>moreThanMeters ||
                                                                                             row.Feet>moreThanFeet || 
                                                                                             row.Metres<lessThanMeters || 
                                                                                             row.Feet<lessThanFeet)){
                            data.push(row)
                        }
                        return data;
                    });

                    if(data.length===0) return res.status(404).json({msg:'request not found'});
                                const numOfResults=data.length;
                                    return res.json({search:data,
                                        results:numOfResults});

                                    }

            //Search by range and altitude options
        if(req.query.r && (req.query.mtm || req.query.mtf || req.query.ltm || req.query.ltf)){

            const{r, mtm, mtf, ltm, ltf}=req.query;
            const range=r
            const regex = new RegExp( '(' + range + ')', 'gi' );
            const moreThanMeters=Number(mtm)
            const moreThanFeet=Number(mtf)
            const lessThanMeters=Number(ltm)
            const lessThanFeet=Number(ltf)
                const rows=await Mountains.find({},"-_id Mountain Metres Feet Range Location_and_Notes")
                                
                    const data=[]
                        rows.forEach(row=>{
                            if(row.Range.match(regex) && (row.Metres>moreThanMeters ||
                                                     row.Feet>moreThanFeet || 
                                                     row.Metres<lessThanMeters || 
                                                     row.Feet<lessThanFeet)){
                                data.push(row)
                                    }
                                return data;
                            });
                                
                        if(data.length===0) return res.status(404).json({msg:'request not found'});
                            const numOfResults=data.length;
                                return res.json({search:data,
                                    results:numOfResults});
                                
                            }

            //Search by country and altitude options
        if(req.query.c && (req.query.mtm || req.query.mtf || req.query.ltm || req.query.ltf)){

            const{c, mtm, mtf, ltm, ltf}=req.query;
            const country=c
            const regex = new RegExp( '(' + country + ')', 'gi' );
            
            const moreThanMeters=Number(mtm)
            const moreThanFeet=Number(mtf)
            const lessThanMeters=Number(ltm)
            const lessThanFeet=Number(ltf)
                const rows=await Mountains.find({},"-_id Mountain Metres Feet Range Location_and_Notes")
                                                    
                    const data=[]
                        rows.forEach(row=>{
                            if(row.Location_and_Notes.match(regex) && (row.Metres>moreThanMeters || 
                                                                            row.Feet>moreThanFeet || 
                                                                            row.Metres<lessThanMeters || 
                                                                            row.Feet<lessThanFeet)){
                                data.push(row)
                                    }
                                return data;
                                });
                                                    
                    if(data.length===0) return res.status(404).json({msg:'request not found'});
                        const numOfResults=data.length;
                            return res.json({search:data,
                                results:numOfResults});
                                                    
                            }

        //search by mountain
        if(req.query.m){
            const mountain=req.query.m

            const data=await Mountains.find({Mountain:{"$regex":mountain, "$options":"i"}},"-_id Mountain Metres Feet Range Location_and_Notes" );
            
            if(data.length===0) return res.status(404).json({msg:'request not found'});
                    
            const numOfResults=data.length;
                return res.json({search:data,
                    results:numOfResults});
                }
        //search by mountain range
        
        if(req.query.r  && req.query.mtm===undefined 
                        && req.query.ltm===undefined
                        && req.query.mtf===undefined
                        && req.query.ltf===undefined
                        && req.query.c===undefined){

            const range=req.query.r
            const data=await Mountains.find({Range:{"$regex":range, "$options":"i"}},"-_id Mountain Metres Feet Range Location_and_Notes" );
            
            if(data.length===0) return res.status(404).json({msg:'request not found'});
                    
            const numOfResults=data.length;
                return res.json({search:data,
                    results:numOfResults});
                }
     
        //search by more than bymeters
        
        if(req.query.mtm && req.query.ltm===undefined
                         && req.query.mtf===undefined
                         && req.query.ltf===undefined
                         && req.query.c===undefined
                         && req.query.r===undefined){
            
            const moreThanMeters=Number(req.query.mtm)
           
            const data=await Mountains.find({Metres:{$gt:moreThanMeters}},"-_id Mountain Metres Feet Range Location_and_Notes" );
           // console.log(data)
            if(data.length===0) return res.status(404).json({msg:'request not found'});
                    
            const numOfResults=data.length;
                return res.json({search:data,
                    results:numOfResults});
                }

                //search more than byfeet
                if(req.query.mtf && req.query.mtm===undefined
                                 && req.query.ltm===undefined
                                 && req.query.ltf===undefined
                                 && req.query.c===undefined
                                 && req.query.r===undefined){
                                
                    const moreThanFeet=Number(req.query.mtf)
                    const data=await Mountains.find({Feet:{$gt:moreThanFeet}},"-_id Mountain Metres Feet Range Location_and_Notes" );
                                
                        if(data.length===0) return res.status(404).json({msg:'request not found'});
                                        
                        const numOfResults=data.length;
                            return res.json({search:data,
                                results:numOfResults});
                            }
            //search less than bymeters
        if(req.query.ltm && req.query.mtm===undefined
                        && req.query.mtf===undefined
                        && req.query.ltf===undefined
                        && req.query.c===undefined
                        && req.query.r===undefined){
                        
            const lessThanMeters=Number(req.query.ltm)
            const data=await Mountains.find({Metres:{$lt:lessThanMeters}},"-_id Mountain Metres Feet Range Location_and_Notes" );
                        
                if(data.length===0) return res.status(404).json({msg:'request not found'});
                                
                 const numOfResults=data.length;
                    return res.json({search:data,
                        results:numOfResults});
                    }

                    //search less than feet
                    if(req.query.ltf && req.query.mtm===undefined
                                     && req.query.ltm===undefined
                                     && req.query.mtf===undefined
                                     && req.query.c===undefined
                                     && req.query.r===undefined){
                        
                        const lessThanFeet=Number(req.query.ltf)
                        const data=await Mountains.find({Feet:{$lt:lessThanFeet}},"-_id Mountain Metres Feet Range Location_and_Notes" );
                                    
                            if(data.length===0) return res.status(404).json({msg:'request not found'});
                                            
                             const numOfResults=data.length;
                                return res.json({search:data,
                                    results:numOfResults});
                                }
            //search by country
            if(req.query.c  && req.query.mtm===undefined 
                            && req.query.ltm===undefined
                            && req.query.mtf===undefined
                            && req.query.ltf===undefined
                            && req.query.r===undefined){
                        
            const country=req.query.c
            const regex = new RegExp( '(' + country + ')', 'gi' );
            const rows=await Mountains.find({},"-_id Mountain Metres Feet Range Location_and_Notes")
           
                const data=[]
                rows.forEach(row=>{
                    if(row.Location_and_Notes.match(regex)){
                        data.push(row)
                    }
                    return data
                });              
                         
                if(data.length===0) return res.status(404).json({msg:'request not found'});
                       const numOfResults=data.length;
                                return res.json({search:data,
                                results:numOfResults});
                                }

            //default noquery string    
          else if(req.query.apiKey && Object.keys(req.query).length===1){
        const data=await Mountains.find({}, "-_id Mountain Metres Feet Range Location_and_Notes");
            if(!data){
                return res.status(404).json({msg:'request not found'});
            }
        const numOfResults=data.length
            res.json({search:data,
                      results:numOfResults})
            }
        }
            
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Server Error"});    
    }   
});

app.get("*", (req,res)=>{
    res.status(404).render("error.ejs")
})
/*
const port=process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`MountainsApi has started port: ${port}`)
});
*/

module.exports=app