const db = require('../db/connection')
const express = require('express');

let route_game = express.Router();

route_game.get('/test', function(req, res){
    // db.select().table('game').orderBy("StartDate", "desc").then((rows) => {
    //     res.json({ code: 200, data: { items: rows, total: rows.length } })
    // })

    const body = {}
    body.id = 1
    body.name = "hello"
    body.status = 1

    db.insert(body).into('game').returning(['id', 'name', 'status']).then((rows) => {
        res.json({
            code: 200,
            GameID: rows[0].id,
            data: {
                title: 'Success',
                message: 'Created Successfully.',
                type: 'success',
                duration: '2000'
            }
        })
    })
})

route_game.get('/create', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _teamname = request.query.TEAMNAME;
    let leader_uid = "";
    let leader_skinID = "";
    let leader_petID = "";
    let leader_imageURL = "";

    let gameId = generateId();
    let isInTeam = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        //Check if user exists
        if (users.exists() == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
            if (user.key == "0") {
                leader_uid = user.val();
            }
        });

        //Check if uid is in the team memberIDs list
        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        database.ref("users/" + leader_uid).once("value").then((leaderData) => {

            // Check if leader uid exists
            if (leaderData.exists() == false) {
                response.send(401).send("Your leader uid does not exist");
                return null;
            }

            // Get leader's skinID
            leaderData.forEach((data) => {
                if (data.key === "skinID") {
                    leader_skinID = parseInt(data.val(), 10);
                }

                if (data.key === "petID") {
                    leader_petID = parseInt(data.val(), 10);
                }

                if (data.key === "Profile_Image_URL") {
                    leader_imageURL = data.val();
                }

            });

             // Create game in database && Update team gameId
            let updates = {
                [gameId]: {
                    gameInfo: {
                        anyWin: {
                            SamDoBeMovin: "Value",
                        },
                        teamInfo: {
                            [_teamcode]: {
                                isReady: false,
                                runner: leader_uid,
                                teamname: _teamname,
                                totalSteps: 0,
                                distance: 0,
                                velocity: 0,
                                runnerSkinID: leader_skinID,
                                runnerPetID: leader_petID,
                                runnerImageURL: leader_imageURL,
                            },
                        },
                        teamCount: 1,
                    },
                },
            };

            database.ref("games").update(updates);
            database.ref("teams/" + _teamcode).update({gameId: gameId});

            response.status(200).send("Successfully Create Game");

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });
})
route_game.get('/join', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _teamname = request.query.TEAMNAME;
    let _gameId = request.query.GAME_ID;
    let leader_uid = "";
    let leader_skinID = "";
    let leader_petID = "";
    let leader_imageURL = "";

    let isInTeam = false;
    let isInGame = false;
    let isGameIdExist = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        // Check if user exists
        if (users.exists == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
            if (user.key == 0) {
                leader_uid = user.val();
            }
        });

        // Check if uid is in the team memberIDs list
        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        database.ref("games").once("value").then((games) => {

            // Check if game exists
            if (games.exists() == false) {
                response.status(401).send("No games exists");
                return null;
            }

            games.forEach((game) => {
                if (game.key === _gameId) {
                    isGameIdExist = true;
                }
            });

            // Check if gameId exists
            if (isGameIdExist == false) {
                response.status(401).send("Your game id does not exist.");
                return null;
            }

            database.ref("games/" + _gameId + "/gameInfo").once("value").then((gameinfo) => {
                gameinfo.forEach((info) => {

                    // Check if game is started
                    if (info.key === "startGame") {
                        response.status(401).send("This game is already started, please try another game.").end();
                        return null;
                    }

                    // Check if game is full
                    if (info.key === "teamCount") {
                        if (parseInt(info.val(), 10) >= 5) {
                            response.status(401).send("This game is already full.").end();
                            return null;
                        }
                    }
                });

                let _teamCount = 0;
                database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {
                    teams.forEach((team) => {
                        _teamCount += 1;
                        if (team.key === _teamcode) {
                            isInGame = true;
                        }
                    })

                    // Check if successfully joined game
                    if (isInGame == true) {
                        response.status(200).send("Successfully Joined Game");
                        return null;
                    }

                    database.ref("users/" + leader_uid).once("value").then((leaderData) => {

                        // Check if leader uid exists
                        if (leaderData.exists() == false) {
                            response.send(401).send("Your leader uid does not exist");
                            return null;
                        }

                        // Get leader's skinID
                        leaderData.forEach((data) => {
                            if (data.key === "skinID") {
                                leader_skinID = parseInt(data.val(), 10);
                            }
                            if (data.key === "petID") {
                                leader_petID = parseInt(data.val(), 10);
                            }
                            if (data.key === "Profile_Image_URL") {
                                leader_imageURL = data.val();
                            }
                        });

                        // Join game in database
                        let updates = {
                            [_teamcode]: {
                                isReady: false,
                                runner: leader_uid,
                                teamname: _teamname,
                                totalSteps: 0,
                                distance: 0,
                                velocity: 0,
                                runnerSkinID: leader_skinID,
                                runnerPetID: leader_petID,
                                runnerImageURL: leader_imageURL,
                            },
                        };
                        database.ref("games/" + _gameId + "/gameInfo/teamInfo").update(updates);
                        database.ref("games/" + _gameId + "/gameInfo").update({teamCount: _teamCount + 1});
                        database.ref("teams/" + _teamcode).update({gameId: _gameId});

                        response.status(200).send("Successfully Joined Game");

                    }).catch((error) => {
                        console.log(error);
                    });

                }).catch((error) => {
                    console.log(error);
                });

            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        })

    }).catch((error) => {
        console.log(error);
    });
})
route_game.get('/leave', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _gameId = request.query.GAME_ID;
    let teamcount = -1;

    let isInTeam = false;
    let isInGame = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        // Check if users exists
        if (users.exists() == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
        });

        // Check if uid is in team memberIDs list
        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        let _teamCount = 0;
        database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {
            teams.forEach((team) => {
                _teamCount += 1;
                if (team.key === _teamcode) {
                    isInGame = true;
                }
            })

            // Check if team is in game
            if (isInGame == false) {
                response.status(200).send("Team is not in the Game");
                return null;
            }

            database.ref("games/" + _gameId + "/gameInfo").once("value").then((data) => {
                data.forEach((gameInfos) => {
                    if (gameInfos.key === "teamCount") {
                        teamcount = gameInfos.val();
                    }
                });

                if (teamcount == 1) {
                    // Remove the whole game and team gameId
                    database.ref("games/" + _gameId).remove();
                    database.ref("teams/" + _teamcode).update({gameId: "placeholder"});
                    response.status(200).send("Successfully Removed Game");
                    return null;
                }
                else {
                    // Remove the team in the game and team gameId
                    database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).remove();
                    database.ref("games/" + _gameId + "/gameInfo").update({teamCount: teamcount - 1});
                    database.ref("teams/" + _teamcode).update({gameId: "placeholder"});
                }

                response.status(200).send("Successfully Leaved Game");
            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });
})

