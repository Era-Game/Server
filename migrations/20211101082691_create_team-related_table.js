
exports.up = function(knex) {
  return knex.schema
      .createTable('teams', function (table) {
          table.increments('id');
          table.integer('leader_id')
              .unsigned().references('id')
              .inTable('users')
              .onDelete('CASCADE')
              .index();
          table.integer('game_id')
              .unsigned().references('id')
              .inTable('games')
              .onDelete('CASCADE')
              .index();
          table.enum('status', ['created', 'matching', 'ready', 'playing','dismissed']).defaultTo('created');
          table.float('accuDistance');
          table.integer('accuStep');
          table.timestamps();
      })
      .createTable('team_user_list', function(table) {
          table.integer('id').unsigned().notNullable().unique()
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

          // composite key
          table.primary(['team_id', 'user_id']);

          table.integer('skin_id')
              .unsigned().references('id')
              .inTable('skins')
              .onDelete('CASCADE')
              .index();
          table.enum('status', ['joined', 'ready', 'left']).defaultTo('joined');
          table.float('currVelocity');
          table.float('accelVelocity');
          table.float('accuDistance');
          table.timestamps();
      })
      .alterTable(
          'team_user_list',
          (table) => {
              table
                  .increments('id', { primaryKey: false }).alter()
          })
      .alterTable(
          'teams',
          (table) => {
              table
                  .integer('curr_player_id')
                  .unsigned().references('user_id')
                  .inTable('team_user_list')
                  .onDelete('CASCADE')
                  .index();
          }
      )
};

exports.down = function(knex) {
    return knex.schema.alterTable("teams", (table) => {
        table.dropForeign("leader_id");
        table.dropForeign("game_id");
        table.dropForeign("curr_player_id");
    })
        .alterTable("team_user_list", (table) => {
            table.dropForeign("team_id");
            table.dropForeign("user_id");
        })
        .dropTable("teams")
        .dropTable("team_user_list")
};
