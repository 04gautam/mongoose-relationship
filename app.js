const express = require("express")
const mongoose = require("mongoose")
const app = express()

// Connecting server to the mongoDB
mongoose.connect("mongodb://0.0.0.0/newBlogApp")
.then(()=>console.log("Database is connected"))
.catch((err)=>console.error("Something went wrong:", err))


// Creating schema of User

const userSchema = new mongoose.Schema({
      name: String,
      email: String,
});

// Creating schema of Post

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
})

// Creating models of User and Post

const User = mongoose.model("User", userSchema)

const Post = mongoose.model("Post", postSchema)

// From here routes started to hendel creating User and Post

app.get("/create-user", async (req, res)=>{
  try{

    const user = await User({
      name:"Gautam",
      email: "gautam@gmail.com"
    })

    user.save()
    res.send(user)

  }catch(err){
    console.error(err.message)
  }
})

app.get("/create-post", async (req, res)=>{
  try{

    const user = await User.findOne({email: "gautam@gmail.com",})

    const post = await Post({
      title: "This is first Blog",
      content: "Hello Teena I am learning complex things",
      author: user._id
    })

    post.save()

    res.send(post)

  }catch(err){
    res.send(`Hey see this error >=> ${err.message}`)
  }
})


app.get("/posts", async (req, res)=>{
  try{

    const allPosts = await Post.find().populate("author");
    res.send(allPosts)

  }catch(err){
    res.send(`Hey see this error >=> ${err.message}`)
  }
})



app.listen(3000, ()=>{console.log("server is running on port no 3000")})