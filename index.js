const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// middle wires
app.use(cors());
app.use(express.json());

// apis
app.get("/", (req, res) => {
  res.send("Movie Master Server is Running");
});
app.listen(port, () => {
  console.log("movie master server is running on port: ", port);
});
