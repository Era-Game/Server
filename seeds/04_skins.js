
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('skins').del()
    .then(function () {
      // Inserts seed entries
      return knex('skins').insert([
          {
              "id" : 1,
              "name" : "default",
              "price" : 0,
              "created_at" : "2021-12-01 02:00:00",
              "updated_at" : "2021-12-01 02:00:00"
          }
      ]);
    });
};
