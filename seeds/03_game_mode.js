
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('game_mode').del()
    .then(function () {
      // Inserts seed entries
      return knex('game_mode').insert([
          {
              "id" : 1,
              "name" : "single",
              "maxOfTeam" : 1,
              "minOfTeam" : 1,
              "minOfTeamMember" : 1,
              "maxOfTeamMember" : 1,
              "targetDistance" : 100,
              "exchangeDistance" : 100,
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00"
          }
      ]);
    });
};
