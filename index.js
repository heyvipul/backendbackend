const express = require("express")
const mongoose = require("mongoose");
const SECRET_KEY = "afkdhkcxjvndbdnfc"
const MONGODB = "mongodb+srv://vipulgirhe:vipulgirhe@cluster0.ax4dqic.mongodb.net/movies-app"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors");
const bodyParser = require('body-parser');
const User = require("./models/user");
const Movies = require("./models/movie");

require('dotenv').config()
const PORT = 8000
const app = express();

//middlewares
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: "*",   
}));

//mongoose connection
async function main(){
    try {
       await mongoose.connect(MONGODB)
       console.log("mongodb connection successfully!");
    } catch (error) {
        console.log("connection failed");
    }
}
main()


//base route
app.get("/", (req, res) => {
    res.send("hello world from movies");
});


//Get all movies
app.get("/movies", async (req,res)=>{
    try {
        const movies = await Movies.find();
        res.json(movies);
      } catch (error) {
        res.status(500).json({ message: error });
    }
})


//Post a movie
app.post("/movies", async (req,res) => {
    const movie = new Movies(req.body);
    try {
      const newMovie = await movie.save();
      res.status(201).json({newMovie,message:"movie posted"});
    } catch (error) {
      res.status(400).json({ message: "error"});
    }
});

//Search movies
app.get("/movies/search", async (req, res) => {
    try {
      const query = req.query.q;
      //using regex for case-sensitive 
      const regex = new RegExp(query, "i");
      const movies = await Movies.find({
        $or: [
          { Title: regex },
          { Director: regex }
        ]
      });
      res.status(200).json({ movies });
    } catch (error) {
      res.status(500).json({ message: "Error searching movies" });
    }
});


//signup.register
app.post("/register", async(req,res)=>{
    try {
        const{name,email,password} = req.body
        const user_exist = await User.findOne({email})
        if(user_exist){
            return res.send({msg:"user exist"})
        }
        bcrypt.hash(password,4,async(err,hash)=>{
            await User.create({name,email,password:hash})
            res.send({msg:"signup successfull!"})
        })

    } catch (error) {
        res.send({error:"signup failed!"})
        console.log(error);   
    }
})


//login
app.post("/login",async (req,res)=>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.send({msg:"User not exist!"})
    }
    const hash_password = user?.password
    bcrypt.compare(password,hash_password,async(err,result)=>{
        if(err){
            throw err;
        };
        if(result){
            const token = jwt.sign({userId:user._id},SECRET_KEY);
            res.send({msg:"Login successfull!",token:token})
        }else{
            res.send({msg:"password not match"})
        }
        
    })

})



app.listen(8000,()=>{
    console.log(`Api running on 8000`);
})