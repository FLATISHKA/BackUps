
const url = 'mongodb://127.0.0.1:27017'
const config =
    { useNewUrlParser: true, useUnifiedTopology: true , poolSize: 3}

const mongo = require('mongodb').MongoClient
let mongoClient 

const dbClient = async () => {
    if(mongoClient){
        return mongoClient
    }
    try {
        const client = await mongo.connect(url, config);
        mongoClient = client.db('myDB');
    } catch (err) {
        throw err;
    }
    return mongoClient;
};
module.exports.dbClient = dbClient;