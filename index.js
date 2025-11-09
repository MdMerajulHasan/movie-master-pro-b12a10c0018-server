const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middle wires
app.use(cors());
app.use(express.json());
// -------------------------------------------------------

// mongodb
// mongodb uri
const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.dcp9uru.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// sending response to root api
app.get("/", (req, res) => {
  res.send("Movie Master Server is Running");
});

// run function to work with mongodb
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const db = client.db("movieMasterPro");
    const movieCollection = db.collection("movies");

    // apis
    app.get('/movies',async (req, res)=>{
        const cursor = movieCollection.find({});
        const result = await cursor.toArray();
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
//calling the run function
run().catch(console.dir);
// ---------------------------------------------------------------

app.listen(port, () => {
  console.log("movie master server is running on port: ", port);
});
