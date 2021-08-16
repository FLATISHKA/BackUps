const express = require('express');
let data = require('./persistance');
const { asyncMiddleware } = require('./middleware');
const api = express.Router();
const Player = require('./player.js');
const Trophy = require('./trophy');
const ObjectID = require('mongodb').ObjectID

const db = []

api.get('/player/:id', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const id = req.params.id
    const givenID = new ObjectID(id)
    dbClient.collection('player').findOne({ _id: givenID }, function (err, result) {
        console.log(id)
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send(result);
        }
    });
}));

api.get('/players', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const name = req.query.name
    const score = parseInt(req.query.score)
    dbClient.collection('player').find({ name: name, score: score }).toArray(function (err, result) {
        console.log(name,score)
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send(result);
        }
    });
}));

api.post('/player', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const payload = req.body;
    const player = new Player(payload.uuid, payload.name, payload.score)

    dbClient.collection('player').insertOne(player, function (err, result) {
        if (result) {
            return res.status(200).send(player);
        } else {
            return res.status(404).send(player);
        }
    });
}));

api.put('/player', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const payload = req.body;
    const id = payload.uuid
    dbClient.collection('player').updateOne({ uuid: id },
        {
            $set: {
                'name': payload.name,
                'score': payload.score
            }
        }, function (err, result) {
            if (result) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send(result);
            }
        });
}));

api.delete('/player/:id', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const id = parseInt(req.params.id)
    dbClient.collection('player').deleteOne({ uuid: id }, function (err, result) {
            if (result) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send(result);
            }
        });
}));

api.post('/trophy/', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const payload = req.body;
    const trophy = new Trophy(payload.playerUUID, payload.name, payload.place)

    dbClient.collection('trophy').insertOne(trophy, function (err, result) {
        if (result) {
            return res.status(200).send(trophy);
        } else {
            return res.status(404).send(trophy);
        }
    });
}));

api.get('/trophy/:id', asyncMiddleware(async (req, res) => {
    const dbClient = await data.dbClient();
    const id = parseInt(req.params.id)

    dbClient.collection('trophy').find({ playerUUID: id }).toArray (function (err, result) {
        if (result) {
            return res.status(200).send(result);
        } else {
            return res.status(404).send(result);
        }
    });
}));

module.exports = api;