const express = require("express")
const app = express()
// Remember to switch to your live secret key in production!
const stripe = require('stripe')('sk_test_51HMbwoHlAknTTFcl4XxWrNKTIKh9U9XySmUGdinj4Y4Xahf0Ay7pqS1faGy5ZfCgPEiRxMo5XT63lFzZNl7sEEW900Od9xDnwl');
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())


const port = 5000


const inventory = [
  { id:"001", name:"Bohomian Bed Frame", description:"Simple bed latform made from walnut wood and finished in Bohemian style.",
    amount:20, price:249.99, image:["bed01-1.jpg","bed01-2.jpg"], category:"bedroom" },
  { id:"002", name:"Glasstop Work Desk", description:"Minimalistic desk toppped with high quality glass.",
    amount:5, price:65, image:["desk01-1.jpg","desk01-2.jpg"], category:"living" },
  { id:"003", name:"Rustic Contemporary Dresser", description:"Made from ashwood, drawers are lined white felt for an embellished look.",
    amount:3, price:350, image:["dresser01-1.jpg","dresser01-2.jpg"], category:"storage" },
  { id:"004", name:"Sphere Floor Lamp", description:"Simple and elegant featuring sturdy bottom from beech wood and brass stand.",
    amount:5, price:50, image:["lamp01-1.jpg","lamp01-2.jpg"], category:"lighting" },
  { id:"005", name:"Tall Side Table", description:"Inspired by folk design, perfect as an accent piece.",
    amount:5, price:80, image:["side01-1.jpg","side01-2.jpg"], category:"bedroom" },
  { id:"006", name:"Rattan Lounge Chair", description:"Crafted from sustainable wood, adds leisure and brightens up any space.",
    amount:1, price:150, image:["chair01-1.jpg","chair01-2.jpg"], category:"living" },
  { id:"007", name:"Glasstop Coffee Table", description:"Adds a minimalistic, modern feel to your space. Steel frame in brass finish, tempered glass top.",
    amount:5, price:81.5, image:["side02-1.jpg","side02-2.jpg"], category:"living" },
  { id:"008", name:"Hanging Basket Shelf", description:"Three concentric shelves netted with wood and cotton.",
    amount:10, price:49.99, image:["shelf02-1.jpg","shelf02-2.jpg"], category:"storage" },
  { id:"009", name:"Three Tier Shelf", description:"Bamboo storage shelf, perfect for all your decorations.", amount:5,
    price:75.5, image:["shelf01-1.jpg","shelf01-2.jpg"], category:"storage" },
  { id:"010", name:"Rattan Floor Mirror", description:"Rattan and iron mirror with basket for storage.",
    amount:5, price:100, image:["mirror01-1.jpg","mirror01-2.jpg"], category:"living" },
  { id:"011", name:"Bedside Light", description:"Simple yet glamorous. Iron and linen-mix.",
    amount:5, price:55.5, image:["lamp02-1.jpg","lamp02-2.jpg"], category:"lighting" },
  { id:"012", name:"Plush Armchair", description:"Vintage-looking chair, cheerful and lovely.",
    amount:6, price:320, image:["chair02-1.jpg","chair02-2.jpg"], category:"living" },
  { id:"013", name:"Rustic Bed Platform", description:"Wood bed frame with an industrial and rustic look.",
    amount:1, price:219.99, image:["bed02-1.jpg","bed02-2.jpg"], category:"bedroom" },
  { id:"014", name:"Faux Plant", description:"Brightens your space with some greenery, 3ft tall.",
    amount:2, price:25, image:["plant01-1.jpg","plant01-2.jpg"], category:"living" },
  { id:"015", name:"Round Glasstop Table", description:"Round glasstop with crossing metal legs.",
    amount:2, price:50.5, image:["side03-1.jpg","side03-2.jpg"], category:"living" },
  { id:"016", name:"Long Sofa", description:"Deep cushioning for comfortable slouching, linen cover, oak legs.",
    amount:2, price:450, image:["sofa01-1.jpg","sofa01-2.jpg"], category:"living" }
]


app.post('/checkout', async(req, res) => {
  // Compute price from cart data sent from client
  var cart = req.body.myCart
  var taxPercent = 0.08
  console.log("Cart received on server side", cart)
  var price = cart.reduce( (accumulator, item) => {
    return accumulator + inventory[item.id].price * item.amount
  }, 0)
  // Here we will make a request to the Stripe to get a payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: (price*100 + Math.round(price*taxPercent*100)),  // Strip takes price in cents
    currency: 'usd',
    // Verify your integration in this guide by including this parameter
    metadata: {integration_check: 'accept_a_payment'},
  });
  // returns paymentIntent from Stripe to client
  res.json({client_secret: paymentIntent.client_secret, tax_percent: taxPercent})
})


app.get('/inventory', (req, res) => {
    res.json(inventory)
})


app.listen(port, () => console.log(`Server started on port ${port}`))