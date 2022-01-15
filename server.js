//Accessing all the necessary package.
const express=require("express")
const bodyParser = require("body-parser");
const path=require("path");
const Server=require('http')
const exphbs = require("express-handlebars");
const nav=require("./controllers/navigation")

//Setting up express.
const app=express();

//Setup body parser.
app.use(bodyParser.urlencoded({ extended: true }));

//Configuring the environment.
const dotenv = require("dotenv");
dotenv.config({path: "./keys/myEnvKeys.env"});

// Establishing Handlebars.
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  defaultLayout: "index"
}));
app.set('view engine', '.hbs');

// Establishing mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to the MongoDB database.");
})
.catch((err) => {
  console.log(`Cannot connect because of the error....${err}`);
});

//Serving static files
app.use("/static", express.static(path.join(__dirname, "/static")));

//Setup to listen on the routes.
app.use("/",nav);
app.use("/add",nav);
app.use("itemAdded",nav);
app.use("/view",nav)
app.use("/del/:id",nav)
app.use("/mod/:id",nav)
app.use("/addCat",nav)
app.use("/modDetails",nav)
app.use("searchName",nav)
app.use("searchCategory",nav)
app.use("searchQuantity",nav)
app.use("searchCriteria",nav)

//Setting up the port for connection
var HTTP_PORT = process.env.PORT || 7080;

// Function to check if the connection has been established. 
// This function is called after the connection has been successfully established.
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);