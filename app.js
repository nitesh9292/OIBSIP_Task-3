const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();




app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const uri = "mongodb+srv://niteshjaiswal9292:k5I54ajIlBar3EJj@cluster0.qam1asd.mongodb.net/todolistDB";

mongoose.connect(uri);

// const today = new Date();
// // console.log(today);
// const options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
//   };

//  const day = today.toLocaleDateString("en-US", options);

const itemsSchema = new mongoose.Schema({
    name:String
})

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"Welcome to my todolist!"
});

const item2 = new Item({
    name:"Hit the + button to aff a new item."
});

const item3 = new Item({
    name:"<-- Hit this to delete an item."
});

const defaultItems = [item1,item2,item3];

const listSchema = new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});

const List = mongoose.model("List",listSchema);




app.get('/',function(req,res)
{
   

    Item.find({})
.then(foundItems =>{
    if(foundItems.length === 0)
    {
        
Item.insertMany(defaultItems)
.then(function(){
    console.log("successfully saved the items to DB");
})
.catch(function(err){
    console.log(err);
})

res.redirect("/");
    }
    else
    {
        res.render("list",{listTitle:"Today", newListItems:foundItems})
    }
   
})
.catch(err=>{
    console.log(err);
})


   
})

app.post('/',function(req,res)
{
   let itemName =req.body.newItem;
   let listName = req.body.list;
   const item = new Item({
    name: itemName
   })

   if(listName === "Today")
   {      
        item.save();
        res.redirect("/");
   }
   else
   {
    List.findOne({name:listName})
    .then(function(foundList)
    {
       
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+ listName);
    })
    .catch(function(err)
    {
        console.log(err);
    })
   }
 
})

app.post("/delete",function(req,res){
    const checkedItemId =  req.body.checkbox;
    const listName =req.body.listName;

    if(listName == "Today")
    {
        Item.findByIdAndRemove(checkedItemId)
        .then(function(){
            console.log("item deleted successfully");
            res.redirect("/");
        })
        .catch(function(err)
        {
            console.log(err);
    })
    }
    else
    {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}})
        .then(function()
        {
            res.redirect("/"+ listName);
        })
        .catch(function(err){
            console.log(err);
        })
    }
  
})

app.get("/:customeListName",function(req,res){
    const customeListName = _.capitalize(req.params.customeListName);

    
    List.findOne({name:customeListName})
    .then(function(foundList)
    {
        if(!foundList)
        {
            const listItem = new List({
                name: customeListName,
                items: defaultItems
            });
        
            listItem.save();
            res.redirect("/"+ customeListName);
        }
        else
        {
            res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
        }
    })
    .catch(function(err)
    {
       console.log(err);
    })
   

  
})



app.get("/about", function(req,res){
    res.render("about")
})

app.listen("3000",function()
{
    console.log("Server is running on port 3000");
})