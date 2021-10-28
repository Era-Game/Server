const database = require('../utils/firebase.js');

const express = require('express');
let route_util = express.Router();

route_util.get('/test_HTTP_Request', function(request, response){
    // database.ref("Config_Constants").once("value").then((constants) => {
    //     response.send(JSON.stringify(constants.toJSON()));
    // })

    // console.dir(request.query.UID);
    // console.log(JSON.stringify(request.query.UID));
    // response.send(JSON.stringify(request.query.UID));

    // database.ref().once("value").then((all) => {
    //     let uid = request.query.UID;
    //     let username = request.query.username;
    //     let age = request.query.age;
    //     let sex = request.query.sex;

    //     let updates = {
    //         test: {
    //             uid: uid,
    //             username: username,
    //             age: age,
    //             sex: sex,
    //         },
    //     }

    //     database.ref().update(updates);
    // }).catch((error) => {
    //     console.log(error);
    // });

    // response.send("Successful set");

    database.ref("teams").once("value").then((everyteam) => {
        response.send(everyteam.toJSON());
    })
})

module.exports = route_util
