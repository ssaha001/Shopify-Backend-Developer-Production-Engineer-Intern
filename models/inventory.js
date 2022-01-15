//Setup the mongoose
const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Setting up the product schema
const productSchema= new schema({
    pName: {
        type: String,
        required: true,
        unique:true
    },
    pDesc: {
        type: String,
    },
    pCategory:{
        type:String,
        required: true
    },
    pQuantity:{
        type:Number,
        required:true
    },
    pAddDate: {
        type: Date,
        default: Date.now()
    },
    pModDate:{
        type:Date,
        default:Date.now()
    },
    pImg:{
        type: String,
        default:""
    }
})

//Exporting the schema
var product=mongoose.model("Inventory",productSchema);
module.exports=product;