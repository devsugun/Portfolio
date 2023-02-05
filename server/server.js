const express = require('express');
const app = express();

const mongodb = require('mongodb');
const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var newData = { 
    order_item_id: order_item_id,
    product_id: product_id,
    product_category: products.product_category_name,
    price: price,
    date: shipping_limit_date,
    total: 90214,
    limit: 20,
    offset: 560
  };
  dbo.collection("orders").insertOne(newData, function(err, res) {
    if (err) throw err;
    console.log("Data inserted");
    db.close();
  });
});


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://devsegun:Domcat-1013@cluster0.ivbooq0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) throw err;
  console.log('Connected to MongoDB');
});

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send('Unauthorized');
  } else {
    const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
      .toString()
      .split(':');

    client.db("olistbr").collection("olist_sellers_dataset").findOne({ seller_id: username, seller_zip_code_prefix: password }, function(err, result) {
      if (err) throw err;
      if (!result) {
        res.status(401).send('Unauthorized');
      } else {
        next();
      }
    });
  }
};

app.get('/', auth, (req, res) => {
  res.send('Welcome to the API');
});

app.get('/data', auth, (req, res) => {
  client.db("olistbr").collection("<collection_name>").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/order_items', auth, (req, res) => {
  const sort = req.query.sort || 'shipping_limit_date';
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  const authHeader = req.headers.authorization;
  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  client.db("olistbr").collection("olist_orders_dataset").find({ seller_id: username }).sort({ [sort]: 1 }).limit(limit).skip(offset).toArray(function(err, orders) {
    if (err) throw err;
    const order_items = [];
    for (const order of orders) {
      client.db("olistbr").collection("olist_order_items_dataset").find({ order_id: order.order_id }).toArray(function(err, items) {
        if (err) throw err;
        order_items.push(...items);
        if (order_items.length === limit) {
          res.send({
            count: order_items.length,
            order_items: order_items
          });
        }
      });
    }
  });
});

app.delete('/order_items/:id', auth, (req, res) => {
  const id = req.params.id;
  const authHeader = req.headers.authorization;
  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  client.db("olistbr").collection("olist_order_items_dataset").findOneAndDelete({ order_item_id: id, seller_id: username }, function(err, result) {
    if (err) throw err;
    if (result.value === null) {
      res.status(404).send({ message: 'Order item not found' });
    } else {
      res.send({ message: 'Order item deleted successfully' });
    }
  });
});

app.put('/account', auth, (req, res) => {
  const authHeader = req.headers.authorization;
  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
    .toString()
    .split(':');

  const updateData = {};
  if (req.body.city) {
    updateData.city = req.body.city;
  }
  if (req.body.state) {
    updateData.state = req.body.state;
  }

  client.db("olistbr").collection("olist_sellers_dataset").findOneAndUpdate(
    { seller_id: username },
    { $set: updateData },
    { returnOriginal: false },
    (err, result) => {
      if (err) throw err;
      if (result.value === null) {
        res.status(404).send({ message: 'Seller not found' });
      } else {
        res.send({ city: result.value.city, state: result.value.state });
      }
    }
  );
});


app.listen(3000, () => {
  console.log('API listening on port 3000');
});
