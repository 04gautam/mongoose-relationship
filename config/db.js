const mongoose = require("mongoose")

function DBconnection(){
  mongoose.connect("mongodb://0.0.0.0/all-example")
  .then(()=>console.log("Database connected to server: "))
  .catch((err)=>console.error("Could not connect to MongoDB", err))
}

module.exports = DBconnection;