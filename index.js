const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const movieUserCollection = db.collection("movieUserDB");

    // apis
    // api to get all movies
    app.get("/movies", async (req, res) => {
      const cursor = movieCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // api to get top 5 movies
    app.get("/movies/top-rated", async (req, res) => {
      const cursor = movieCollection.find({}).sort({ rating: -1 }).limit(5);
      const result = await cursor.toArray();
      res.send(result);
    });
    // api to get recently added movies
    app.get("/movies/recent", async (req, res) => {
      const cursor = movieCollection
        .find({})
        .sort({ releaseYear: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    // api to get user data
    app.get("/users", async (req, res) => {
      const cursor = movieUserCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // api to get movie data by id
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });
    // api to get my-collection
    app.get("/movies/my-collection", (req, res) => {});
    // api to add a new movie data
    app.post("/movies/add", async (req, res) => {
      const newMovie = req.body;
      const result = await movieCollection.insertOne(newMovie);
      res.send(result);
    });
    // api to add new user data
    app.post("/users/add", async (req, res) => {
      const newMovie = req.body;
      const result = await movieUserCollection.insertOne(newMovie);
      res.send(result);
    });
    // api to update movie data
    app.patch("/movies/update/:id", async (req, res) => {});
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
