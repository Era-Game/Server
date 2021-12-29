
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('games').del()
    .then(function () {
      // Inserts seed entries
      return knex('games').insert([
          {
              "id" : 1,
              "game_mode_id" : 1,
              "status" : "created",
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00"
          }
      ]);
    });
};
