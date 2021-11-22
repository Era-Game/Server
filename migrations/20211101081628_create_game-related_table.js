
exports.up = function(knex) {
    return knex.schema
        .createTable('game_mode', function (table){
            table.increments('id');
            table.string('name', 255);
            table.integer('maxOfTeam');
            table.integer('minOfTeam');
            table.integer('minOfTeamMember');
            table.integer('maxOfTeamMember');
            table.integer('targetDistance');
            table.integer('exchangeDistance');
            table.timestamps();
        })
        .createTable('games', function (table) {
            table.increments('id');
            table.integer('game_mode_id')
                .unsigned().references('id')
                .inTable('game_mode')
                .onDelete('CASCADE')
                .index();
            table.enum('status', ['created', 'ready', 'ongoing', 'terminated']).defaultTo('created');
            table.timestamps();
        })
};

exports.down = function(knex) {
    return knex.schema.alterTable("games", (table) => {
        table.dropForeign("game_mode_id");
    })
        .dropTable("games")
        .dropTable("game_mode")
};
