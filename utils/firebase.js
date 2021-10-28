const admin = require("firebase-admin");

const config = {
    project_id: process.env.project_id,
    client_email: process.env.client_email,
    private_key: process.env.private_key.replace(/\\n/g, '\n')
};

admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: "https://team-building-game-6bd67-default-rtdb.firebaseio.com"
});
let database = admin.database();

module.exports = database;
