const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const SSLCommerzPayment = require('sslcommerz-lts');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors');
const app = express()

require('dotenv').config();

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 
// 

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.tjz8e2v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });


    //********************* */ sslcommerze /* ***********************************//
    const store_id = process.env.STORE_ID;
    const store_passwd = process.env.STORE_PASSWORD;
    const is_live = false;
    const ordersCollection = client.db("chefDB").collection("orders");

    app.post("/payment", async (req, res) => {
      // Plan details sent from client side
      const planDetails = req.body;
      // console.log(planDetails)

      // Convert price into an integer
      const price = parseInt(planDetails.price);
      // console.log( typeof price)

      // Create a transaction ID using ObjectId
      const tranId = new ObjectId().toString();
      // console.log(tran_id)




      const data = {
        total_amount: price,
        currency: "BDT",
        tran_id: tranId,
        success_url: `${process.env.SERVER_API}/payment/success`,
        fail_url: `${process.env.SERVER_API}/payment/failed`,
        cancel_url: `${process.env.SERVER_API}/payment/cancel`,
        ipn_url: `${process.env.SERVER_API}/payment/payment-status`,
        shipping_method: "Courier",
        product_name: planDetails.product_name,
        product_category: planDetails.product_category,
        product_profile: "general",
        cus_name: planDetails.cus_name ? planDetails.cus_name : 'unknown',
        cus_email: planDetails?.cus_email,
        cus_add1: planDetails.cus_add1 ? planDetails.cus_add1 : 'unknown',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: planDetails.cus_country ? planDetails.cus_country : 'Bangladesh',
        cus_phone: planDetails.cus_phone ? planDetails.cus_phone : 'Unknown',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };

      // Initialize SSLCommerz payment
      

    //   const data = {
    //     total_amount: price,
    //     currency: 'BDT',
    //     tran_id: tranId, // use unique tran_id for each api call
    //     success_url: `${process.env.SERVER_API}/payment/success`,
    //     fail_url: `${process.env.SERVER_API}/payment/failed`,
    //     cancel_url: `${process.env.SERVER_API}/payment/cancel`,
    //     ipn_url: `${process.env.SERVER_API}/payment/payment-status`,
    //     shipping_method: 'Courier',
    //     product_name:  planDetails?.product_name,
    //     product_category: planDetails.product_category,
    //     product_profile: 'general',
    //     cus_name: planDetails.cus_name ? planDetails.cus_name : 'unknown',
    //     cus_email: 'customer@example.com',
    //     cus_add1: planDetails.cus_add1 ? planDetails.cus_add1 : 'unknown',
        // cus_add2: 'Dhaka',
        // cus_city: 'Dhaka',
        // cus_state: 'Dhaka',
        // cus_postcode: '1000',
        // cus_country: planDetails.cus_country ? planDetails.cus_country : 'Bangladesh',
        // cus_phone: planDetails.cus_phone ? planDetails.cus_phone : 'Unknown',
        // cus_fax: '01711111111',
        // ship_name: 'Customer Name',
        // ship_add1: 'Dhaka',
        // ship_add2: 'Dhaka',
        // ship_city: 'Dhaka',
        // ship_state: 'Dhaka',
        // ship_postcode: 1000,
        // ship_country: 'Bangladesh',
    // };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
       sslcz.init(data).then((apiResponse) => {
         // Get the payment gateway URL
         let GatewayPageURL = apiResponse.GatewayPageURL;
        //  console.log(GatewayPageURL, 'URL')
         res.send({ url: GatewayPageURL });

       })

      //  const order = { ...planDetails, tran_id, status: 'pending'};
      //  const result = ordersCollection.insertOne(order);
      //  })

      // POST request for handling successful payment
      //  app.post("/payment/success", async (req, res) => {

      //   // Update order status in the database to successful
      //   const result = await ordersCollection.updateOne(
      //     { tran_id },
      //     { $set: { status: 'success'} }
      //   );
      //    //redirect to payment success page in client
      //   res.redirect("http://localhost:5173/payment/success");
      // });

      // app.post("/payment/fail", async (req, res) => {

      //   // Update order status in the database to failed
      //   const result = await ordersCollection.updateOne(
      //     { tran_id },
      //     { $set: { status: 'failed'} }
      //   );
      //  //redirect to payment failed page in client
      //   res.redirect("http://localhost:5173/payment/failed");
      // });

      // app.post("/payment/cancel", async (req, res) => {

      //   // Update order status in the database to canceled
      //   const result = await ordersCollection.updateOne(
      //     { tran_id },
      //     { $set: { status: 'canceled'} }
      //   );
      // //redirect to payment cancel page in client
      //   res.redirect("http://localhost:5173/payment/cancel");
      // });

      // app.post("/payment/payment-status/:tran_id", async (req, res) => {

      //   // Update order status in the database based on IPN notification
      //   const tran_id = req.params.tran_id
      //   const result = await ordersCollection.updateOne(
      //     { tran_id },
      //     { $set: { status: status === "VALID" } }
      //   );
      //   res.send({ message: "IPN received" , tran_id });
      // });

      //  Insert order details into the database

    })

    //********************* */ sslcommerze /* ***********************************//


    const chefCollection = client.db('chefDB').collection('chefs')
    const bookingsCollection = client.db('chefDB').collection('bookings')


    app.get('/chefs', async (req, res) => {
      const result = await chefCollection.find().toArray()
      res.send(result)
    })

    app.get('/bookings', async (req, res) => {
      const result = await bookingsCollection.find().toArray()
      res.send(result)
    })

    app.get('/bookings/:email', async (req, res) => {
      const email = req.params.email
      const query = { user: email }
      const result = await bookingsCollection.find(query).toArray()
      res.send(result)
    })

    app.post('/bookings', async (req, res) => {
      const data = req.body;
      const result = await bookingsCollection.insertOne(data)
      res.send(data)
    })


    app.post('/jwt', async (req, res) => {
      const user = req.body;
      // const t = req.body
      const token = jwt.sign(req.body, '2d5d81b62d33a1a0a638f2c9cdfd451b0c0b203576241b5ed3ac17dc9ac2cf3c385ad552795826632490d22374ecd8f13aa54112f76ab68ce6dc6d1d3c6d1fde', {
        expiresIn: '1h'
      })
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false
        })
        .send({ success: true })
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hello from epicuream server')
})

app.listen(port, () => {
  console.log(`server is flying on POST:${port}`)
})