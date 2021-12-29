
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function () {
      // Inserts seed entries
      return knex('teams').insert([
          {
              "id" : 1,
              "leader_id" : 1,
              "game_id" : 1,
              "status" : "created",
              "accuDistance" : null,
              "accuStep" : null,
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00",
              "curr_player_id" : null
          }
      ]);
    });
};
