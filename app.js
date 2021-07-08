const express= require("express");
const mongoose= require("mongoose");
const { MONGO_URI } = require("./config/keys");
const path= require('path')

const app=express();

mongoose.connect(MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true });

mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected");
});

mongoose.connection.on("error",(error)=>{
    console.log("MongoDB connection failed");
});

require('./models/user')
require('./models/postModel')

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/user"));
app.use(require("./routes/post"));

if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"))

    
    app.get("/*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}

app.listen(process.env.PORT || 5000,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Server started successfully!!!");
    }
})