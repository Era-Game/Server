
exports.up = function(knex) {
  return knex.schema
      .createTable('teams', function (table) {
          table.increments('id');
          table.integer('leader_id')
              .unsigned().references('id')
              .inTable('users')
              .onDelete('SET NULL')
              .index();
          table.integer('game_id')
              .unsigned().references('id')
              .inTable('games')
              .onDelete('SET NULL')
              .index();
          table.enum('status', ['created', 'matching', 'ready', 'playing','dismissed']).defaultTo('created');
          table.float('accuDistance');
          table.integer('accuStep');
          table.timestamps();
      })
      .createTable('team_user_list', function(table) {
          table.increments('id').primary();
          table
              .integer('team_id')
              .unsigned()
              .references('id')
              .inTable('teams')
              .onDelete('CASCADE')
              .index();
          table
              .integer('user_id')
              .unsigned()
              .references('id')
              .inTable('users')
              .onDelete('CASCADE')
              .index();
          table.integer('skin_id')
              .unsigned().references('id')
              .inTable('skins')
              .onDelete('SET NULL')
              .index();
          table.enum('status', ['joined', 'ready', 'left']).defaultTo('joined');
          table.float('currVelocity');
          table.float('accelVelocity');
          table.float('accuDistance');
          table.timestamps();
      })
      .alterTable(
          'teams',
          (table) => {
              table
                  .integer('curr_player_id')
                  .unsigned().references('user_id')
                  .inTable('team_user_list')
                  .onDelete('SET NULL')
                  .index();
          }
      )
};

exports.down = function(knex) {
    return knex.schema
        .dropTable("teams")
        .dropTable("team_user_list")
};
