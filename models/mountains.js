const mongoose=require("mongoose");

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

module.exports=Mountains