const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();
const _ = require("lodash");

const Post = require("./database/post");

const homeStartingContent = 
  "Hi 👋, I'm Prasanna Biswas, I am a curious Fullstack Software Developer";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then (()=>console.log(`MongoDB Connected to DB`))
.catch((err)=>console.log(err));

app.get("/",(req,res)=>{
  Post.find()
  .then((posts)=>{
    res.render("home",{homeStartingContent: homeStartingContent, posts: posts});
  })
  .catch((err)=>console.log(err));  
});

app.get("/about",(req,res)=>{
  res.render("about",{aboutContent: aboutContent});
});

app.get("/contact",(req,res)=>{
  res.render("contact",{contactContent: contactContent});
});

app.get("/compose",(req,res)=>{
  res.render("compose");
});

app.post("/compose",(req,res)=>{  
  const title = _.capitalize(req.body.postTitle);
  const content = req.body.postBody;

  const post = new Post({
    title: title,
    post: content
  });

  post.save()
  .then(()=>console.log("Added to db."))
  .catch((err)=>console.log(err));
  res.redirect("/");
});

app.get("/posts/:postName",(req,res)=>{
  const requestedTitle = _.capitalize(req.params.postName);

  Post.findOne({title: requestedTitle})
  .then((posts)=>{
    res.render("post",{
      title: posts.title,
      content: posts.post
    });    
    res.redirect(`/posts/${requestedTitle}`);
  })
  .catch((err)=>console.log(err));

});


app.listen(process.env.PORT, function() {
  console.log(`Server started on port ${process.env.PORT}`);
});
