
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('departments').del()
    .then(function () {
      // Inserts seed entries
      return knex('departments').insert([
          {
              "id" : 1,
              "org_id" : 1,
              "name" : "T&O",
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00"
          }
      ]);
    });
};
