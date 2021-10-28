const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://team-building-game-6bd67-default-rtdb.firebaseio.com"
});
let database = admin.database();

module.exports = database;
