const database = require('../utils/firebase.js');

const express = require('express');
let route_team = express.Router();

// route_team.get('/create', function(request, response){
//     let uid = request.query.UID;
//     let teamname = request.query.TEAMNAME;
//     let _gameType = request.query.GAME_TYPE;
//     let teamId = generateId();
//
//     let departmentID = "";
//     let isHead = "";
//
//     database.ref("users/" + uid).once("value").then((user) => {
//
//         // Check if user uid exists
//         if (user.exists() == false) {
//             response.status(401).send("Your uid(" + uid + ") is not found, please try again!");
//             return null;
//         }
//
//         // udpate teamcode in the user's uid
//         let teamCodeUpdate = {
//             teamCode: teamId,
//         };
//         database.ref("users/" + uid).update(teamCodeUpdate);
//
//         // find the username and skinID of the user
//         let username = "";
//         let skinID = "";
//         let petID = "";
//         let isOnline = "";
//         let image_url = "";
//         user.forEach((userData) => {
//
//             if (userData.key === "username") {
//                 username = userData.val();
//             }
//
//             if (userData.key === "skinID") {
//                 skinID = userData.val();
//             }
//
//             if (userData.key === "petID") {
//                 petID = userData.val();
//             }
//
//             if (userData.key === "isOnline") {
//                 isOnline = userData.val();
//             }
//
//             if (userData.key === "Profile_Image_URL") {
//                 image_url = userData.val();
//             }
//
//         });
//
//         database.ref("users/" + uid + "/organization").once("value").then((organization) => {
//
//             organization.forEach((organizationData) => {
//
//                 if (organizationData.key === "departmentID") {
//                     departmentID = organizationData.val();
//                 }
//
//                 if (organizationData.key === "isHead") {
//                     isHead = organizationData.val();
//                 }
//
//             });
//
//             // set update create team data
//             let updates = {
//                 [teamId]: {
//                     teamLeader: uid,
//                     gameId: "placeholder",
//                     gameType: _gameType,
//                     memberCount: 1,
//                     memberIDs: {
//                         0: uid,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     nameList: {
//                         0: username,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     skinIDList: {
//                         0: skinID,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     petIDList: {
//                         0: petID,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     departmentIDList: {
//                         0: departmentID,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     isHeadList: {
//                         0: isHead,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     bonusList: {
//                         0: 1,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     isOnlineList: {
//                         0: isOnline,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     profileImageUrlList: {
//                         0: image_url,
//                         1: "placeholder",
//                         2: "placeholder",
//                         3: "placeholder",
//                         4: "placeholder",
//                         5: "placeholder",
//                         6: "placeholder",
//                         7: "placeholder",
//                         8: "placeholder",
//                         9: "placeholder",
//                     },
//                     teamname: teamname,
//                 },
//             };
//
//             // set sendback values to client side
//             let sendBack = {
//                 teamCode: teamId,
//                 gameId: "placeholder",
//                 gameType: _gameType,
//                 memberCount: 1,
//                 memberIDs: [uid, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 nameList: [username, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 skinIDList: [skinID, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 petIDList: [petID, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 departmentIDs: [departmentID, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 isHeadList: [isHead, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 bonusList: [1, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 isOnlineList: [isOnline, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 profileImageUrlList: [image_url, "placeholder", "placeholder", "placeholder", "placeholder",
//                     "placeholder", "placeholder", "placeholder", "placeholder", "placeholder"],
//                 teamname: teamname,
//                 isLeader: true,
//             };
//
//             database.ref("teams/teamNameList").once("value").then((teamNames) => {
//
//                 // Check if teamname is being used before
//                 teamNames.forEach((teamName) => {
//                     if (teamName.val() === true && teamName.key === teamname) {
//                         response.status(401).send("Your team name is being used, please try again!");
//                         return null;
//                     }
//                 });
//
//                 // Create team data and add team name list in database
//                 database.ref("teams").update(updates);
//                 database.ref("teams/teamNameList").update({
//                     [teamname]: true,
//                 });
//                 response.status(200).send(sendBack);
//                 return null;
//
//             }).catch((error) => {
//                 console.log(error);
//
//                 // database.ref("teams").update(updates);
//                 // database.ref("teams/teamNameList").update({
//                 //     [teamname]: true,
//                 // });
//                 // response.status(200).send(sendBack);
//             });
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//     }).catch((error) => {
//         console.log(error);
//     });
// })
//
// route_team.get('/join', function(request, response) {
//     let _teamCode = request.query.TEAMCODE;
//     let _uid = request.query.UID;
//     let _myGameType = request.query.GAME_TYPE;
//     let _gameID = "notfound";
//     let _memberCount = "notfound";
//     let _gameType = "notfound";
//     let _username = "";
//     let _skinID = "";
//     let _petID = "";
//     let _isOnline = "";
//     let _profileImageUrl = "";
//     let isInMemberList = false;
//
//     // Organization bonus
//     let _departmentID = "";
//     let _isHead = "";
//     let departmentIDs = [];
//     let isHeads = [];
//     let bonuses = [];
//
//     let sameID = 1.05; // same departmentID, Ex: 1.2.1 (Not Head) : 1.2.1 (Not Head)
//     let sameIDwithHead = 1.1; // same departmentID and one is head, Ex: 1.2.1 (Head) : 1.2.1 (Not Head)
//     let sameIDwithNotHead = 1.05; // same departmentID and other is head, Ex: 1.2.1 (Not Head) : 1.2.1 (Head)
//     let directlyUnder = 1.1; // directly under boss increase by 0.1 every stage, Ex: 1.2 (Head) : 1.2.1 (Not Head)
//     let directlyAbove = 1.05; //directly above boss increase by 0.1 every stage, Ex: 1.2.1 (Not Head) : 1.2 (Head)
//
//     database.ref("users/" + _uid).once("value").then((user) => {
//
//         //Check if the uid exists
//         if (user.exists() == false){
//             response.status(401).send("Your uid is not found, please try again!");
//             return null;
//         }
//
//         //Get the username and skinID
//         user.forEach((userData) => {
//
//             if (userData.key === "username") {
//                 _username = userData.val();
//             }
//
//             if (userData.key === "skinID") {
//                 _skinID = userData.val();
//             }
//
//             if (userData.key === "petID") {
//                 _petID = userData.val();
//             }
//
//             if (userData.key === "isOnline") {
//                 _isOnline = userData.val();
//             }
//
//             if (userData.key === "Profile_Image_URL") {
//                 _profileImageUrl = userData.val();
//             }
//
//         });
//
//         database.ref("users/" + _uid + "/organization").once("value").then((organization) => {
//
//             organization.forEach((organizationData) => {
//                 if (organizationData.key === "departmentID") {
//                     _departmentID = organizationData.val();
//                 }
//
//                 if (organizationData.key === "isHead") {
//                     _isHead = organizationData.val();
//                 }
//             });
//
//             database.ref("teams/" + _teamCode).once("value").then((teamDataFromFirebase) => {
//
//                 //Check if the Team with this teamcode exists
//                 if (teamDataFromFirebase.exists() == false) {
//                     response.status(401).send("Your teamCode is not valid");
//                     return null;
//                 }
//
//                 database.ref("teams/" + _teamCode + "/memberIDs").once("value").then((teamMembers) => {
//
//                     //Check if the user is already in the team
//                     teamMembers.forEach((teamMember) => {
//                         if (teamMember.val() === _uid) {
//                             isInMemberList = true;
//                             response.status(200).send("Successfully Joined Team").end();
//                             return null;
//                         }
//                     });
//
//                     if (isInMemberList == false) {
//                         //Find an empty spot in the team to add the player, update memberCount, player's teamcode field, and teamRecords. Also needs to check for the following:
//                         //1. Has the team already joined a game
//                         //2. Is the team full
//
//                         //Get team data from firebase
//                         teamDataFromFirebase.forEach((teamData) => {
//                             if (teamData.key === "gameId") {
//                                 _gameID = teamData.val();
//                             }
//
//                             if(teamData.key === "memberCount"){
//                                 _memberCount = teamData.val();
//                             }
//
//                             if(teamData.key === "gameType"){
//                                 _gameType = teamData.val();
//                             }
//                         });
//
//                         //Check that all data is recieved
//                         if(_gameID === "notfound"){
//                             response.status(401).send("gameID in this teamCode does not exist");
//                             return null;
//                         }
//                         if(_memberCount === "notfound"){
//                             response.status(401).send("memberCount in this teamCode does not exist");
//                             return null;
//                         }
//                         if(_gameType === "notfound"){
//                             response.status(401).send("gameType in this teamCode does not exist");
//                             return null;
//                         }
//
//                         //Check if the memberCount is less than 10
//                         if(parseInt(_memberCount, 10) >= 10){
//                             response.status(401).send("Unable to join beacuse the team is full");
//                             return null;
//                         }
//
//                         //Check if the gameType requested matches
//                         if(_gameType !== _myGameType){
//                             response.status(401).send("Game Type does not match");
//                             return null;
//                         }
//
//                         //Check if the team is already in a game, if is in game update all required fields
//                         if(_gameID === "placeholder"){
//
//                             //The team is not in game, add the player in to the memberIDs and update the player's teamCode
//                             //If we keep the database organized enough, i can just add the player according to the memeberCount, we will see if this is gonna be a problem
//                             let memberIDs_Update = {
//                                 [_memberCount]: _uid,
//                             };
//                             database.ref("teams/" + _teamCode + "/memberIDs").update(memberIDs_Update);
//
//                             // update the nameList
//                             let nameList_Update = {
//                                 [_memberCount]: _username,
//                             };
//                             database.ref("teams/" + _teamCode + "/nameList").update(nameList_Update);
//
//                             // update the skinIDList
//                             let skinIDList_Update = {
//                                 [_memberCount]: _skinID,
//                             };
//                             database.ref("teams/" + _teamCode + "/skinIDList").update(skinIDList_Update);
//
//                             // update the petIDList
//                             let petIDList_Update = {
//                                 [_memberCount]: _petID,
//                             };
//                             database.ref("teams/" + _teamCode + "/petIDList").update(petIDList_Update);
//
//                             // update the departmentIDList
//                             let departmentIDList_Update = {
//                                 [_memberCount]: _departmentID,
//                             };
//                             database.ref("teams/" + _teamCode + "/departmentIDList").update(departmentIDList_Update);
//
//                             // update the isHeadList
//                             let isHeadList_Update = {
//                                 [_memberCount]: _isHead,
//                             };
//                             database.ref("teams/" + _teamCode + "/isHeadList").update(isHeadList_Update);
//
//                             // update the isOnlineList
//                             let isOnlineList_Update = {
//                                 [_memberCount]: _isOnline,
//                             };
//                             database.ref("teams/" + _teamCode + "/isOnlineList").update(isOnlineList_Update);
//
//                             // update the profileImageUrlList
//                             let profileImageUrlList_Update = {
//                                 [_memberCount]: _profileImageUrl,
//                             };
//                             database.ref("teams/" + _teamCode + "/profileImageUrlList").update(profileImageUrlList_Update);
//
//                             //update the teamcode feild in user's data (might be unessessary)
//                             let teamCodeUpdate = {
//                                 teamCode: _teamCode,
//                             };
//                             database.ref("users/" + _uid).update(teamCodeUpdate);
//
//                             //Update the memberCount
//                             let count = 0;
//                             database.ref("teams/" + _teamCode + "/memberIDs").once("value").then((memberIDsFromFirebase) => {
//
//                                 //Check if memberID child exists
//                                 if (memberIDsFromFirebase.exists() == false) {
//                                     response.status(401).send("MemberIDs field in this team does not exist");
//                                     return null;
//                                 }
//
//                                 memberIDsFromFirebase.forEach((memberIDsData) => {
//                                     if (memberIDsData.val() !== "placeholder") {
//                                         count += 1;
//                                     }
//                                 });
//
//                                 //Update teamData (include updating teamRecords))
//                                 let teamData_Update = {
//                                     memberCount: count,
//                                 };
//                                 database.ref("teams/" + _teamCode).update(teamData_Update);
//
//                                 database.ref("teams/" + _teamCode + "/departmentIDList").once("value").then((departmentIDsInList) => {
//
//                                     // Get DepartmentIDs of the team
//                                     departmentIDsInList.forEach((departmentIDInList) => {
//                                         departmentIDs.push(departmentIDInList.val());
//                                     });
//
//                                     database.ref("teams/" + _teamCode + "/isHeadList").once("value").then((isHeadsInList) => {
//
//                                         // Get team member isHead values of the team
//                                         isHeadsInList.forEach((isHeadInList) => {
//                                             isHeads.push(isHeadInList.val());
//                                         });
//
//                                         for (let i = 0; i < departmentIDs.length; i++) {
//
//                                             // Check if departmentID or isHead value is placeholder
//                                             if (departmentIDs[i] == "placeholder" || isHeads[i] == "placeholder") {
//                                                 break;
//                                             }
//
//                                             let bonus = 1;
//
//                                             for (let j = 0; j < departmentIDs.length; j++) {
//
//                                                 // Check if departmentID or isHead value is placeholder
//                                                 if (departmentIDs[j] == "placeholder" || isHeads[j] == "placeholder") {
//                                                     break;
//                                                 }
//
//                                                 // Check if the two person comparing is the same person
//                                                 if (i != j) {
//
//                                                     // Check if they have the same departmentID
//                                                     if (departmentIDs[i] == departmentIDs[j]) {
//
//                                                         // They are at least colleagues
//                                                         bonus *= sameID;
//
//                                                         // Check which one is the Head -> neither would not have bonus
//                                                         if (isHeads[i] == "true") {
//                                                             bonus *= sameIDwithHead;
//                                                         }
//                                                         else if (isHeads[j] == "true") {
//                                                             bonus *= sameIDwithNotHead;
//                                                         }
//
//                                                     }
//
//                                                     // Check if they are the directly under or above
//                                                     else {
//                                                         let bonusNumber = compareDevelopmentID(departmentIDs[i], departmentIDs[j]);
//                                                         if (bonusNumber > 0) {
//                                                             bonus *= directlyUnder;
//                                                         }
//                                                         else if (bonusNumber < 0) {
//                                                             bonus *= directlyAbove;
//                                                         }
//                                                     }
//
//                                                 }
//
//                                             }
//
//                                             bonuses.push(bonus);
//                                         }
//
//                                         for (let i = bonuses.length; i < departmentIDs.length; i++) {
//                                             bonuses.push("placeholder");
//                                         }
//                                         let bonusList_Update = {
//                                             0: bonuses[0],
//                                             1: bonuses[1],
//                                             2: bonuses[2],
//                                             3: bonuses[3],
//                                             4: bonuses[4],
//                                             5: bonuses[5],
//                                             6: bonuses[6],
//                                             7: bonuses[7],
//                                             8: bonuses[8],
//                                             9: bonuses[9],
//                                         };
//                                         database.ref("teams/" + _teamCode + "/bonusList").update(bonusList_Update);
//
//                                         response.status(200).send("Successfully Joined Team");
//
//                                     }).catch((error) => {
//                                         console.log(error);
//                                     });
//
//                                 }).catch((error) => {
//                                     console.log(error);
//                                 });
//
//                             }).catch((error) => {
//                                 console.log(error);
//                             });
//
//                         }else{
//                             // Team is already in game
//                             response.status(401).send("The team is already in a game, please wait for them to return to the lobby");
//                         }
//                     }
//
//                 }).catch((error) => {
//                     console.log(error);
//                 });
//
//             }).catch((error) => {
//                 console.log(error);
//             });
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//     }).catch((error) => {
//         console.log(error);
//     });
// })
//
// /*
//     If user in team: check team member is null or not
//     If user in game: check team list is null or not
//     Leave team:
//     Update Organization Bonus: re-calculate team bonus
//  */
// route_team.get('/leave', function(request, response){
//     {
//     let _teamCode = request.query.TEAMCODE;
//     let _uid = request.query.UID;
//     let _leaderUID = "notfound";
//     let _memberCount = "notfound";
//     let _teamName = "notfound";
//     let _gameId = "notfound";
//     let isInMemberList = false;
//
//     let nextRunner = 0;
//     let userIsRunner = false;
//     let teamIsDead = true;
//     let nextRunner_skinID = "";
//     let nextRunner_petID = "";
//     let nextRunner_imageURL = "";
//
//     // organization data
//     let departmentIDs = [];
//     let isHeads = [];
//     let bonuses = [];
//
//     let sameID = 1.05; // same departmentID, Ex: 1.2.1 (Not Head) : 1.2.1 (Not Head)
//     let sameIDwithHead = 1.1; // same departmentID and one is head, Ex: 1.2.1 (Head) : 1.2.1 (Not Head)
//     let sameIDwithNotHead = 1.05; // same departmentID and other is head, Ex: 1.2.1 (Not Head) : 1.2.1 (Head)
//     let directlyUnder = 1.1; // directly under boss increase by 0.1 every stage, Ex: 1.2 (Head) : 1.2.1 (Not Head)
//     let directlyAbove = 1.05; //directly above boss increase by 0.1 every stage, Ex: 1.2.1 (Not Head) : 1.2 (Head)
//
//     database.ref("users/" + _uid).once("value").then((user) => {
//
//         //Check if the user exists
//         if (user.exists() == false) {
//             response.status(401).send("Your uid is not found, please try again!");
//             return null;
//         }
//
//         //Get the username
//         user.forEach((userData) => {
//             if (userData.key === "username") {
//                 _username = userData.val();
//             }
//         });
//
//         database.ref("teams/" + _teamCode).once("value").then((teamData_FromFirebase) => {
//
//             //Check if the Team with this teamcode exists
//             if(teamData_FromFirebase.exists() == false) {
//                 response.status(401).send("Your teamCode is not valid");
//                 return null;
//             }
//
//             let memberIDs_Array = [];
//             let nameList = [];
//             let skinIDList = [];
//             let petIDList = [];
//             let isOnlineList = [];
//             let profileImageUrlList = [];
//             let targetIndex = -1;
//             let isLeader = false;
//
//             //Get team data from firebase
//             teamData_FromFirebase.forEach((teamData) => {
//                 if (teamData.key === "teamLeader") {
//                     _leaderUID = teamData.val();
//                 }
//
//                 if(teamData.key === "memberCount"){
//                     _memberCount = parseInt(teamData.val(), 10);
//                 }
//
//                 if(teamData.key === "teamname") {
//                     _teamName = teamData.val();
//                 }
//
//                 if(teamData.key === "gameId") {
//                     _gameId = teamData.val();
//                 }
//             });
//
//             //Three Senarios:
//             //1. Team leader leaves the team, assign a new leader (next in line)
//             //2. Last member in the team, destroy the team
//             //3. Team member leaves the team, remove the player from the team
//
//             database.ref("teams/" + _teamCode + "/memberIDs").once("value").then((memberIDsData_FromFirebase) => {
//
//                 // Check if the memberIDs array exists
//                 if (memberIDsData_FromFirebase.exists() == false) {
//                     response.status(401).send("Error getting the memberIDs array from the given teamCode");
//                     return null;
//                 }
//
//                 //Check if the user is already in the team
//                 memberIDsData_FromFirebase.forEach((teamMember) => {
//                     if (teamMember.val() === _uid) {
//                         isInMemberList = true;
//                     }
//                 });
//
//                 if (isInMemberList == false) {
//                     response.status(401).send("Your uid is not in memberIDList");
//                 }
//                 else {
//                     if(_memberCount != 1){
//                         if(_leaderUID === _uid){
//                             isLeader = true;
//                         }
//
//                         let count = 0;
//                         memberIDsData_FromFirebase.forEach((data) => {
//                             if(data.val() === _uid){
//                                 targetIndex = count;
//                             }
//                             memberIDs_Array.push(data.val());
//                             count += 1;
//                         });
//
//                         if (targetIndex == -1) {
//                             response.status(401).send("Player not in team: "  + targetIndex + ", " +
//                             memberIDs_Array[0] + ", " +
//                             memberIDs_Array[1] + ", " +
//                             memberIDs_Array[2] + ", " +
//                             memberIDs_Array[3] + ", " +
//                             memberIDs_Array[4] + ", " +
//                             memberIDs_Array[5] + ", " +
//                             memberIDs_Array[6] + ", " +
//                             memberIDs_Array[7] + ", " +
//                             memberIDs_Array[8] + ", " +
//                             memberIDs_Array[9]);
//                         }
//
//                         //if the leader is out of the team, select a new leader
//                         if(isLeader){
//                             _leaderUID = memberIDs_Array[targetIndex + 1];
//                             database.ref("teams/" + _teamCode).update({
//                                 teamLeader: _leaderUID,
//                             });
//                         }
//
//                         // Update the teamcode to placeholder in user data
//                         let teamCodeUpdate = {
//                             teamCode: "placeholder",
//                         };
//                         database.ref("users/" + _uid).update(teamCodeUpdate);
//
//                         //if gameId exists
//                         if (_gameId !== "placeholder") {
//                             database.ref("games/" + _gameId + "/gameInfo/teamInfo/" +
//                             _teamCode + "/runner").once("value").then((runner_uid) => {
//                                 if (runner_uid.val() === _uid) {
//                                     userIsRunner = true;
//                                 }
//
//                                 for(let i = targetIndex; i < memberIDs_Array.length - 1; ++i){
//                                     memberIDs_Array[i] = memberIDs_Array[i+ 1];
//                                 }
//                                 memberIDs_Array[memberIDs_Array.length - 1] = "placeholder";
//
//                                 //Update the modified memberIDs to firebase
//
//                                 let memberIDs_Update = {
//                                     0: memberIDs_Array[0],
//                                     1: memberIDs_Array[1],
//                                     2: memberIDs_Array[2],
//                                     3: memberIDs_Array[3],
//                                     4: memberIDs_Array[4],
//                                     5: memberIDs_Array[5],
//                                     6: memberIDs_Array[6],
//                                     7: memberIDs_Array[7],
//                                     8: memberIDs_Array[8],
//                                     9: memberIDs_Array[9],
//                                 };
//
//                                 database.ref("teams/" + _teamCode + "/memberIDs").update(memberIDs_Update);
//                                 _memberCount -= 1;
//                                 database.ref("teams/" + _teamCode).update({memberCount: _memberCount});
//
//                                 database.ref("teams/" + _teamCode + "/nameList").once("value").then((usernames) => {
//                                     let nameCount = 0;
//                                     usernames.forEach((names) => {
//                                         nameList.push(names.val());
//                                         nameCount += 1;
//                                     });
//
//                                     if (targetIndex == -1) {
//                                         response.status(401).send("Player not in team");
//                                     }
//
//                                     for(let i = targetIndex; i < nameList.length - 1; ++i){
//                                         nameList[i] = nameList[i+ 1];
//                                     }
//                                     nameList[nameList.length - 1] = "placeholder";
//
//                                     //Update the modified nameList to firebase
//
//                                     let nameList_Update = {
//                                         0: nameList[0],
//                                         1: nameList[1],
//                                         2: nameList[2],
//                                         3: nameList[3],
//                                         4: nameList[4],
//                                         5: nameList[5],
//                                         6: nameList[6],
//                                         7: nameList[7],
//                                         8: nameList[8],
//                                         9: nameList[9],
//                                     };
//
//                                     database.ref("teams/" + _teamCode + "/nameList").update(nameList_Update);
//
//                                     database.ref("teams/" + _teamCode + "/skinIDList").once("value").then((skinIDs) => {
//
//                                         let skinCount = 0;
//                                         skinIDs.forEach((skinID) => {
//                                             skinIDList.push(skinID.val());
//                                             skinCount += 1;
//                                         });
//
//                                         if (targetIndex == -1) {
//                                             response.status(401).send("Player not in team");
//                                         }
//
//                                         database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamCode).update({
//                                             runnerSkinID: skinIDList[nextRunner],
//                                         });
//
//                                         for(let i = targetIndex; i < skinIDList.length - 1; ++i){
//                                             skinIDList[i] = skinIDList[i+ 1];
//                                         }
//                                         skinIDList[skinIDList.length - 1] = "placeholder";
//
//                                         //Update the modified nameList to firebase
//
//                                         let skinIDList_Update = {
//                                             0: skinIDList[0],
//                                             1: skinIDList[1],
//                                             2: skinIDList[2],
//                                             3: skinIDList[3],
//                                             4: skinIDList[4],
//                                             5: skinIDList[5],
//                                             6: skinIDList[6],
//                                             7: skinIDList[7],
//                                             8: skinIDList[8],
//                                             9: skinIDList[9],
//                                         };
//
//                                         database.ref("teams/" + _teamCode + "/skinIDList").update(skinIDList_Update);
//
//                                         database.ref("teams/" + _teamCode + "/petIDList").once("value").then((petIDs) => {
//                                             let petCount = 0;
//                                             petIDs.forEach((petID) => {
//                                                 petIDList.push(petID.val());
//                                                 petCount += 1;
//                                             });
//
//                                             if (targetIndex == -1) {
//                                                 response.status(401).send("Player not in team");
//                                             }
//
//                                             database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamCode).update({
//                                                 runnerPetID: petIDList[nextRunner],
//                                             });
//
//                                             for(let i = targetIndex; i < petIDList.length - 1; ++i){
//                                                 petIDList[i] = petIDList[i+ 1];
//                                             }
//                                             petIDList[petIDList.length - 1] = "placeholder";
//
//                                             //Update the modified nameList to firebase
//
//                                             let petIDList_Update = {
//                                                 0: petIDList[0],
//                                                 1: petIDList[1],
//                                                 2: petIDList[2],
//                                                 3: petIDList[3],
//                                                 4: petIDList[4],
//                                                 5: petIDList[5],
//                                                 6: petIDList[6],
//                                                 7: petIDList[7],
//                                                 8: petIDList[8],
//                                                 9: petIDList[9],
//                                             };
//
//                                             database.ref("teams/" + _teamCode + "/petIDList").update(petIDList_Update);
//
//                                             database.ref("teams/" + _teamCode + "/departmentIDList").once("value").then((departmentIDsInList) => {
//
//                                                 let departmentIDCount = 0;
//
//                                                 // Get DepartmentIDs of the team
//                                                 departmentIDsInList.forEach((departmentIDInList) => {
//                                                     departmentIDs.push(departmentIDInList.val());
//                                                     departmentIDCount += 1;
//                                                 });
//
//                                                 if (targetIndex == -1) {
//                                                     response.status(401).send("Player not in team");
//                                                 }
//
//                                                 for(let i = targetIndex; i < departmentIDs.length - 1; ++i){
//                                                     departmentIDs[i] = departmentIDs[i+ 1];
//                                                 }
//                                                 departmentIDs[departmentIDs.length - 1] = "placeholder";
//
//                                                 //Update the modified departmentIDs to firebase
//
//                                                 let departmentIDs_Update = {
//                                                     0: departmentIDs[0],
//                                                     1: departmentIDs[1],
//                                                     2: departmentIDs[2],
//                                                     3: departmentIDs[3],
//                                                     4: departmentIDs[4],
//                                                     5: departmentIDs[5],
//                                                     6: departmentIDs[6],
//                                                     7: departmentIDs[7],
//                                                     8: departmentIDs[8],
//                                                     9: departmentIDs[9],
//                                                 };
//
//                                                 database.ref("teams/" + _teamCode + "/departmentIDList").update(departmentIDs_Update);
//
//                                                 database.ref("teams/" + _teamCode + "/isHeadList").once("value").then((isHeadsInList) => {
//
//                                                     let isHeadCount = 0;
//
//                                                     // Get team member isHead values of the team
//                                                     isHeadsInList.forEach((isHeadInList) => {
//                                                         isHeads.push(isHeadInList.val());
//                                                         isHeadCount += 1;
//                                                     });
//
//                                                     if (targetIndex == -1) {
//                                                         response.status(401).send("Player not in team");
//                                                     }
//
//                                                     for(let i = targetIndex; i < isHeads.length - 1; ++i){
//                                                         isHeads[i] = isHeads[i+ 1];
//                                                     }
//                                                     isHeads[isHeads.length - 1] = "placeholder";
//
//                                                     //Update the modified isHeads to firebase
//
//                                                     let isHeads_Update = {
//                                                         0: isHeads[0],
//                                                         1: isHeads[1],
//                                                         2: isHeads[2],
//                                                         3: isHeads[3],
//                                                         4: isHeads[4],
//                                                         5: isHeads[5],
//                                                         6: isHeads[6],
//                                                         7: isHeads[7],
//                                                         8: isHeads[8],
//                                                         9: isHeads[9],
//                                                     };
//
//                                                     database.ref("teams/" + _teamCode + "/isHeadList").update(isHeads_Update);
//
//                                                     database.ref("teams/" + _teamCode + "/isOnlineList").once("value").then((isOnlines) => {
//
//                                                         let isOnlineCount = 0;
//
//                                                         // Get team member isOnline values of the team
//                                                         isOnlines.forEach((isOnline) => {
//                                                             isOnlineList.push(isOnline.val());
//                                                             isOnlineCount += 1;
//                                                         });
//
//                                                         if (targetIndex == -1) {
//                                                             response.status(401).send("Player not in team");
//                                                         }
//
//                                                         for(let i = targetIndex; i < isOnlineList.length - 1; ++i){
//                                                             isOnlineList[i] = isOnlineList[i+ 1];
//                                                         }
//                                                         isOnlineList[isOnlineList.length - 1] = "placeholder";
//
//                                                         //Update the modified isOnlines to firebase
//
//                                                         let isOnlineList_Update = {
//                                                             0: isOnlineList[0],
//                                                             1: isOnlineList[1],
//                                                             2: isOnlineList[2],
//                                                             3: isOnlineList[3],
//                                                             4: isOnlineList[4],
//                                                             5: isOnlineList[5],
//                                                             6: isOnlineList[6],
//                                                             7: isOnlineList[7],
//                                                             8: isOnlineList[8],
//                                                             9: isOnlineList[9],
//                                                         };
//
//                                                         database.ref("teams/" + _teamCode + "/isOnlineList").update(isOnlineList_Update);
//
//                                                         database.ref("teams/" + _teamCode + "/profileImageUrlList").once("value").then((profileImageUrls) => {
//
//                                                             let profileImageUrlCount = 0;
//
//                                                             // Get team member profileImageUrl values of the team
//                                                             profileImageUrls.forEach((profileImageUrl) => {
//                                                                 profileImageUrlList.push(profileImageUrl.val());
//                                                                 profileImageUrlCount += 1;
//                                                             });
//
//                                                             if (targetIndex == -1) {
//                                                                 response.status(401).send("Player not in team");
//                                                             }
//
//                                                             for(let i = targetIndex; i < profileImageUrlList.length - 1; ++i){
//                                                                 profileImageUrlList[i] = profileImageUrlList[i+ 1];
//                                                             }
//                                                             profileImageUrlList[profileImageUrlList.length - 1] = "placeholder";
//
//                                                             //Update the modified profileImageUrls to firebase
//
//                                                             let profileImageUrlList_Update = {
//                                                                 0: profileImageUrlList[0],
//                                                                 1: profileImageUrlList[1],
//                                                                 2: profileImageUrlList[2],
//                                                                 3: profileImageUrlList[3],
//                                                                 4: profileImageUrlList[4],
//                                                                 5: profileImageUrlList[5],
//                                                                 6: profileImageUrlList[6],
//                                                                 7: profileImageUrlList[7],
//                                                                 8: profileImageUrlList[8],
//                                                                 9: profileImageUrlList[9],
//                                                             };
//
//                                                             database.ref("teams/" + _teamCode + "/profileImageUrlList").update(profileImageUrlList_Update);
//
//                                                             for (let i = 0; i < departmentIDs.length; i++) {
//
//                                                                 // Check if departmentID or isHead value is placeholder
//                                                                 if (departmentIDs[i] == "placeholder" || isHeads[i] == "placeholder") {
//                                                                     break;
//                                                                 }
//
//                                                                 let bonus = 1;
//
//                                                                 for (let j = 0; j < departmentIDs.length; j++) {
//
//                                                                     // Check if departmentID or isHead value is placeholder
//                                                                     if (departmentIDs[j] == "placeholder" || isHeads[j] == "placeholder") {
//                                                                         break;
//                                                                     }
//
//                                                                     // Check if the two person comparing is the same person
//                                                                     if (i != j) {
//
//                                                                         // Check if they have the same departmentID
//                                                                         if (departmentIDs[i] == departmentIDs[j]) {
//
//                                                                             // They are at least colleagues
//                                                                             bonus *= sameID;
//
//                                                                             // Check which one is the Head -> neither would not have bonus
//                                                                             if (isHeads[i] == "true") {
//                                                                                 bonus *= sameIDwithHead;
//                                                                             }
//                                                                             else if (isHeads[j] == "true") {
//                                                                                 bonus *= sameIDwithNotHead;
//                                                                             }
//
//                                                                         }
//
//                                                                         // Check if they are the directly under or above
//                                                                         else {
//                                                                             let bonusNumber = compareDevelopmentID(departmentIDs[i], departmentIDs[j]);
//                                                                             if (bonusNumber > 0) {
//                                                                                 bonus *= directlyUnder;
//                                                                             }
//                                                                             else if (bonusNumber < 0) {
//                                                                                 bonus *= directlyAbove;
//                                                                             }
//                                                                         }
//
//                                                                     }
//
//                                                                 }
//
//                                                                 bonuses.push(bonus);
//                                                             }
//
//                                                             for (let i = bonuses.length; i < departmentIDs.length; i++) {
//                                                                 bonuses.push("placeholder");
//                                                             }
//                                                             let bonusList_Update = {
//                                                                 0: bonuses[0],
//                                                                 1: bonuses[1],
//                                                                 2: bonuses[2],
//                                                                 3: bonuses[3],
//                                                                 4: bonuses[4],
//                                                                 5: bonuses[5],
//                                                                 6: bonuses[6],
//                                                                 7: bonuses[7],
//                                                                 8: bonuses[8],
//                                                                 9: bonuses[9],
//                                                             };
//                                                             database.ref("teams/" + _teamCode + "/bonusList").update(bonusList_Update);
//
//                                                             if (userIsRunner == true) {
//                                                                 // get the correct runnerId that is online
//                                                                 nextRunner = targetIndex;
//
//                                                                 for (let i = 0; i < _memberCount; i++) {
//
//                                                                     nextRunner = (nextRunner + 1) % _memberCount;
//                                                                     if (isOnlineList[nextRunner] == true || isOnlineList[nextRunner] == "True") {
//                                                                         teamIsDead = false;
//                                                                         break;
//                                                                     }
//
//                                                                 }
//
//                                                                 // set state in game / teamInfo that team is dead
//                                                                 if (teamIsDead == true) {
//                                                                     database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamCode).update({ teamIsDead: true });
//                                                                     console.log("no runners online -> team is dead");
//                                                                     response.status(200).send("Successfully Leave Team but there are no runners online in the team");
//                                                                     return null;
//                                                                 }
//
//                                                                 database.ref("teams/" + _teamCode + "/memberIDs").once("value").then((members) => {
//
//                                                                     let nextRunner_uid = "";
//                                                                     members.forEach((member) => {
//                                                                         if (member.key == runnerId.toString()) {
//                                                                             nextRunner_uid = member.val();
//                                                                         }
//                                                                     });
//
//                                                                     database.ref("users/" + nextRunner_uid).once("value").then((nextRunnerData) => {
//
//                                                                         // Check if next runner uid exists
//                                                                         if (nextRunnerData.exists() == false) {
//                                                                             console.log("nextRunner_uid not exists");
//                                                                             response.status(401).send("Next runner does not exist");
//                                                                             return null;
//                                                                         }
//
//                                                                         // Get next runner skinID
//                                                                         nextRunnerData.forEach((data) => {
//                                                                             if (data.key === "skinID") {
//                                                                                 nextRunner_skinID = parseInt(data.val(), 10);
//                                                                             }
//                                                                             if (data.key === "petID") {
//                                                                                 nextRunner_petID = parseInt(data.val(), 10);
//                                                                             }
//                                                                             if (data.key === "Profile_Image_URL") {
//                                                                                 nextRunner_imageURL = data.val();
//                                                                             }
//                                                                         });
//
//                                                                         let updates = {
//                                                                             runner: nextRunner_uid,
//                                                                             runnerSkinID: nextRunner_skinID,
//                                                                             runnerPetID: nextRunner_petID,
//                                                                             runnerImageURL: nextRunner_imageURL,
//                                                                         };
//
//                                                                         database.ref("games/" + _gameId + "/gameInfo/teamInfo/" + _teamCode).update(updates);
//                                                                         response.status(200).send("Successfully Leave Team");
//
//                                                                     }).catch((error) => {
//                                                                         console.log(error);
//                                                                     });
//
//                                                                 }).catch((error) => {
//                                                                     console.log(error);
//                                                                 });
//                                                             }
//
//                                                         }).catch((error) => {
//                                                             console.log(error);
//                                                         });
//
//                                                     }).catch((error) => {
//                                                         console.log(error);
//                                                     });
//
//                                                 }).catch((error) => {
//                                                     console.log(error);
//                                                 });
//
//                                             }).catch((error) => {
//                                                 console.log(error);
//                                             });
//
//                                         }).catch((error) => {
//                                             console.log(error);
//                                         });
//
//                                     }).catch((error) => {
//                                         console.log(error);
//                                     });
//
//                                 }).catch((error) => {
//                                     console.log(error);
//                                 });
//
//                             }).catch((error) => {
//                                 console.log(error);
//                             })
//                         }
//
//                         else { // if gameId not exists
//
//                             for(let i = targetIndex; i < memberIDs_Array.length - 1; ++i){
//                                 memberIDs_Array[i] = memberIDs_Array[i+ 1];
//                             }
//                             memberIDs_Array[memberIDs_Array.length - 1] = "placeholder";
//
//                             //Update the modified memberIDs to firebase
//
//                             let memberIDs_Update = {
//                                 0: memberIDs_Array[0],
//                                 1: memberIDs_Array[1],
//                                 2: memberIDs_Array[2],
//                                 3: memberIDs_Array[3],
//                                 4: memberIDs_Array[4],
//                                 5: memberIDs_Array[5],
//                                 6: memberIDs_Array[6],
//                                 7: memberIDs_Array[7],
//                                 8: memberIDs_Array[8],
//                                 9: memberIDs_Array[9],
//                             };
//
//                             database.ref("teams/" + _teamCode + "/memberIDs").update(memberIDs_Update);
//                             _memberCount -= 1;
//                             database.ref("teams/" + _teamCode).update({memberCount: _memberCount});
//
//                             database.ref("teams/" + _teamCode + "/nameList").once("value").then((usernames) => {
//                                 let nameCount = 0;
//                                 usernames.forEach((names) => {
//                                     nameList.push(names.val());
//                                     nameCount += 1;
//                                 });
//
//                                 if (targetIndex == -1) {
//                                     response.status(401).send("Player not in team");
//                                 }
//
//                                 for(let i = targetIndex; i < nameList.length - 1; ++i){
//                                     nameList[i] = nameList[i+ 1];
//                                 }
//                                 nameList[nameList.length - 1] = "placeholder";
//
//                                 //Update the modified memberIDs to firebase
//
//                                 let nameList_Update = {
//                                     0: nameList[0],
//                                     1: nameList[1],
//                                     2: nameList[2],
//                                     3: nameList[3],
//                                     4: nameList[4],
//                                     5: nameList[5],
//                                     6: nameList[6],
//                                     7: nameList[7],
//                                     8: nameList[8],
//                                     9: nameList[9],
//                                 };
//
//                                 database.ref("teams/" + _teamCode + "/nameList").update(nameList_Update);
//
//                                 database.ref("teams/" + _teamCode + "/skinIDList").once("value").then((skinIDs) => {
//
//                                     let skinCount = 0;
//                                     skinIDs.forEach((skinID) => {
//                                         skinIDList.push(skinID.val());
//                                         skinCount += 1;
//                                     });
//
//                                     if (targetIndex == -1) {
//                                         response.status(401).send("Player not in team");
//                                     }
//
//                                     for(let i = targetIndex; i < skinIDList.length - 1; ++i){
//                                         skinIDList[i] = skinIDList[i+ 1];
//                                     }
//                                     skinIDList[skinIDList.length - 1] = "placeholder";
//
//                                     //Update the modified nameList to firebase
//
//                                     let skinIDList_Update = {
//                                         0: skinIDList[0],
//                                         1: skinIDList[1],
//                                         2: skinIDList[2],
//                                         3: skinIDList[3],
//                                         4: skinIDList[4],
//                                         5: skinIDList[5],
//                                         6: skinIDList[6],
//                                         7: skinIDList[7],
//                                         8: skinIDList[8],
//                                         9: skinIDList[9],
//                                     };
//
//                                     database.ref("teams/" + _teamCode + "/skinIDList").update(skinIDList_Update);
//
//                                     database.ref("teams/" + _teamCode + "/petIDList").once("value").then((petIDs) => {
//
//                                         let petCount = 0;
//                                         petIDs.forEach((petID) => {
//                                             petIDList.push(petID.val());
//                                             petCount += 1;
//                                         });
//
//                                         if (targetIndex == -1) {
//                                             response.status(401).send("Player not in team");
//                                         }
//
//                                         for(let i = targetIndex; i < petIDList.length - 1; ++i){
//                                             petIDList[i] = petIDList[i+ 1];
//                                         }
//                                         petIDList[petIDList.length - 1] = "placeholder";
//
//                                         //Update the modified nameList to firebase
//
//                                         let petIDList_Update = {
//                                             0: petIDList[0],
//                                             1: petIDList[1],
//                                             2: petIDList[2],
//                                             3: petIDList[3],
//                                             4: petIDList[4],
//                                             5: petIDList[5],
//                                             6: petIDList[6],
//                                             7: petIDList[7],
//                                             8: petIDList[8],
//                                             9: petIDList[9],
//                                         };
//
//                                         database.ref("teams/" + _teamCode + "/petIDList").update(petIDList_Update);
//
//                                         database.ref("teams/" + _teamCode + "/departmentIDList").once("value").then((departmentIDsInList) => {
//
//                                             let departmentIDCount = 0;
//
//                                             // Get DepartmentIDs of the team
//                                             departmentIDsInList.forEach((departmentIDInList) => {
//                                                 departmentIDs.push(departmentIDInList.val());
//                                                 departmentIDCount += 1;
//                                             });
//
//                                             if (targetIndex == -1) {
//                                                 response.status(401).send("Player not in team");
//                                             }
//
//                                             for(let i = targetIndex; i < departmentIDs.length - 1; ++i){
//                                                 departmentIDs[i] = departmentIDs[i+ 1];
//                                             }
//                                             departmentIDs[departmentIDs.length - 1] = "placeholder";
//
//                                             //Update the modified departmentIDs to firebase
//
//                                             let departmentIDs_Update = {
//                                                 0: departmentIDs[0],
//                                                 1: departmentIDs[1],
//                                                 2: departmentIDs[2],
//                                                 3: departmentIDs[3],
//                                                 4: departmentIDs[4],
//                                                 5: departmentIDs[5],
//                                                 6: departmentIDs[6],
//                                                 7: departmentIDs[7],
//                                                 8: departmentIDs[8],
//                                                 9: departmentIDs[9],
//                                             };
//
//                                             database.ref("teams/" + _teamCode + "/departmentIDList").update(departmentIDs_Update);
//
//                                             database.ref("teams/" + _teamCode + "/isHeadList").once("value").then((isHeadsInList) => {
//
//                                                 let isHeadCount = 0;
//
//                                                 // Get team member isHead values of the team
//                                                 isHeadsInList.forEach((isHeadInList) => {
//                                                     isHeads.push(isHeadInList.val());
//                                                     isHeadCount += 1;
//                                                 });
//
//                                                 if (targetIndex == -1) {
//                                                     response.status(401).send("Player not in team");
//                                                 }
//
//                                                 for(let i = targetIndex; i < isHeads.length - 1; ++i){
//                                                     isHeads[i] = isHeads[i+ 1];
//                                                 }
//                                                 isHeads[isHeads.length - 1] = "placeholder";
//
//                                                 //Update the modified isHeads to firebase
//
//                                                 let isHeads_Update = {
//                                                     0: isHeads[0],
//                                                     1: isHeads[1],
//                                                     2: isHeads[2],
//                                                     3: isHeads[3],
//                                                     4: isHeads[4],
//                                                     5: isHeads[5],
//                                                     6: isHeads[6],
//                                                     7: isHeads[7],
//                                                     8: isHeads[8],
//                                                     9: isHeads[9],
//                                                 };
//
//                                                 database.ref("teams/" + _teamCode + "/isHeadList").update(isHeads_Update);
//
//                                                 database.ref("teams/" + _teamCode + "/isOnlineList").once("value").then((isOnlines) => {
//
//                                                     let isOnlineCount = 0;
//
//                                                     // Get team member isOnline values of the team
//                                                     isOnlines.forEach((isOnline) => {
//                                                         isOnlineList.push(isOnline.val());
//                                                         isOnlineCount += 1;
//                                                     });
//
//                                                     if (targetIndex == -1) {
//                                                         response.status(401).send("Player not in team");
//                                                     }
//
//                                                     for(let i = targetIndex; i < isOnlineList.length - 1; ++i){
//                                                         isOnlineList[i] = isOnlineList[i+ 1];
//                                                     }
//                                                     isOnlineList[isOnlineList.length - 1] = "placeholder";
//
//                                                     //Update the modified isOnlines to firebase
//
//                                                     let isOnlineList_Update = {
//                                                         0: isOnlineList[0],
//                                                         1: isOnlineList[1],
//                                                         2: isOnlineList[2],
//                                                         3: isOnlineList[3],
//                                                         4: isOnlineList[4],
//                                                         5: isOnlineList[5],
//                                                         6: isOnlineList[6],
//                                                         7: isOnlineList[7],
//                                                         8: isOnlineList[8],
//                                                         9: isOnlineList[9],
//                                                     };
//
//                                                     database.ref("teams/" + _teamCode + "/isOnlineList").update(isOnlineList_Update);
//
//                                                     database.ref("teams/" + _teamCode + "/profileImageUrlList").once("value").then((profileImageUrls) => {
//
//                                                         let profileImageUrlCount = 0;
//
//                                                         // Get team member profileImageUrl values of the team
//                                                         profileImageUrls.forEach((profileImageUrl) => {
//                                                             profileImageUrlList.push(profileImageUrl.val());
//                                                             profileImageUrlCount += 1;
//                                                         });
//
//                                                         if (targetIndex == -1) {
//                                                             response.status(401).send("Player not in team");
//                                                         }
//
//                                                         for(let i = targetIndex; i < profileImageUrlList.length - 1; ++i){
//                                                             profileImageUrlList[i] = profileImageUrlList[i+ 1];
//                                                         }
//                                                         profileImageUrlList[profileImageUrlList.length - 1] = "placeholder";
//
//                                                         //Update the modified profileImageUrls to firebase
//
//                                                         let profileImageUrlList_Update = {
//                                                             0: profileImageUrlList[0],
//                                                             1: profileImageUrlList[1],
//                                                             2: profileImageUrlList[2],
//                                                             3: profileImageUrlList[3],
//                                                             4: profileImageUrlList[4],
//                                                             5: profileImageUrlList[5],
//                                                             6: profileImageUrlList[6],
//                                                             7: profileImageUrlList[7],
//                                                             8: profileImageUrlList[8],
//                                                             9: profileImageUrlList[9],
//                                                         };
//
//                                                         database.ref("teams/" + _teamCode + "/profileImageUrlList").update(profileImageUrlList_Update);
//
//                                                         for (let i = 0; i < departmentIDs.length; i++) {
//
//                                                             // Check if departmentID or isHead value is placeholder
//                                                             if (departmentIDs[i] == "placeholder" || isHeads[i] == "placeholder") {
//                                                                 break;
//                                                             }
//
//                                                             let bonus = 1;
//
//                                                             for (let j = 0; j < departmentIDs.length; j++) {
//
//                                                                 // Check if departmentID or isHead value is placeholder
//                                                                 if (departmentIDs[j] == "placeholder" || isHeads[j] == "placeholder") {
//                                                                     break;
//                                                                 }
//
//                                                                 // Check if the two person comparing is the same person
//                                                                 if (i != j) {
//
//                                                                     // Check if they have the same departmentID
//                                                                     if (departmentIDs[i] == departmentIDs[j]) {
//
//                                                                         // They are at least colleagues
//                                                                         bonus *= sameID;
//
//                                                                         // Check which one is the Head -> neither would not have bonus
//                                                                         if (isHeads[i] == "true") {
//                                                                             bonus *= sameIDwithHead;
//                                                                         }
//                                                                         else if (isHeads[j] == "true") {
//                                                                             bonus *= sameIDwithNotHead;
//                                                                         }
//
//                                                                     }
//
//                                                                     // Check if they are the directly under or above
//                                                                     else {
//                                                                         let bonusNumber = compareDevelopmentID(departmentIDs[i], departmentIDs[j]);
//                                                                         if (bonusNumber > 0) {
//                                                                             bonus *= directlyUnder;
//                                                                         }
//                                                                         else if (bonusNumber < 0) {
//                                                                             bonus *= directlyAbove;
//                                                                         }
//                                                                     }
//
//                                                                 }
//
//                                                             }
//
//                                                             bonuses.push(bonus);
//                                                         }
//
//                                                         for (let i = bonuses.length; i < departmentIDs.length; i++) {
//                                                             bonuses.push("placeholder");
//                                                         }
//                                                         let bonusList_Update = {
//                                                             0: bonuses[0],
//                                                             1: bonuses[1],
//                                                             2: bonuses[2],
//                                                             3: bonuses[3],
//                                                             4: bonuses[4],
//                                                             5: bonuses[5],
//                                                             6: bonuses[6],
//                                                             7: bonuses[7],
//                                                             8: bonuses[8],
//                                                             9: bonuses[9],
//                                                         };
//                                                         database.ref("teams/" + _teamCode + "/bonusList").update(bonusList_Update);
//
//                                                         response.status(200).send("Successfully Leave Team");
//
//                                                     }).catch((error) => {
//                                                         console.log(error);
//                                                     });
//
//                                                 }).catch((error) => {
//                                                     console.log(error);
//                                                 });
//
//                                             }).catch((error) => {
//                                                 console.log(error);
//                                             });
//
//                                         }).catch((error) => {
//                                             console.log(error);
//                                         });
//
//                                     }).catch((error) => {
//                                         console.log(error);
//                                     });
//
//                                 }).catch((error) => {
//                                     console.log(error);
//                                 });
//
//                             }).catch((error) => {
//                                 console.log(error);
//                             });
//                         }
//
//                     }else{
//
//                         //Only one person left in the team, destroy the team
//                         //TODO: Destroy the team
//
//                         database.ref("teams/" + _teamCode).remove();
//                         database.ref("teams/teamNameList/" + _teamName).remove();
//                         database.ref("team_version_control/" + _teamCode).remove();
//                         response.status(200).send("Successfully Leave Team, Team Destroyed");
//
//                     }//if(_memberCount != 1)
//                 }
//
//             }).catch((error) => {
//                 console.log(error);
//             });
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//     }).catch((error) => {
//         console.log(error);
//     });
// }
// })
//
// route_team.get('/update', function(request, response){
//     let _uid = request.query.UID;
//     let _teamcode = request.query.TEAMCODE;
//     let _gameId = "notfound";
//     let _gameType = "notfound";
//     let _memberCount = -1;
//     let _teamLeader = "notfound";
//     let _teamname = "notfound";
//     let _isLeader = false;
//     let _memberIDs = [];
//     let _nameList = [];
//     let _skinIDList = [];
//     let _petIDList = [];
//     let _departmentIDList = [];
//     let _isHeadList = [];
//     let _bonusList = [];
//     let _isOnlineList = [];
//     let _profileImageUrlList = [];
//
//     let isInTeam = false;
//
//     database.ref("teams/" + _teamcode).once("value").then((teamData) => {
//
//         // Check if team exists
//         if (teamData.exists() == false) {
//             response.status(401).send("Your teamcode is not valid");
//             return null;
//         }
//
//         database.ref("teams/" + _teamcode + "/memberIDs").once("value").then((memberIDsData) => {
//
//             memberIDsData.forEach((memberData) => {
//                 _memberIDs.push(memberData.val());
//                 if (memberData.val() === _uid) {
//                     isInTeam = true;
//                 }
//             });
//
//             // Uid is not in the team memberIDs list
//             if (isInTeam == false) {
//                 response.status(401).send("Your uid is not in the team memberIDs list");
//                 return null;
//             }
//
//             // Get team data
//             teamData.forEach((data) => {
//                 if (data.key === "gameId") {
//                     _gameId = data.val();
//                 }
//                 else if (data.key === "gameType") {
//                     _gameType = data.val();
//                 }
//                 else if (data.key === "memberCount") {
//                     _memberCount = data.val();
//                 }
//                 else if (data.key === "teamLeader") {
//                     _teamLeader = data.val();
//                 }
//                 else if (data.key === "teamname") {
//                     _teamname = data.val();
//                 }
//             });
//
//             if (_teamLeader === _uid) {
//                 _isLeader = true;
//             }
//
//             let count = 0;
//             for (let i = 0; i < _memberIDs.length; i++) {
//                 if (_memberIDs[i] !== "placeholder") {
//                     count += 1;
//                 }
//             }
//             if (count != _memberCount) {
//                 _memberCount = count;
//             }
//
//             database.ref("teams/" + _teamcode + "/nameList").once("value").then((usernames) => {
//                 usernames.forEach((names) => {
//                     _nameList.push(names.val());
//                 });
//
//                 database.ref("teams/" + _teamcode + "/skinIDList").once("value").then((skinIDs) => {
//                     skinIDs.forEach((skinID) => {
//                         _skinIDList.push(skinID.val());
//                     });
//
//                     database.ref("teams/" + _teamcode + "/petIDList").once("value").then((petIDs) => {
//                         petIDs.forEach((petID) => {
//                             _petIDList.push(petID.val());
//                         });
//
//                         database.ref("teams/" + _teamcode + "/departmentIDList").once("value").then((departmentIDs) => {
//                             departmentIDs.forEach((departmentID) => {
//                                 _departmentIDList.push(departmentID.val());
//                             });
//
//                             database.ref("teams/" + _teamcode + "/isHeadList").once("value").then((isHeads) => {
//                                 isHeads.forEach((isHead) => {
//                                     _isHeadList.push(isHead.val());
//                                 });
//
//                                 database.ref("teams/" + _teamcode + "/bonusList").once("value").then((bonuses) => {
//                                     bonuses.forEach((bonus) => {
//                                         _bonusList.push(bonus.val());
//                                     });
//
//                                     database.ref("teams/" + _teamcode + "/isOnlineList").once("value").then((isOnlines) => {
//                                         isOnlines.forEach((isOnline) => {
//                                             _isOnlineList.push(isOnline.val());
//                                         });
//
//                                         database.ref("teams/" + _teamcode + "/profileImageUrlList").once("value").then((profileImageUrls) => {
//                                             profileImageUrls.forEach((profileImageUrl) => {
//                                                 _profileImageUrlList.push(profileImageUrl.val());
//                                             });
//
//                                             // Sendback values updating the values of the team
//                                             let sendBack = {
//                                                 teamCode: _teamcode,
//                                                 gameId: _gameId,
//                                                 gameType: _gameType,
//                                                 memberCount: _memberCount,
//                                                 memberIDs: _memberIDs,
//                                                 teamname: _teamname,
//                                                 isLeader: _isLeader,
//                                                 nameList: _nameList,
//                                                 skinIDList: _skinIDList,
//                                                 petIDList: _petIDList,
//                                                 departmentIDList: _departmentIDList,
//                                                 isHeadList: _isHeadList,
//                                                 bonusList: _bonusList,
//                                                 isOnlineList: _isOnlineList,
//                                                 profileImageUrlList: _profileImageUrlList,
//                                             };
//
//                                             response.status(200).send(sendBack);
//
//                                         }).catch((error) => {
//                                             console.log(error);
//                                         });
//
//                                     }).catch((error) => {
//                                         console.log(error);
//                                     });
//
//                                 }).catch((error) => {
//                                     console.log(error);
//                                 });
//
//                             }).catch((error) => {
//                                 console.log(error);
//                             });
//
//                         }).catch((error) => {
//                             console.log(error);
//                         });
//
//                     }).catch((error) => {
//                         console.log(error);
//                     });
//
//                 }).catch((error) => {
//                     console.log(error);
//                 });
//
//             }).catch((error) => {
//                 console.log(error);
//             });
//
//         }).catch((error) => {
//             console.log(error);
//         });
//
//     }).catch((error) => {
//         console.log(error);
//     });
// })
//
// function generateId() {
//     possibleChars = "0123456789";
//     let teamId = "";
//     for (let j = 0; j < 6; j++) teamId += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
//     return teamId;
// }
//
// // Compare developmentID for bonuses for Join Team and Leave Team
// function compareDevelopmentID(firstID, secondID) {
//     let firstLevel = firstID.split('_').length;
//     let secondLevel = secondID.split('_').length;
//
//     if (firstLevel > secondLevel) {
//         if (firstID.substring(0, secondID.length) == secondID) {
//             let subFirstID = firstID.substring(secondID.length);
//             if (subFirstID.charAt(0) == '_') {
//                 return (subFirstID.split('_').length - 1) * (-1);
//             }
//         }
//     }
//     else {
//         if (secondID.substring(0, firstID.length) == firstID) {
//             let subSecondID = secondID.substring(firstID.length);
//             if (subSecondID.charAt(0) == '_') {
//                 return subSecondID.split('_').length - 1;
//             }
//         }
//     }
//
//     return 0;
// }


module.exports = route_team
