const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://faqih:gantinama@frog-res.7orxjmh.mongodb.net/frog-res")
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
    }
})

const dataBahasa = new mongoose.Schema({
    nama:{
        type: String,
        required: true,
    },
})


const bahasa = new mongoose.model("bahasa", dataBahasa)


const upload = new mongoose.model("artikel", artikel)

const collection = new mongoose.model("user", LogIn)



module.exports = {collection, upload, bahasa}

