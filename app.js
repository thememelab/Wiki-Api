// ap set up

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")

// application set up
const app = express();
// app view
app.set('view engine', 'ejs');
// app use modules
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// - ->> connect to the database
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });
// mongod schema and connection
const articleSchema = {
    tittle : String,
    content :String
}

// creat  an article collection in the database
const Artcile = mongoose.model("Article", articleSchema);

// get article route
app.route("/articles")
.get( function(req, res ){
  Artcile.find( function (err, foundArticle){
    if(!err){
      res.send(foundArticle)
    }
    else {
      console.log(err)
    }

  })
})
.post( function(req, res ){
 let articleTitle = req.body.tittle
 let articleContent = req.body.content
 const newArticle = new Artcile({
  tittle: articleTitle,
  content: articleContent
  })
  newArticle.save()
})
.delete( function(req, res){
  Artcile.deleteMany(function (err){
    if(!err){
      res.send("successfull deleted all articles. ")
    } else {
      res.send(err);
    }
  })
});

app.route("/articles/:articleTitle")
.get(function( req, res){
  Artcile.findOne({tittle:req.params.articleTitle}, function (err, foundArticle ){
    if(!err){
      res.send(foundArticle)
    }
     else {
      res.send("No article matching this tittle were found")
    }
  });
})
.put( function(req,res){
   Artcile.update(
     {tittle:req.params.articleTitle},
     {tittle:req.body.tittle, content: req.body.content},
     {overwrite: true},
    function(err){
    if(!err){
    res.send(" Article  was succefull updated ")
    }
  });
})
.patch( function(req,res){
  Artcile.update(
    {tittle:req.params.articleTitle},
    {$set: req.body },
   function(err){
   if(!err){
   res.send(" Article  was succefull updated ")
   }
 })
})
.delete(function (req, res){
  Artcile.deleteOne({tittle:req.params.articleTitle},
  function(err) {
    if (!err){
        res.send("article  was succefull deleted")
      }
    })
  }
);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
