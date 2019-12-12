const fs=require("fs");
const mongoose=require("mongoose");

let mountainsData=fs.readFileSync("./mnt.json");
let mountains=JSON.parse(mountainsData)


for(let i=0;i<mountains.length;i++){
    if(mountains[i].Metres){
        let meters=mountains[i].Metres.replace(",","")
        mountains[i].Metres=Number(meters);   
    }if(mountains[i].Feet){
        let feet=mountains[i].Feet.replace(",","")
        mountains[i].Feet=Number(feet);  
    }
}

const mountainsSchema= new mongoose.Schema({
    Mountain:{
        type:String
    },
    Metres:{
        type:Number
    },
    Feet:{
        type:Number
    },
    Range:{
        type:String
    },
    Location_and_Notes:{
        type:String
    }
});

const Mountains=mongoose.model("mountains",mountainsSchema);


mongoose.connect("mongodb://127.0.0.1:27017/mountainsApi-test", {useNewUrlParser: true ,
                                                            useCreateIndex:true ,
                                                            useFindAndModify:false,
                                                            useUnifiedTopology: true});
Mountains.insertMany(mountains).then(data=>{
    console.log(data)
}).catch(error=>{
    console.log(error)
});



