const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let db;
const dbConnectionStr = process.env.DB_STRING;
const dbName = 'meme-break';
//
const PORT = process.env.PORT || 2121;

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`);
        db = client.db(dbName);
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (request, response) => {
    db.collection('memeInfo').find().sort({ likes: -1 }).toArray()
        .then(data => {
            response.render('index.ejs', { info: data });
        })
        .catch(error => console.error(error));
});

app.put('/addonelike', (request, response) => {
    console.log('Adding like');
    console.log(request.body.memeId);
    console.log(request.body.likes);
    db.collection('memeInfo').updateOne({ memeId: request.body.memeId }, {
        $set: {
            likes: request.body.likes + 1
        }
    }, {
        sort: { _id: -1 },
        upsert: true
    })
        .then(result => {
            console.log('Added One Like');
            response.json('Like Added');
        })
        .catch(error => console.error(error));

});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
});