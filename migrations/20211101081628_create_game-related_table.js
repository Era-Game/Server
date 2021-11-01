
exports.up = function(knex) {
    return knex.schema
        .createTable('games', function (table) {
            table.increments('id');
            table.enum('status', ['single', 'multi']).defaultTo('single');
            table.float('accuDistance');
            table.integer('accuStep');
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable("games")
};
