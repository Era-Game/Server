
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
          {
              "id" : 1,
              "dept_id" : 1,
              "default_skin_id" : 1,
              "profileImgUrl" : null,
              "name" : null,
              "username" : "test",
              "email" : "test@gmail.com",
              "password" : "$2b$10$tDGWMhFURDElceprblf\/H.\/4tRI\/O4ATSRa6P07JxgSb2sJnBBUKu",
              "status" : "activated",
              "created_at" : "2021-11-30 13:32:00",
              "updated_at" : "2021-11-30 13:32:00"
          }
      ]);
    });
};
