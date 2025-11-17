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
    const watchedCollection = db.collection("watchedDB");

    // apis
    // api to get all movies
    app.get("/movies", async (req, res) => {
      const min = Number(req.query.min);
      const query = {};
      if (min) {
        query.rating = { $gte: min, $lte: 10 };
      }
      const cursor = movieCollection.find(query);
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
    // api to get my-collection
    app.get("/movies/my-collection/:email", async (req, res) => {
      const email = req.params.email;
      const query = { addedBy: email };
      const result = await movieCollection.find(query).toArray();
      res.send(result);
    });
    // api to get movie data by id
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    // api to get watch list data
    app.get("/watch-list/:email", async (req, res) => {
      const email = req.params.email;
      const query = { played: email };
      const cursor = watchedCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // api to add watch list
    app.post("/movies/watch-list", async (req, res) => {
      const watchedMovie = req.body;
      const query = { movie: watchedMovie.movie, played: watchedMovie.played };
      const findWatched = await watchedCollection.findOne(query);
      if (!findWatched) {
        const result = await watchedCollection.insertOne(watchedMovie);
        return res.send(result);
      }
      return res.send("Movie is already in watch list!");
    });

    // api to add a new movie data
    app.post("/movies/add", async (req, res) => {
      const email = req.body.addedBy;
      if (!email) {
        return res.status(400).send({
          success: false,
          message: "You Are Not Login User!",
        });
      }
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
    app.patch("/movies/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedDocument = { $set: req.body };
      const result = await movieCollection.updateOne(query, updatedDocument);
      res.send(result);
    });
    // api to delete a movie
    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });
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