route_game.get('/post_steps', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _gameId = request.query.GAME_ID;
    let _steps = request.query.STEPS;
    let _distance = request.query.DISTANCE;
    let _velocity = request.query.VELOCITY;


    let isInTeam = false;
    let isInGame = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        //Check if teamcode exist
        if (users.exists() == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        //Check if playerexist in team
        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
        });

        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        let _teamCount = 0;
        database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {

            //Check if team exist in game
            teams.forEach((team) => {
                _teamCount += 1;
                if (team.key === _teamcode) {
                    isInGame = true;
                }
            })

            if (isInGame == false) {
                response.status(200).send("Team is not in the Game");
                return null;
            }

            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).once("value").then((totalSteps) => {

                // Check if total field under team folder in game folder exist
                if (totalSteps.exists() == false) {
                    response.status(401).send("Total field under team folder in game folder does not exist");
                    return null;
                }

                let totalSteps_From_Firebase = 0;
                let distance_From_Firebase = 0;
                let velocity_From_Firebase = 0;

                totalSteps.forEach((data) => {
                    if(data.key === "totalSteps"){
                        totalSteps_From_Firebase = parseInt(data.val(), 10);
                    }

                    if(data.key === "distance"){
                        distance_From_Firebase = parseFloat(data.val());
                    }

                    if(data.key === "velocity"){
                        velocity_From_Firebase = parseFloat(data.val());
                    }
                })

                if(totalSteps_From_Firebase < parseInt(_steps, 10)){
                    database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                        totalSteps: parseInt(_steps, 10),
                    });
                }

                if (distance_From_Firebase < parseInt(_distance, 10)) {
                    database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                        distance: parseFloat(_distance),
                    });
                }

                database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                    velocity: parseFloat(_velocity),
                });

                response.status(200).send("Successfully Updated Data");
                return null;

            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });
})
route_game.get('/post_isReady', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _gameId = request.query.GAME_ID;
    let _isReady = request.query.IS_READY_STATUS;


    let isInTeam = false;
    let isInGame = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        //Check if playerexist in team
        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
        });

        // Check if uid is in team memberIDs list
        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        let _teamCount = 0;
        database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {

            //Check if team exist in game
            teams.forEach((team) => {
                _teamCount += 1;
                if (team.key === _teamcode) {
                    isInGame = true;
                }
            })

            if (isInGame == false) {
                response.status(200).send("Team is not in the Game");
                return null;
            }

            // Update isReady status
            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                isReady: _isReady,
            });

            response.status(200).send("Successfully update isReady status");
            return null;

        }).catch((error) => {
            console.log(error);
            response.status(401).send("Your teamcode is not valid");
        });

    }).catch((error) => {
        console.log(error);
        response.status(401).send("Your teamcode is not valid");
    });
})
route_game.get('/post_teamRecords', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _gameId = request.query.GAME_ID;
    let _username = request.query.USERNAME;
    let _personalBestTime = request.query.PERSONAL_BEST_TIME;


    let isInTeam = false;
    let isInGame = false;

    database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

        //Check if teamcode exists
        if (users.exists() == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        //Check if playerexist in team
        users.forEach((user) => {
            if (user.val() === _uid) {
                isInTeam = true;
            }
        });

        if (isInTeam == false) {
            response.status(401).send("Your uid is not in the team memberIDs list");
            return null;
        }

        let _teamCount = 0;
        database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {

            //Check if team exist in game
            teams.forEach((team) => {
                _teamCount += 1;
                if (team.key === _teamcode) {
                    isInGame = true;
                }
            })

            if (isInGame == false) {
                response.status(200).send("Team is not in the Game");
                return null;
            }

            // Update personalBestTime
            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode + "/teamRecords").update({
                [_username]: _personalBestTime,
            });

            response.status(200).send("Successfully update team record status");
            return null;

        }).catch((error) => {
            console.log(error);
            response.status(401).send("Your teamcode is not valid");
        });

    }).catch((error) => {
        console.log(error);
    });
})
route_game.get('/update_ingame_data', function(request, response){
    let _teamcode = request.query.TEAMCODE;
    let _uid = request.query.UID;
    let _gameId = "";
    let _totalsteps = 0;
    let _distance = 0;
    let _velocity = 0;
    let _gameStart = false;
    let _gameEnd = false;
    let _myTurn = false;
    let runner_uid = "";
    let runner_place = -1;
    let runnerName = "";
    let winner_teamID = "";
    let user_index = "";
    let _bonus = 1;

    let relay_totalsteps = 0;
    let relay_steps_threshold = 0;
    let relay_map = 0;

    let isInTeam = false;
    let isInGame = false;
    let isEndGame = false;

    database.ref("teams/" + _teamcode + "/gameId").once("value").then((id) => {

        //Check if teamcode exists
        if (id.exists() == false) {
            response.status(401).send("Your teamcode is not valid");
            return null;
        }

        _gameId = id.val();
        // is not in game
        if (_gameId == "placeholder") {
            _gameStart = false;
            let queueUpdate = {
                gameID: _gameId,
                totalSteps: _totalsteps,
                distance: _distance,
                velocity: _velocity,
                gameStart: _gameStart,
                gameEnd: _gameEnd,
                myTurn: _myTurn,
                runner: runnerName,
                winnerTeamID: winner_teamID,
                relay_totalsteps: relay_totalsteps,
                relay_steps_threshold: relay_steps_threshold,
                relay_map: relay_map,
                bonus: _bonus,
            };
            response.status(200).send(queueUpdate);
            return null;
        }

        database.ref("games/" + _gameId + "/gameInfo").once("value").then((gameinfo) => {

            // Check if gameId exists
            if (gameinfo.exists() == false) {
                response.status(401).send("Your game is not valid");
                return null;
            }

            gameinfo.forEach((info) => {
                if (info.key === "startGame") {
                    _gameStart = true;
                }
            });

            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode + "/runner").once("value").then((runnerId) => {
                runner_uid = runnerId.val();

                if (runner_uid === _uid) {
                    _myTurn = true;
                }

                database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((users) => {

                    //Check if player exist in team
                    users.forEach((user) => {
                        if (user.val() === _uid) {
                            user_index = user.key;
                            isInTeam = true;
                        }

                        if (user.val() === runner_uid) {
                            runner_place = parseInt(user.key, 10);
                        }
                    });

                    if (isInTeam == false) {
                        response.status(401).send("Your uid is not in the team memberIDs list");
                        return null;
                    }

                    database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {

                        // Check if team exist in game
                        teams.forEach((team) => {
                            if (team.key === _teamcode) {
                                isInGame = true;
                            }
                        });

                        if (isInGame == false) {
                            response.status(401).send("Team is not in the Game");
                            return null;
                        }

                        database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).once("value").then((teamData) => {

                            if (teamData.exists() == false) {
                                response.status(401).send("Your team value is missing");
                                return null;
                            }

                            teamData.forEach((data) => {
                                if (data.key === "totalSteps") {
                                    _totalsteps = parseFloat(data.val(), 10);
                                }
                                if (data.key === "distance") {
                                    _distance = data.val();
                                }
                                if (data.key === "velocity") {
                                    _velocity = data.val();
                                }
                            });

                            database.ref("games/" + _gameId + "/gameInfo/anyWin/SamDoBeMovin").once("value").then((moving) => {
                                if (moving.val() == true) {
                                    isEndGame = true;
                                }

                                database.ref("Config_Constants").once("value").then((config) => {
                                    config.forEach((constants) => {

                                        if (constants.key === "RELAY_STEPS_THRESHOLD") {
                                            relay_steps_threshold = parseInt(constants.val(), 10);
                                        }

                                        if (constants.key === "RELAY_TOTALSTEPS") {
                                            relay_totalsteps = parseInt(constants.val(), 10);
                                            if (_distance >= relay_totalsteps || isEndGame) {
                                                database.ref("games/" + _gameId + "/gameInfo/anyWin").update({
                                                    SamDoBeMovin: true,
                                                });
                                                _gameEnd = true;
                                            }
                                            if (_distance >= relay_totalsteps) {
                                                database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                                                    winner: true,
                                                });
                                            }
                                        }

                                        if (constants.key === "RELAY_MAP") {
                                            relay_map = parseInt(constants.val(), 10);
                                        }

                                    });

                                    database.ref("teams/" + _teamcode + "/nameList").once("value").then((names) => {
                                        names.forEach((name) => {
                                            if (name.key == runner_place.toString()) {
                                                runnerName = name.val();
                                            }
                                        });

                                        database.ref("users/" + _uid + "/multiplier").once("value").then((multiplier) => {

                                            _bonus *= parseFloat(multiplier.val());

                                            database.ref("teams/" + _teamcode + "/bonusList").once("value").then((bonuses) => {

                                                bonuses.forEach((bonus) => {
                                                    if (bonus.key == user_index.toString()) {
                                                        _bonus *= parseFloat(bonus.val());
                                                    }
                                                });

                                                database.ref("games/" + _gameId + "/gameInfo/anyWin/winner").once("value").then((winnerID) => {

                                                    if (winnerID.exists() == false) {
                                                        winner_teamID = "placeholder";
                                                    }
                                                    else {
                                                        winner_teamID = winnerID.val();
                                                    }

                                                    let normalUpdate = {
                                                        gameID: _gameId,
                                                        totalSteps: _totalsteps,
                                                        distance: _distance,
                                                        velocity: _velocity,
                                                        gameStart: _gameStart,
                                                        gameEnd: _gameEnd,
                                                        myTurn: _myTurn,
                                                        runner: runnerName,
                                                        winnerTeamID: winner_teamID,
                                                        relay_totalsteps: relay_totalsteps,
                                                        relay_steps_threshold: relay_steps_threshold,
                                                        relay_map: relay_map,
                                                        bonus: _bonus,
                                                    };
                                                    response.status(200).send(normalUpdate);

                                                    return null;

                                                }).catch((error) => {
                                                    console.log(error);
                                                });

                                            }).catch((error) => {
                                                console.log(error);
                                            });

                                        }).catch((error) => {
                                            console.log(error);
                                        });

                                    }).catch((error) => {
                                        console.log(error);
                                    });

                                }).catch((error) => {
                                    console.log(error);
                                });

                            }).catch((error) => {
                                console.log(error);
                            });

                        }).catch((error) => {
                            console.log(error);
                        });

                    }).catch((error) => {
                        console.log(error);
                    });

                }).catch((error) => {
                    console.log(error);
                });

            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });

})
route_game.get('/rejoin', function(request, response){

    let _uid = request.query.UID;
    let _teamCode = "notfound";
    let _gameID = "notfound";
    let _skinID = "";
    let _petID = "";
    let _imageURL = "";
    let user_index = -1;
    let isInQueue = false;

    //Check if the player exists
    database.ref("users/" + _uid).once("value").then((userData) => {

        //Check if user uid exists
        if (userData.exists() == false) {
            response.status(401).send("Your UID is not valid");
        }

        //Get the registered teamCode in player's data
        userData.forEach((data) => {
            if (data.key === "teamCode") {
                _teamCode = data.val();
            }

            if (data.key === "skinID") {
                _skinID = parseInt(data.val(), 10);
            }

            if (data.key === "petID") {
                _petID = parseInt(data.val(), 10);
            }

            if (data.key === "Profile_Image_URL") {
                _imageURL = data.val();
            }
        });

        // Change user isOnline status and team isOnline status
        database.ref("users/" + _uid).update({isOnline: true,});

        //Check if teamCode exists
        if(_teamCode !== "notfound" && _teamCode !== "placeholder"){
            //Check if team with given teamCode exits
            database.ref("teams/" + _teamCode).once("value").then((teamData) => {

                //Check if teamcode exists
                if(teamData.exists() == false) {
                    response.status(200).send("Lobby");
                }

                //Check if gameID fields contains a game
                teamData.forEach((data) => {
                    if (data.key === "gameId") {
                        _gameID = data.val();
                    }
                });

                database.ref("teams/" + _teamCode + "/memberIDs").once("value").then((members) => {

                    members.forEach((member) => {
                        if (_uid === member.val()) {
                            user_index = parseInt(member.key, 10);
                        }
                    });

                    database.ref("teams/" + _teamCode + "/isOnlineList").update({
                        [user_index]: true,
                    });

                    database.ref("games/" + _gameID + "/gameInfo/startGame").once("value").then((startgame) => {

                        //Check if game is already in game or in queue (exists mean to be in game)
                        if (startgame.exists() == false) {
                            isInQueue = true;
                        }

                        if(_gameID == "notfound" || _gameID == "placeholder" || isInQueue){
                            //No Game Found, return to the team lobby
                            response.status(200).send("Team Lobby");
                        }else{
                            // before return to the game, assign runner to the player if team is dead
                            database.ref("games/" + _gameID + "/gameInfo/teamInfo/" + _teamCode).once("value").then((teamInfos) => {

                                teamInfos.forEach((teamInfo) => {

                                    if (teamInfo.key === "teamIsDead") {

                                        let updates = {
                                            runner: _uid,
                                            runnerSkinID: _skinID,
                                            runnerPetID: _petID,
                                            runnerImageURL: _imageURL,
                                        };

                                        console.log("rejoin from team is dead");

                                        database.ref("games/" + _gameID + "/gameInfo/teamInfo/" + _teamCode).update(updates);
                                        database.ref("games/" + _gameID + "/gameInfo/teamInfo/" + _teamCode + "/teamIsDead").remove();

                                    }
                                });

                                //GameID Found, return to the game
                                response.status(200).send("Relay Game");

                            }).catch((error) => {
                                console.log(error);
                            });
                        }

                    }).catch((error) => {
                        console.log(error);
                    });

                }).catch((error) => {
                    console.log(error);
                });

            }).catch((error) => {
                console.log(error);
            });

        }else{
            //No teamCode is found. Return the player back to lobby
            response.status(200).send("Lobby");
        }

    }).catch((error) => {
        console.log(error);
    });
})
route_game.get('/update_queue', function(request, response){

    let _gameId = request.query.GAME_ID;
    let _teamNameList = [];
    let _teamReadyStatus = [];

    database.ref("games/" + _gameId + "/gameInfo/teamInfo").once("value").then((teams) => {

        if (teams.exists() == false) {
            response.status(401).send("GameID does not exist");
            return null;
        }

        teams.forEach((team) => {
            _teamNameList.push(team.val().teamname);
            _teamReadyStatus.push(team.val().isReady);
        });

        for (let i = _teamNameList.length; i < 5; i += 1) {
            _teamNameList.push("placeholder");
            _teamReadyStatus.push(false);
        }

        let sendBack = {
            teamNameList: _teamNameList,
            teamReadyStatus: _teamReadyStatus,
        };

        response.status(200).send(sendBack);

    }).catch((error) => {
        console.log(error);
    });

})

