const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// MiddleWare
app.use(cors());
app.use(express.json());

// base API
app.get("/", (req, res) => {
  res.send("Ema john server is running");
});

// Connect mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undypbz.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  const productCollection = client.db("emaJohnDB").collection("products");
  try {
    // get all the products
    app.get("/products", async (req, res) => {
      const currentPage = parseInt(req.query.currentPage);
      const limit = parseInt(req.query.limit);
      //   console.log(currentPage, limit);
      const query = {};
      const cursor = productCollection.find(query);
      // gat total data count
      const count = await productCollection.estimatedDocumentCount();
      const result = await cursor
        .skip(currentPage * limit)
        .limit(limit)
        .toArray();
      res.send({ count: count, products: result });
    });
  } finally {
  }
};
run().catch(console.dirs);

app.listen(port, () => {
  console.log(`Ema john server is running on http://localhost:${port}`);
});
