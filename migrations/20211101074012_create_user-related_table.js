
exports.up = function(knex) {
    return knex.schema
        .createTable('organizations', function (table) {
            table.increments('id');
            table.string('name', 255).notNullable();
            table.timestamps();
        })
        .createTable('departments', function (table) {
            table.increments('id');
            table.integer('org_id')
                .unsigned().references('id')
                .inTable('organizations')
                .onDelete('SET NULL')
                .index();
            table.string('name', 255).notNullable();
            table.timestamps();
        })
        .createTable('skins', function (table){
            table.increments('id');
            table.string('name').notNullable();
            !table.integer('price').notNullable();
            table.timestamps();
        })
        .createTable('users', function (table) {
            table.increments('id');
            table.integer('org_id')
                .unsigned().references('id')
                .inTable('organizations')
                .onDelete('SET NULL')
                .index();
            table.integer('default_skin_id')
                .unsigned().references('id')
                .inTable('skins')
                .onDelete('SET NULL')
                .index();
            table.string('profileImgUrl', 255).notNullable();
            table.string('name', 64).notNullable();
            table.string('email', 255).notNullable();
            table.string('password', 255).notNullable();
            table.enum('status', ['activated', 'deactivated', 'blocked']).defaultTo('activated');
            table.timestamps();
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTable("organizations")
        .dropTable("departments")
        .dropTable("skins")
        .dropTable("users");
};