// ----------------------------- Multiplyer -----------------------------------------------------
route_game.get('/velocity_multiplier', function(request, response){

    let _teamcode = request.query.TEAMCODE;
    let _gameId = request.query.GAME_ID;
    let _multiplier = request.query.MULTIPLIER;
    let _velocity = 0;

    database.ref("games/" + _gameId).once("value").then((game) => {

        // Check if game ID exists
        if (game.exists() == false) {
            response.status(401).send("Game ID does not exist");
            return null;
        }

        database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).once("value").then((teamData) => {

            // Check if team code exists
            if (teamData.exists() == false) {
                response.status(401).send("Team ID does not exist");
                return null;
            }

            // Get velocity from firebase database
            teamData.forEach((data) => {
                if (data.key == "velocity") {
                    _velocity = parseFloat(data.val());
                }
            });

            // Multiply velocity
            _velocity = _velocity * parseFloat(_multiplier);

            // Set multiplied velocity to database
            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update({
                velocity: parseFloat(_velocity),
            });

            response.status(200).send("Successfully multiplied velocity");

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });

})

// ----------------------------- AFK Handler ----------------------------------------------------
route_game.get('/afk_handler', function(request, response){
    let _uid = request.query.UID;
    let _teamcode = request.query.TEAMCODE;
    let _gameId = request.query.GAME_ID;
    let _isOnline = request.query.IS_ONLINE;
    let _isRunner = request.query.IS_RUNNER;

    let targetIndex = -1;
    let runner_uid = "";
    let nextRunner_skinID = "";
    let nextRunner_petID = "";
    let nextRunner_imageURL = "";
    let runnerId = -1;

    let _skinID = "";
    let _petID = "";
    let _imageURL = "";

    let teamIsDead = true;
    let isOnlineList = [];

    database.ref("users/" + _uid).once("value").then((userData) => {

        //Check if user uid exists
        if (userData.exists() == false) {
            response.status(401).send("Your UID is not valid");
        }

        //Get the registered teamCode in player's data
        userData.forEach((data) => {
            if (data.key === "skinID") {
                _skinID = parseInt(data.val(), 10);
            }

            if (data.key === "petID") {
                _petID = parseInt(data.val(), 10);
            }

            if (data.key === "Profile_Image_URL") {
                _imageURL = data.val();
            }
        });

        // Change user isOnline status
        database.ref("users/" + _uid).update({isOnline: _isOnline,});

        database.ref("teams/" + _teamcode).once("value").then((teamData) => {

            // Check if team exists
            if (teamData.exists() == false) {
                response.status(401).send("Your team does not exist");
            }

            database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((memberIDs) => {

                memberIDs.forEach((memberID) => {
                    if (memberID.val() === _uid) {
                        targetIndex = parseInt(memberID.key, 10);
                    }
                });

                if (targetIndex == -1) {
                    response.status(401).send("Player not in team");
                }

                database.ref("teams/" + _teamcode + "/isOnlineList").update({
                    [targetIndex]: _isOnline,
                });

                if ((_isOnline == false || _isOnline == "False") && (_isRunner == true || _isRunner == "True")) {

                    database.ref("games/" + _gameId).once("value").then((gameExist) => {

                        // Check if game exists
                        if (gameExist.exists() == false) {
                            response.status(401).send("Game does not exist");
                        }

                        database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).once("value").then((data) => {

                            // Check if teamcode exists
                            if (data.exists() == false) {
                                response.status(401).send("Teamcode does not exist in game");
                                return null;
                            }

                            database.ref("games/" + _gameId + "/gameInfo/teamInfo/" +
                            _teamcode + "/runner").once("value").then((runnerValue) => {
                            runner_uid = runnerValue.val();

                            database.ref("teams/" + _teamcode + "/memberCount").once("value")
                                .then((snapshot) => {

                                let memberCount = parseInt(snapshot.val(), 10);

                                database.ref("teams/" + _teamcode + "/memberIDs").once("value")
                                    .then((memberIds) => {
                                        memberIds.forEach((members) => {
                                            if (members.val() === runner_uid) {
                                                runnerId = parseInt(members.key, 10);
                                            }
                                        });

                                        // get the correct runnerId that is online
                                        database.ref("teams/" + _teamcode + "/isOnlineList").once("value")
                                            .then((isOnlines) => {

                                            isOnlines.forEach((isOnline) => {
                                                isOnlineList.push(isOnline.val());
                                            });

                                            console.log(isOnlineList);

                                            for (let i = 0; i < memberCount; i++) {

                                                runnerId = (runnerId + 1) % memberCount;
                                                if (isOnlineList[runnerId] == true || isOnlineList[runnerId] == "True") {
                                                    teamIsDead = false;
                                                    break;
                                                }

                                            }

                                            // set state in game / teamInfo that team is dead
                                            if (teamIsDead == true) {
                                                database.ref("games/" + _gameId + "/gameInfo/teamInfo/" +_teamcode).update({ teamIsDead: true });
                                                console.log("no runners online -> team is dead");
                                                response.status(200).send("There are no runners online in the team");
                                                return null;
                                            }

                                            database.ref("teams/" + _teamcode + "/memberIDs").once("value")
                                                .then((member) => {

                                                let nextRunner_uid = "";
                                                member.forEach((user) => {
                                                    if (user.key == runnerId.toString()) {
                                                        nextRunner_uid = user.val();
                                                    }
                                                });

                                                database.ref("users/" + nextRunner_uid).once("value")
                                                    .then((nextRunnerData) => {

                                                        // Check if next runner uid exists
                                                        if (nextRunnerData.exists() == false) {
                                                            console.log("nextRunner_uid not exists");
                                                            response.status(401).send("Next runner does not exist");
                                                            return null;
                                                        }

                                                        // Get next runner skinID
                                                        nextRunnerData.forEach((data) => {
                                                            if (data.key === "skinID") {
                                                                nextRunner_skinID = parseInt(data.val(), 10);
                                                            }
                                                            if (data.key === "petID") {
                                                                nextRunner_petID = parseInt(data.val(), 10);
                                                            }
                                                            if (data.key === "Profile_Image_URL") {
                                                                nextRunner_imageURL = data.val();
                                                            }
                                                        });

                                                        let updates = {
                                                            runner: nextRunner_uid,
                                                            runnerSkinID: nextRunner_skinID,
                                                            runnerPetID: nextRunner_petID,
                                                            runnerImageURL: nextRunner_imageURL,
                                                        };

                                                        database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update(updates);
                                                        response.status(200).send("Successfully changed runner and update team isOnline status");

                                                    }).catch((error) => {
                                                        console.log(error);
                                                    });

                                            }).catch((error) => {
                                                console.log(error);
                                            });

                                        }).catch((error) => {
                                            console.log(error);
                                        });

                                    }).catch((error) => {
                                        console.log(error);
                                    });

                                }).catch((error) => {
                                    console.error(error);
                                });

                            }).catch((error) => {
                                console.error(error);
                            });

                        }).catch((error) => {
                            console.log(error);
                        });

                    }).catch((error) => {
                        console.log(error);
                    });
                }

                else if (_isOnline == true || _isOnline == "True") {
                    // before return to the game, assign runner to the player if team is dead
                    database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).once("value").then((teamInfos) => {
                        teamInfos.forEach((teamInfo) => {

                            if (teamInfo.key === "teamIsDead") {

                                let updates = {
                                    runner: _uid,
                                    runnerSkinID: _skinID,
                                    runnerPetID: _petID,
                                    runnerImageURL: _imageURL,
                                };

                                console.log("rejoin from team is dead");

                                database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode).update(updates);
                                database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamcode + "/teamIsDead").remove();

                            }
                        });

                        response.status(200).send("Successfully check if team is dead then transition to the user");

                    }).catch((error) => {
                        console.log(error);
                    });
                }

                else {
                    response.status(200).send("Successfully changed team isOnline status to true");
                }

            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        });

    }).catch((error) => {
        console.log(error);
    });
})

