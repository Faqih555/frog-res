const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const BSON = require('bson');

// Connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'nama_database';
const collectionName = 'nama_koleksi';

// Membaca file gambar menjadi buffer
const gambarBuffer = fs.readFileSync('path/to/gambar.jpg');

// Mengonversi gambar ke dalam format BSON
const bson = new BSON();
const gambarBSON = bson.serialize({gambar: gambarBuffer});

// Data field lain selain gambar
const dataLain = {
  nama: 'John Doe',
  umur: 30,
  alamat: 'Jl. Jendral Sudirman No. 123, Jakarta',
};

// Menggabungkan data gambar dan data lain menjadi objek yang akan disimpan
const dokumen = {
  gambar: gambarBSON,
  ...dataLain, // Menambahkan field lain ke dalam objek
};

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(upload);

  // Menyimpan dokumen ke dalam koleksi MongoDB
  db.collection(dart).insertOne(dokumen, (err, result) => {
    if (err) throw err;
    console.log('Dokumen berhasil disimpan ke dalam MongoDB');
    client.close();
  });
});