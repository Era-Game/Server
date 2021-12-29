const WebSocket = require('ws');

const teamService = require('../services/teamService');
const {joinTeamError, leaveTeamError} = require("../utils/sqlErrHelper");

const { createClient } = require('redis');
const redis_client = createClient();
(async () => {
    await redis_client.on('error', (err) => console.log('Redis Client Error', err));
    await redis_client.connect();
})();

const WEBSOCKET_PORT = 8080;
const letterNumber = /^[0-9a-zA-Z]+$/;

const websocket_server = new WebSocket.Server({ port: WEBSOCKET_PORT });

// eslint-disable-next-line no-undef
illegal_event = () => { console.log("illegal event!") };

const MESSAGE_EVENT_HANDLERS = {
    // handle leave events
    l: async (socket, user_id) => {
        console.log("[ws:l] Start of Leave event")

        // cache
        try{
            await redis_client.sendCommand(["RG.TRIGGER", "leave_team", user_id, socket.tid])
        } catch (e) {
            console.log(e)
        }

        // write back
        try {
            await teamService.leave(socket.tid, user_id)
        } catch (err) {
            console.error(leaveTeamError(err))
        }
        console.log("[ws:l] End of Leave event")
    },
    // handle user join events
    j: async (socket, uid, secret = "") => {
        console.log("[ws:j] Start of Join Event")

        // set user id in client socket
        socket.uid = uid;
        const team = await redis_client.HGETALL(socket.tid)

        // already in this team
        if (team != null && team['USER:' + uid] !== undefined) {
            console.log("already in this team!")
            await subscribe_player_actions(socket);
            socket.uid = uid;
            socket.send("uid;" + true);
        } else { // new to team
            console.log("new to this team!")
            try{
                const data = await redis_client.sendCommand(["RG.TRIGGER", "join_team", uid, socket.tid, secret])

                if (data !== undefined && data != null) {
                    await subscribe_player_actions(socket);
                    socket.uid = uid;
                    socket.send("join;" + true);
                } else {
                    socket.send("join;" + false);
                    socket.close();
                }
            } catch (e) {
                console.log(e)
            }
        }

        // write back DB
        try {
            await teamService.join(socket.tid, socket.uid)
        } catch (err) {
            console.error(joinTeamError(err))
        }
        console.log("[ws:j] End of Join event")
    }
};

websocket_server.on('connection', (ws, req) => {
    load_team_id(req.url, ws);

    // Process incoming player websocket messages:
    ws.on('message', message => {
        let [action, payload] = message.toString().split(";");
        try {
            func = (MESSAGE_EVENT_HANDLERS[action] || illegal_event)(ws, ...payload.split(','));
        }
        catch (err) {
            ws.close();
        }
    });
});



function load_team_id(url, ws) {
    // used to load game_id fro the url component
    let tid = url.split("/").slice(-1)[0];
    if (!letterNumber.test(tid) || tid.length != 6) {
        ws.close();
    }
    ws.tid = tid;
}

async function subscribe_player_actions(socket) {
    const channel_id = socket.tid

    // Receive incoming messages from Redis:
    socket.redis_sub_client = redis_client.duplicate();
    await socket.redis_sub_client.connect();

    await socket.redis_sub_client.subscribe(channel_id, (message) => {
        console.log("channel on message"); // 'message'
        socket.send(message);
    });

    // Handle on close event
    socket.on('close', () => {
        MESSAGE_EVENT_HANDLERS.l(socket, socket.uid);
        socket.redis_sub_client.unsubscribe();
    });
}
