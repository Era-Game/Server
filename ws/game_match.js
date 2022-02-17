const WebSocket = require('ws');

const gameService = require('../services/gameService');
const {joinGameError, leaveGameError} = require("../utils/sqlErrHelper");  

const { createClient } = require('redis');
const redis_client = createClient();
(async () => {
    await redis_client.on('error', (err) => console.log('Redis Client Error', err));
    await redis_client.connect();
})();

const WEBSOCKET_PORT = 8081;
const letterNumber = /^[0-9a-zA-Z]+$/;

const websocket_server = new WebSocket.Server({ port: WEBSOCKET_PORT });

// eslint-disable-next-line no-undef
illegal_event = () => { console.log("illegal event!") };

const MESSAGE_EVENT_HANDLERS = {
    // handle leave events
    lg: async (socket, team_id) => {
        console.log("[ws:l] Start of Leave Game event")

        // cache
        try{
            await redis_client.sendCommand(["RG.TRIGGER", "leave_game", team_id, socket.gid])
        } catch (e) {
            console.log(e)
        }

        // write back
        try {
            await gameService.leave(socket.gid,team_id)  //確認leavegame
        } catch (err) {
            console.error(leaveGameError(err))
        }
        console.log("[ws:l] End of Leave Game event")
    },
    // handle user join events  
    jg: async (socket, tid, secret = "") => {
        console.log("[ws:j] Start of Join Event")

        // set team id in client socket
        socket.tid = tid;
        const game = await redis_client.HGETALL(socket.gid)
        // already in this team
        if (game != null && game['TEAM:' + tid] !== undefined) {
            console.log("already in this game!")
            await subscribe_player_actions(socket);
            socket.tid = tid;
            socket.send("tid;" + true);
        } else { // new to team
            console.log("new to this Game!")
            try{
                const data = await redis_client.sendCommand(["RG.TRIGGER", "join_game", tid, socket.gid, secret])

                if (data !== undefined && data != null) {
                    await subscribe_player_actions(socket);
                    socket.tid = tid;
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
            await gameService.join(socket.gid, socket.tid)  //確認參數
        } catch (err) {
            console.error(joinGameError(err))
        }
        console.log("[ws:j] End of Join Game event")
    }
};

websocket_server.on('connection', (ws, req) => {
    load_game_id(req.url, ws);

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



function load_game_id(url, ws) {
    // used to load game_id fro the url component
    let gid = url.split("/").slice(-1)[0];
    if (!letterNumber.test(gid) || gid.length != 8) {
        ws.close();
    }
    ws.gid = gid;
}

async function subscribe_player_actions(socket) {
    
    const channel_id = socket.gid
    // Receive incoming messages from Redis:
    socket.redis_sub_client = redis_client.duplicate();
    await socket.redis_sub_client.connect();

    await socket.redis_sub_client.subscribe(channel_id, (message) => {
        console.log("channel on message"); // 'message'
        socket.send(message);
        
    });

    // Handle on close event
    socket.on('close', () => {
        MESSAGE_EVENT_HANDLERS.lg(socket, socket.uid);
        socket.redis_sub_client.unsubscribe();
    });
}
