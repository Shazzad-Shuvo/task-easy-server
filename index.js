const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());  //to send and receive data between client and server

app.use(express.json()); //to receive data send from client side in [req.body]

// DB ID pass -------
// taskEeez
// QMa1tuLmJYmdvJmv




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqcyimm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("taskeezDB");
    const taskCollection = database.collection("tasks");



    app.get('/tasks', async(req, res) =>{
      const cursor = taskCollection.find();
      const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/tasks', async(req, res) =>{
      const newTask = req.body;
      
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    })

    app.patch('/tasks/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedTaskStatus = req.body.status;

      // console.log(id, updatedTaskStatus);

      const filter = {_id: new ObjectId(id)};
      const updateDoc = {
        $set: {
          status: updatedTaskStatus
        },
      };

      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    })













    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Taskeez API active')
})


app.listen(port, () =>{
    console.log(`Taskeez running on port: ${port}`);
})