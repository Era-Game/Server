const database = require('../utils/firebase.js');
const express = require('express');

const ctrl = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticate');
let route_user = express.Router();

// create
route_user.route('/create').post(ctrl.create)
route_user.route('/me/:id').get(ctrl.findById)
route_user.route('/me').post(authenticateToken, ctrl.findById)

// ----------------------------- Organization ---------------------------------------------------
route_user.get('/set_user_organization', function(request, response){
    let _uid = request.query.UID;
    let _departmentID = request.query.DEPARTMENT_ID;
    let _level = 0;
    let _isHead = request.query.IS_HEAD;
    let multiple = 0;
    let _multiplier = 1;

    database.ref("users/" + _uid).once("value").then((userData) => {

        //Check if user uid exists
        if (userData.exists() === false) {
            response.status(401).send("Your UID is not valid");
        }

        _level = _departmentID.split('_').length;

        if (_level > 10) {
            multiple = 10;
        }
        else {
            multiple = _level;
        }
        _multiplier = 2 - 0.1 * multiple;

        let updates = {
            organization: {
                departmentID: _departmentID,
                level: _level,
                isHead: _isHead,
            },
            multiplier: _multiplier,
        };

        database.ref("users/" + _uid).update(updates);
        response.status(200).send("Successfully sets user organization");

    }).catch((error) => {
        console.log(error);
    });

})

module.exports = route_user
