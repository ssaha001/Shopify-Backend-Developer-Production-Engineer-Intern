const await =require("await");
const product=require("../models/inventory");

//Function for adding an item to the database.
module.exports.addItem=async(name,desc,quantity,date,cat,fname="")=>{
    let error=false;
    let item=await new product({
        // pName
        // pDesc
        // pCategory
        // pQuantity
        // pAddDate
        pName:name,
        pDesc:desc,
        pCategory:cat,
        pQuantity:quantity,
        pAddDate:date,
        pImg:fname
    })
    await item.save()
    .then((savedData)=>{console.log(`Product ${savedData.pName} has been saved`)})
    .catch(err=>{console.log("Product couldn't be saved because of: "+err);error=true})
    return error
}

//Function for displaying all the items stored in inventory.
module.exports.displayItems=async()=>{
    let result=[];
    await product.find({},{"_id":0}).sort('pName').exec()
    .then((res)=>{
        for(let i=0;i<res.length;i++){
            result[i]={
                'name':res[i].pName,
                'desc':res[i].pDesc,
                'quantity':res[i].pQuantity,
                'cat':res[i].pCategory,
                'addedDate':res[i].pAddDate.toLocaleString('en-US')
                .substring(0,res[i].pAddDate.toLocaleString('en-US').indexOf(',')),
                'image':res[i].pImg
            }
        }
    })
    return result;
}

//Function for deleting a specified item.
module.exports.delItem=async(name)=>{
    let imgPath=''; 
    await product.findOne({"pName":name},{"_id":0,"pImg":1}).exec()
    .then(result=>imgPath=result.pImg)
    .catch((err)=>console.error(`Product not found because of ${err}`))
    await product.deleteOne({pName:name}).exec()
    .then(()=>{console.log(`Product deleted succesfully`)})
    .catch((err)=>{console.log("product couldn't be deleted because of "+err)})
    return imgPath;//Passing the image path so that it can be deleted from the file system.
}

//Function for modifying an existing item.
module.exports.modItem=async(orgName,name,desc,quantity,date,cat)=>{
    await product.updateOne(
        { pName: orgName},
        { $set: { pName:name,        
                  pDesc:desc,
                  pCategory:cat,
                  pQuantity:quantity,
                  pAddDate:date
                }
        }
      ).exec().then(console.log(`Updated the product named ${orgName}`));
}

//Function for searching an item based on criteria.
module.exports.searchItem=async(obj)=>{
    let result=[];
    //Searching by name
    if(obj.name!==undefined){
        await product.find({pName:obj.name},{"_id":0}).sort('pName').exec()
        .then((res)=>{
            for(let i=0;i<res.length;i++){
                result[i]={
                    'name':res[i].pName,
                    'desc':res[i].pDesc,
                    'quantity':res[i].pQuantity,
                    'cat':res[i].pCategory,
                    'addedDate':res[i].pAddDate.toLocaleString('en-US')
                    .substring(0,res[i].pAddDate.toLocaleString('en-US').indexOf(',')),
                    'image':res[i].pImg
                }
            }
        })
    }
    //Searching by category
    else if(obj.category!==undefined){
        await product.find({pCategory:obj.category},{"_id":0}).sort('pName').exec()
        .then((res)=>{
            for(let i=0;i<res.length;i++){
                result[i]={
                    'name':res[i].pName,
                    'desc':res[i].pDesc,
                    'quantity':res[i].pQuantity,
                    'cat':res[i].pCategory,
                    'addedDate':res[i].pAddDate.toLocaleString('en-US')
                    .substring(0,res[i].pAddDate.toLocaleString('en-US').indexOf(',')),
                    'image':res[i].pImg
                }
            }
        })
    }
    //Searching by quantity.
    else{
        await product.find({pQuantity:{"$gte":obj.min,"$lte":obj.max}},{"_id":0}).sort('pName').exec()
        .then((res)=>{
            for(let i=0;i<res.length;i++){
                result[i]={
                    'name':res[i].pName,
                    'desc':res[i].pDesc,
                    'quantity':res[i].pQuantity,
                    'cat':res[i].pCategory,
                    'addedDate':res[i].pAddDate.toLocaleString('en-US')
                    .substring(0,res[i].pAddDate.toLocaleString('en-US').indexOf(',')),
                    'image':res[i].pImg
                }
            }
        })
    }
    return result; //Passing the found values to the user.
}