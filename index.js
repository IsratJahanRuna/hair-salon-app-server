const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json());
app.use(fileUpload());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymkz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

    const serviceCollection = client.db("hairSalon").collection("serviceList");
    const reviewCollection = client.db("hairSalon").collection("reviews");
    const ordersCollection = client.db("hairSalon").collection("order");
    const adminCollection = client.db("hairSalon").collection("admin");


    // app.post('/addService', (req, res) => {
        
    //     const title = req.body.title;
    //     const file = req.files.file;
    //     const description = req.body.description;
    //     const price = req.body.price;
    //     const newImg = file.data;
    //     const encImg = newImg.toString('base64');
    //     console.log(file,description,title);


    //     var image = {
    //         contentType: file.mimetype,
    //         size: file.size,
    //         img: Buffer.from(encImg, 'base64')
    //     };

    //     serviceCollection.insertOne({ title, description, image, price })
    //         .then(result => {
    //             res.send(result.insertedCount > 0);
    //         })
    // })




    // app.get('/services', (req, res) => {
    //     serviceCollection.find({})
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //             console.log("database connected")
    //         })
    // });

    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ title, description, image, price })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })




    app.get('/services', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
               
            })
    });




    app.post('/addReview', (req, res) => {

        const name = req.body.name;
        const comment =req.body.comments;
        console.log(name,comment);
        //console.log("database connected")


        reviewCollection.insertOne({name,comment})
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/reviews', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
                
            })
 })

 app.get('/order/:id', (req, res) => {
    const id = ObjectID  (req.params.id)
    serviceCollection.find({ _id: id })
        .toArray((err,service) => {
            console.log(service);
            res.send(service[0]);
        })
})



 app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0)
        })
})


app.get('/serviceList', (req, res) => {
    ordersCollection.find({ email: req.query.email })
        .toArray((err, orders) => {
            res.send(orders);
        })
})
// get all order data
app.get('/OrdersList', (req, res) => {
    ordersCollection.find()
      .toArray((err, order) => {
        res.send(order);
      })
  })
  // update status

app.patch('/updateOrdersList/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    ordersCollection.updateOne({ _id: id },
            {
                $set: { status: req.body.status }
            })
            .then(result => {
                res.send(result.modifiedCount > 0 )
            })
    })

    app.delete('/deleteServices/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        serviceCollection.deleteOne({ _id: id })
          .then(result => {
            res.send(result.deletedCount > 0)
          })
      })

      app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        adminCollection.insertOne(newAdmin)
          .then(result => {
            res.send(result.insertedCount > 0)
          })
      })
      app.post('/checkAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

});




app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port);

