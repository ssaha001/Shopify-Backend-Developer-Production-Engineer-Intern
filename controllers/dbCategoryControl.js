const category=require("../models/category");
//FUnction used for adding a new category.
module.exports.addCategories=async function(name){
    let cat=await new category({
        cName:name
    });
    await cat.save()
    .then((savedData)=>{console.log(`Category ${savedData.cName} has been saved`)})
    .catch(err=>{console.log("category couldn't be saved because of: "+err)})
}

//Function used for displaying all the categories.
module.exports.displayCategories=async()=>{
    let result=[];
    await category.find({},{"cName":1,"_id":0}).sort('cName').exec()
    .then((res)=>{
        for(let i=0;i<res.length;i++){
            result[i]={'value':res[i].cName}
        }
    })
    return result;
}