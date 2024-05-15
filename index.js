const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { useAsyncError } = require('react-router-dom');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());
// app.use(cookieParser())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ddlv3rx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// const logger = async( req, res, next )=>{
//   console.log('request for call', req.host, req.originalUrl)
//   next()
// }
// const verifyToken = async(req, res, next)=>{
//   const token = req.cookies?.token;
//   console.log('value of token in middleware', token);
// if(!token){
//   return res.status(401).send({message: 'unAuthorized'})
// }
// jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded)=>{
// // error
// if(error){
//   console.log(error);
//   return res.status(401).send({message: 'unauthorized'})
// }
// console.log('value in the token', token);
// })
//   next()
// }
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const volunteerCollection = client.db('volunteerDB').collection('volunteering');
    const requestedCollection = client.db('volunteerDB').collection('requestedVolunteer')


    // app.post('/jwt',  async(req, res)=>{
    //   const user = req.body;
    //   console.log('user for token', user);
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})

    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: 'none'
    //   })
    //   .send({success: true})
    // })
    // app.post('/logout', async(req, res)=>{
    //   const user = req.body;
    //   console.log('logging out', user);
    //   res.clearCookie('token', {maxAge: 0} .send({success: true}))
    // })
    app.get('/volunteerNeeded',  async(req, res)=>{
      const cursor = volunteerCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get('/reqCollection',  async(req, res)=>{
      console.log('cookies', req.cookies);
      const cursor = requestedCollection.find();
      const result  = await cursor.toArray();
      res.send(result)
      console.log(result);
    })
    app.get('/volunteerNeeded/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await volunteerCollection.findOne(query);
      res.send(result)
    })
    app.post('/volunteers', async(req, res)=>{
      const volunteer = req.body;
      console.log(volunteer);
      const result = await volunteerCollection.insertOne(volunteer);
      res.send(result)
    })
    app.post('/requestedVolunteer', async(req, res)=>{
      const reqVolunteer = req.body;
      console.log(reqVolunteer);
      const result = await requestedCollection.insertOne(reqVolunteer);
      res.send(result)
    })
    // app.get('/reqVolunteer', async(req, res)=>{
    //   const id
    // })
    app.get('/volunteering/:email', async(req, res)=>{
      console.log(req.params.email);
    
      const result = await volunteerCollection.find({email:req.params.email}).toArray()
      res.send(result)
    })
    app.get('/reqVolunteering/:email', async(req, res)=>{
      console.log(req.params.email);
     
      const result = await requestedCollection.find({email:req.params.email}).toArray()
      res.send(result)
    })

    app.get('/singleVolunteer/:id', async(req, res ) =>{
      console.log(req.params.id);
      const result = await volunteerCollection.findOne({_id: new ObjectId(req.params.id)})
      res.send(result)
    })
    
    app.put('/updateVolunteer/:id', async(req, res)=>{
      console.log(req.params.id);
      const query = {_id: new ObjectId(req.params.id)};
      const data ={
        $set: {
          thumbnail:req.body.thumbnail,
          post_title:req.body.post_title,
          category:req.body.category,
          deadline:req.body.deadline,
          volunteer_needed:req.body.volunteer_needed,
          location:req.body.location,
          description:req.body.description
         
        }
      }
      const result=await volunteerCollection.updateOne(query, data);
      res.send(result)
    })
    
    app.delete('/volunteerDelete/:id', async(req, res) =>{
      // const id = req.params.id;
      // const query = {_id: new ObjectId(id)};
      const result = await volunteerCollection.deleteOne({_id: new ObjectId(req.params.id)});
    
      res.send(result)
      console.log(result);
    })
    app.delete('/reqVolunteerDelete/:id', async(req, res) =>{
      // const id = req.params.id;
      // const query = {_id: new ObjectId(id)};
      const result = await requestedCollection.deleteOne({_id: new ObjectId(req.params.id)});
      res.send(result)
      console.log(result);
      // res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Volunteering is Running')
});

app.listen(port, ()=>{
    console.log(`Uniting Volunteering is Running on Port ${port}`);
})
