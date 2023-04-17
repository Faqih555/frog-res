const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/FrogRes")
.then(() =>{
    console.log("mongodb conected")
})
.catch(() =>{
    console.log("failed to connect")
})

const LogIn = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

const artikel = new mongoose.Schema({
    judul:{
        type: String,
        required: true,
    },
    konten:{
        type: String,
        required: true,
    },
    tanggal: {
        type: Date,
        default: Date.now
    },
    source:{
        type: String,
        required: true,
    }
})

const upload = new mongoose.model("artikel", artikel)

const collection = new mongoose.model("user", LogIn)



module.exports = {collection, upload}