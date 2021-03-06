//Getting all the packages required.
const express=require("express");
const dbCatControl = require("./dbCategoryControl");
const dbInvControl = require("./dbInventoryControl");
const path=require('path');
const multer=require('multer')
const fs=require('fs');
const await=require("await")
const helper=require("../validator/validateImage");

//Setting up multer to store image.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './static/pics');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({
     storage: storage,
     fileFilter: function(req,file,callback){
         if(!helper.validateImage(file)){
            req.fileValidationError=true;
            return callback(null,false,req.fileValidationError);
         }req.fileValidationError=false;
         callback(null,true);
     }
    });

//Setting up express to handle all the routes.
const router=express.Router();
//Handling the base route
router.get("/", async function(req,res){
    res.render("navigations/productList",{
        data:await dbInvControl.displayItems()
    })
});

//Adding an item to inventory
router.get("/add",async function(req,res){
    res.render("navigations/addProduct",{
        cat:await dbCatControl.displayCategories()
    });
});

//This function is executed after the user enters details of the new product.
router.post("/itemAdded",upload.single('photo'),async function(req,res){
    const data=req.body;
    const file=req.file;
    if(req.fileValidationError!==undefined){
        if(!req.fileValidationError){
            let val=await dbInvControl.addItem(data.name,data.desc,data.quantity,data.date,data.category,file.filename);
            if(!val){
            res.render("navigations/confirmation",{
                confirmMsg:`${data.quantity} - ${data.name} has been succesfully added to the inventory`
            })
        }
        else{
            res.render("navigations/confirmation",{
                confirmMsg:`${data.name} already exisists in the inventory`
            })
        }
        }else{
            res.render("navigations/confirmation",{
                confirmMsg:`File must be an image only`
            })
        }
    }else{
        if(!await dbInvControl.addItem(data.name,data.desc,data.quantity,data.date,data.category)){
            res.render("navigations/confirmation",{
                confirmMsg:`${data.quantity} - ${data.name} has been succesfully added to the inventory`
            })
        }
        else{
            res.render("navigations/confirmation",{
                confirmMsg:`${data.name} already exisists in the inventory`
        })
    }
    }
})

//Function to display all the items stored in inventory.
router.get("/view",async function(req,res){
    res.render("navigations/productList",{
        data:await dbInvControl.displayItems()
    })
})

//Deleting a particular item from inventory.
router.post("/del/:id",async(req,res)=>{
    let imgPath=await dbInvControl.delItem((req.params.id).substring(1));
    if(imgPath!==''){fs.unlink(`static/pics/${imgPath}`, (err => {
        if (err) console.error(err);
        else {
          console.log("File deleted succesfully.");
        }
    })
    )}
    res.render("navigations/productList",{
        data:await dbInvControl.displayItems(),
        msg:`Product ${(req.params.id).substring(1)} has been deleted succesfully`
    })
})

//Variable to store original name of the item to be modified.
let orgName='';

//This function is called when the user wants to modify a certain product.
router.post("/mod/:id",async(req,res)=>{
    orgName=(req.params.id).substring(1);
    res.render("navigations/modProduct",{
        cat:await dbCatControl.displayCategories()
    });
})

//Handling the modified product details sent from the user.
router.post("/modDetails",async function(req,res){
    const data=req.body;
    await dbInvControl.modItem(orgName,data.name,data.desc,data.quantity,data.date,data.category);
    res.render("navigations/productList",{
        data:await dbInvControl.displayItems(),
        msg:`${orgName} has been succesfully modified`
    })
})

//For searching a product by name.
router.get("/searchName",(req,res)=>{
    res.render("navigations/interaction",{
        name:"name"
    })
})

//For searching a product by quantity.
router.get("/searchQuantity",(req,res)=>{
    res.render('navigations/interaction',{
        quantity:"quantity"
    })
})

//For searching a product by category.
router.get("/searchCategory",async(req,res)=>{
    res.render('navigations/interaction',{
        category:"category",
        cat:await dbCatControl.displayCategories()
    })
})

//Handling the user's search criteria.
router.post("/searchCriteria",async(req,res)=>{
    console.log(req.body)
    if(req.body.catName===undefined){
    let val=await dbInvControl.searchItem(req.body);
    if(val[0]!==undefined){
        res.render("navigations/productList",{
            data:val
        });
        }else{
        res.render("navigations/productList",{
            notFound: "No Result"
        });
        }
    }else{
        await dbCatControl.addCategories(req.body.catName);
        res.render("navigations/addProduct",{
            inform:`Category ${req.body.catName} added succesfully`,
            cat:await dbCatControl.displayCategories()
        });
    }
})

//Handling the request to add a new category.
router.get("/addCat",(req,res)=>{
    res.render("navigations/interaction",{
        addCat:"Add a new category"
    })
})

module.exports=router;