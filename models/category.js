//Setup mongoose.
const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Creating the category schema.
const categorySchema= new schema({
    cName: {
        type: String,
        required: true,
        unique: true
    }
})

//Exporting the schema.
var category=mongoose.model("Categories",categorySchema);
module.exports=category;