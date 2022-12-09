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

app.get("/getTriviaQuestions", async (req, res) => {
  axios({
    method: "get",
    url: "https://opentdb.com/api.php?amount=10",
  }).then((response) => {
    res.status(200).send(response.data);
    res.end();
  })
});