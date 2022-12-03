const mongoose = require("mongoose");
const https = require("https");
var fs = require("fs");
const express = require("express");
const compression = require("compression");
const app = express();
const axios = require("axios");
var privateKey = fs.readFileSync("rygb_cert/cloudflare/rygb.tech.pem", "utf8");
var certificate = fs.readFileSync("rygb_cert/cloudflare/rygb.tech.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };
app.use(express.json());
app.use(compression());
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8444, () => {
  console.log("Private https server listening on port 8444");
});

main().catch((err) => console.log(err));
async function main() {
  //n1F6exFxenbFx5hJ
  await mongoose.connect("mongodb+srv://prvAPI:n1F6exFxenbFx5hJ@cluster0.j1einiz.mongodb.net/?retryWrites=true&w=majority", function(err) {
    if (err) throw err;
    console.log("> Connected to MongoDB Successfully!");
  });
}

app.get("/getTriviaQuestions", async (req, res) => {
  axios({
    method: "get",
    url: "https://opentdb.com/api.php?amount=10",
  }).then((response) => {
    res.send(response.data);
  })
});