function generateId() {
    possibleChars = "0123456789";
    let teamId = "";
    for (let j = 0; j < 6; j++) teamId += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    return teamId;
}

// // When to use?
// database.ref("normal_queue/{playerId}")
//     .onCreate((snap, context) => {
//     let gameId = generateNormalGameId();
//
//     database.ref("normal_queue").once("value").then((players) => {
//         let playerArr = [];
//         players.forEach((player) => {
//             if (player.val() === "placeholder" && player.key !== context.params.playerId) {
//                 playerArr.push(player);
//             }
//         });
//
//         let updates = {
//             playerCount: playerArr.length + 1,
//         };
//         database.ref("normal_queue").update(updates);
//
//         if (playerArr.length < 2) return null;
//
//         database.ref("normal_queue").transaction(function (queueArr) {
//
//             // If any of the players gets into another game during the transaction, abort the operation
//             if (queueArr === null || queueArr[context.params.playerId] !== "placeholder") return queueArr;
//             playerArr.forEach((player) => {
//                 if (queueArr[player.key] !== "placeholder") {
//                     return queueArr;
//                 }
//             });
//
//             queueArr[context.params.playerId] = gameId;
//             playerArr.forEach((player) => {
//                 queueArr[player.key] = gameId;
//             });
//             return queueArr;
//
//         }).then((result) => {
//
//             if (result.snapshot.child(context.params.playerId).val() !== gameId) return;
//
//             let arr = [context.params.playerId];
//             playerArr.forEach((player) => {
//                 arr.push(player.key);
//             });
//
//             let game = {
//                 gameInfo: {
//                     playerInfo: {
//                         [arr[0]]: 0,
//                         [arr[1]]: 0,
//                         [arr[2]]: 0,
//                     },
//                 },
//             };
//
//             database.ref("games/" + gameId).set(game).then((snapshot) => {
//                 console.log("Normal Walk Game created successfully!");
//                 return null;
//             }).catch((error) => {
//                 console.log(error);
//             });
//
//             return null;
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//         return null;
//     }).catch((error) => {
//         console.log(error);
//     });
// });
// function generateNormalGameId() {
//     possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let gameId = "";
//     for (let j = 0; j < 8; j++) gameId += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
//     return gameId;
// }
//
// // When to use?
// database.ref("relay_matchmaking/{playerId}")
//     .onCreate((snap, context) => {
//     let gameId = generateGameId();
//
//     database.ref("relay_matchmaking").once("value").then((players) => {
//         var playersArr = [];
//         players.forEach((player) => {
//             if (player.val() === "placeholder" && player.key !== context.params.playerId) {
//                 playersArr.push(player);
//             }
//         });
//
//         if (playersArr.length < 6) return null;
//
//         database.ref("relay_matchmaking").transaction(function (matchmaking) {
//
//             // If any of the players gets into another game during the transaction, abort the operation
//             if (matchmaking === null || matchmaking[context.params.playerId] !== "placeholder") return matchmaking;
//             playersArr.forEach((player) => {
//                 if (matchmaking[player.key] !== "placeholder") {
//                 return matchmaking;
//                 }
//             });
//
//             matchmaking[context.params.playerId] = gameId;
//             playersArr.forEach((player) => {
//                 matchmaking[player.key] = gameId;
//             });
//             return matchmaking;
//
//         }).then((result) => {
//
//             if (result.snapshot.child(context.params.playerId).val() !== gameId) return;
//
//             let arr = [context.params.playerId];
//             playersArr.forEach((player) => {
//                 arr.push(player.key);
//             });
//
//             let game = {
//                 gameInfo: {
//                     anyWin: {
//                         maybe: "maybe",
//                     },
//                     teamsIds: arr,
//                 },
//             };
//
//             database.ref("games/" + gameId).set(game).then((snapshot) => {
//                 console.log("Game created successfully!");
//                 return null;
//             }).catch((error) => {
//                 console.log(error);
//             });
//
//             return null;
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//         return null;
//     }).catch((error) => {
//         console.log(error);
//     });
// });
//
// function generateGameId() {
//     possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let gameId = "";
//     for (let j = 0; j < 20; j++) gameId += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
//     return gameId;
// }
//
// // Why the data is inconsistent with firebase db?
// database.ref("games/{gameId}/gameInfo/teamInfo/{teamId}/winner")
//     .onCreate((snap, context) => {
//
//         const isWinner = snap.val();
//
//         let win = {
//             winner: context.params.teamId,
//         };
//
//
//         if (isWinner) {
//             return snap.ref.parent.parent.parent.child("anyWin").set(win);
//         }
//
//         return null;
//     });
//
// // Team match 階段：更新隊伍就緒狀態
// database.ref("games/{gameId}/gameInfo/teamInfo/{teamId}/isReady")
//     .onWrite((change, context) => {
//         let isNotAllReady = false;
//         let count = 0;
//       // Grab the current value of what was written to the Realtime Database.
//       database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo").once("value")
//         .then((teams) => {
//             teams.forEach((team) => {
//                 count++;
//                 if (team.val().isReady == false) {
//                     isNotAllReady = true;
//                 }
//             });
//
//             if (count == 0) {
//                 isNotAllReady = true;
//             }
//
//             if (isNotAllReady === false) {
//                 let updates = {
//                     startGame: true,
//                 };
//                 return change.after.ref.parent.parent.parent.update(updates);
//             }
//
//             return null;
//         });
//     });
//
// database.ref("games/{gameId}/gameInfo/teamInfo/{teamId}/distance")
//     .onWrite((change, context) => {
//         // Exit when the data is deleted.
//         if (!change.after.exists()) {
//             return null;
//         }
//
//         let relay_steps_threshold = 0;
//         let relay_totalsteps = 0;
//         let distance = parseInt(change.after.val(), 10);
//         let invokeonceRound = 0;
//         let transitionInvokeOnce = 0;
//         let runner_uid = "";
//         let nextRunner_skinID = "";
//         let nextRunner_petID = "";
//         let nextRunner_imageURL = "";
//         let runnerId = -1;
//
//         let isOnlineList = [];
//         let teamIsDead = true;
//
//         database.ref("Config_Constants/").once("value").then((config) => {
//             config.forEach((constants) => {
//                 if (constants.key === "RELAY_STEPS_THRESHOLD") {
//                     relay_steps_threshold = parseInt(constants.val(), 10);
//                 }
//                 if (constants.key === "RELAY_TOTALSTEPS") {
//                     relay_totalsteps = parseInt(constants.val(), 10);
//                 }
//             });
//
//             database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo/" + context.params.teamId + "/transition").once("value").then((transition) => {
//                 transitionInvokeOnce = parseInt(transition.val(), 10);
//
//                 invokeonceRound = (distance / relay_steps_threshold).toFixed(0);
//                 if (distance % relay_steps_threshold == 0 && distance != 0 && transitionInvokeOnce != invokeonceRound) {
//                     transitionInvokeOnce = invokeonceRound;
//                     database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo/" + context.params.teamId).update({
//                         transition: invokeonceRound,
//                     });
//
//                     database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo/" +
//                     context.params.teamId + "/runner").once("value").then((runnerValue) => {
//                     runner_uid = runnerValue.val();
//
//                     database.ref("teams/" + context.params.teamId + "/memberCount").once("value")
//                         .then((snapshot) => {
//
//                         let memberCount = parseInt(snapshot.val(), 10);
//
//                         database.ref("teams/" + context.params.teamId + "/memberIDs").once("value")
//                             .then((memberIds) => {
//                                 memberIds.forEach((members) => {
//                                     if (members.val() === runner_uid) {
//                                         runnerId = parseInt(members.key, 10);
//                                     }
//                                 });
//
//                                 // get the correct runnerId that is online
//                                 database.ref("teams/" + context.params.teamId + "/isOnlineList").once("value")
//                                     .then((isOnlines) => {
//
//                                     isOnlines.forEach((isOnline) => {
//                                         isOnlineList.push(isOnline.val());
//                                     });
//
//                                     console.log(isOnlineList);
//
//                                     for (let i = 0; i < memberCount; i++) {
//
//                                         runnerId = (runnerId + 1) % memberCount;
//                                         if (isOnlineList[runnerId] == true || isOnlineList[runnerId] == "True") {
//                                             teamIsDead = false;
//                                             break;
//                                         }
//
//                                     }
//
//                                     // set state in game / teamInfo that team is dead
//                                     if (teamIsDead == true) {
//                                         console.log("no runners online -> team is dead");
//                                         database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo/" +
//                                             context.params.teamId).update({ teamIsDead: true });
//                                         return null;
//                                     }
//
//                                     database.ref("teams/" + context.params.teamId + "/memberIDs").once("value")
//                                         .then((member) => {
//
//                                             let nextRunner_uid = "";
//                                             member.forEach((user) => {
//                                                 if (user.key == runnerId.toString()) {
//                                                     nextRunner_uid = user.val();
//                                                 }
//                                             });
//
//                                             database.ref("users/" + nextRunner_uid).once("value")
//                                                 .then((nextRunnerData) => {
//
//                                                     // Check if next runner uid exists
//                                                     if (nextRunnerData.exists() == false) {
//                                                         console.log("nextRunner_uid not exists");
//                                                         return null;
//                                                     }
//
//                                                     // Get next runner skinID
//                                                     nextRunnerData.forEach((data) => {
//                                                         if (data.key === "skinID") {
//                                                             nextRunner_skinID = parseInt(data.val(), 10);
//                                                         }
//                                                         if (data.key === "petID") {
//                                                             nextRunner_petID = parseInt(data.val(), 10);
//                                                         }
//                                                         if (data.key === "Profile_Image_URL") {
//                                                             nextRunner_imageURL = data.val();
//                                                         }
//                                                     });
//
//                                                     let updates = {
//                                                         runner: nextRunner_uid,
//                                                         runnerSkinID: nextRunner_skinID,
//                                                         runnerPetID: nextRunner_petID,
//                                                         runnerImageURL: nextRunner_imageURL,
//                                                     };
//                                                     return change.after.ref.parent.update(updates);
//
//                                                 }).catch((error) => {
//                                                     console.log(error);
//                                                 });
//
//                                         }).catch((error) => {
//                                             console.log(error);
//                                         });
//
//                                     }).catch((error) => {
//                                         console.log(error);
//                                     });
//
//                             }).catch((error) => {
//                                 console.log(error);
//                             });
//
//                         }).catch((error) => {
//                             console.error(error);
//                         });
//
//                     }).catch((error) => {
//                         console.error(error);
//                     });
//                 }
//
//             }).catch((error) => {
//                 database.ref("games/" + context.params.gameId + "/gameInfo/teamInfo/" + context.params.teamId).update({
//                     transition: 0,
//                 });
//                 console.log(error);
//             })
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//         return null;
//     });
//
// database.ref("teams/{teamId}")
//     .onWrite((change, context) => {
//         // Exit when the data is deleted.
//         if (!change.after.exists()) {
//             return null;
//         }
//
//         // teamNameList is not a teamId
//         if (context.params.teamId === "teamNameList") {
//             return null;
//         }
//
//         let token = 0;
//
//         database.ref("team_version_control/" + context.params.teamId).once("value").then((version) => {
//             token = parseInt(version.val(), 10) + 1;
//             let updates = {
//                 [context.params.teamId]: token,
//             };
//             database.ref("team_version_control").update(updates);
//         }).catch((error) => {
//             let updates = {
//                 [context.params.teamId]: 0,
//             };
//             database.ref("team_version_control").update(updates);
//             console.log(error);
//         });
//
//         return null;
//
//     });
//
// database.ref("games/{gameId}")
//     .onWrite((change, context) => {
//         // Exit when the data is deleted.
//         if (!change.after.exists()) {
//             return null;
//         }
//
//         let token = 0;
//
//         database.ref("game_version_control/" + context.params.gameId).once("value").then((version) => {
//             token = parseInt(version.val(), 10) + 1;
//             let updates = {
//                 [context.params.gameId]: token,
//             };
//             database.ref("game_version_control").update(updates);
//         }).catch((error) => {
//             let updates = {
//                 [context.params.gameId]: 0,
//             };
//             database.ref("game_version_control").update(updates);
//             console.log(error);
//         });
//
//         return null;
//
//     });

module.exports = route_game
