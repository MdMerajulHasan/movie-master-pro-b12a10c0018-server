// encode.js
const fs = require("fs");
const key = fs.readFileSync(
  "./movie-master-pro-firebase-admin-sdk.json",
  "utf8"
);
const base64 = Buffer.from(key).toString("base64");
