
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('organizations').del()
    .then(function () {
      // Inserts seed entries
      return knex('organizations').insert([
          {
              "id" : 1,
              "name" : "DBS",
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00"
          }
      ]);
    });
};
