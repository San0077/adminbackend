
import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { MongoClient } from 'mongodb';
const app = express()
app.use(express.json());
dotenv.config()
app.use(cors())

var mongoUrl ="mongodb://localhost"
async function createConnection(){
    var client = new MongoClient(mongoUrl);
    await client.connect()
    console.log("connection is ready ")
 return client
}
export var client = await createConnection()

async function passwordMatch(pass){
    var salt = await bcrypt.genSalt(4);
    var hash = await bcrypt.hash(pass,salt);
    return hash;
}

 app.get("/inpiration",async function(req,res){
    let result =await client.db("chart").collection("data").find({}).toArray();
    res.send(result)
 })
 app.post("/inpiration",async function(req,res){
    let values = req.body
   let result =await client.db("chart").collection("data").insertOne({values});
   res.send(result)
   
 })

  app.post("/",async function(req,res){
    let {email,password}=req.body;
    console.log(email)
    let result =await client.db("product").collection("users")
    .findOne({email});
    if(!result){
        res.status(401).send({msg:"invalid"})
    }else{
        var storedPassword = result.password
        var compare = await bcrypt.compare(password,storedPassword)
        if(!compare){
            res.status(401).send({msg:"invalid"})
        }else{
            const token = await jwt.sign({id:result._id},"santhosh");
                res.send({msg:"login sucessfully",token:token})
        }
    }
  })

app.listen(4000,()=>{
    console.log("server is ready")
});
