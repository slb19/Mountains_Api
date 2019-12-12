const express=require("express");
const mongoose=require("mongoose");
const uuidv4=require("uuid/v4");
const bodyParser=require("body-parser")
const cors=require("cors");
const helmet=require("helmet");

const app=express();
app.use(cors());
app.use(helmet());

const mountainRoutes=require("./routes/mountains.js");
const userRoutes=require("./routes/users.js");

app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended:true}));

app.use(mountainRoutes);
app.use(userRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/mountainsApi", {useNewUrlParser: true ,
                                                            useCreateIndex:true ,
                                                            useFindAndModify:false,
                                                            useUnifiedTopology: true}).catch(error=>console.log(error));
                                                                                                                       
app.get("/", (req,res)=>{
    res.render("landing.ejs");
}); 


app.get("*", (req,res)=>{
    res.status(404).render("error.ejs")
})

const port=process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`MountainsApi has started port: ${port}`)
});