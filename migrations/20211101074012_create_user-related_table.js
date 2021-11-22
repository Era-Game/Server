
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
                .onDelete('CASCADE')
                .index();
            table.string('name', 255).notNullable();
            table.timestamps();
        })
        .createTable('skins', function (table){
            table.increments('id');
            table.string('name').notNullable();
            table.integer('price').notNullable();
            table.timestamps();
        })
        .createTable('users', function (table) {
            table.increments('id');
            table.integer('dept_id')
                .unsigned().references('id')
                .inTable('departments')
                .onDelete('CASCADE')
                .index();
            table.integer('default_skin_id')
                .unsigned().references('id')
                .inTable('skins')
                .onDelete('CASCADE')
                .index();
            table.string('profileImgUrl', 255);
            table.string('name', 32);
            table.string('username', 32).unique().notNullable();
            table.string('email', 255).unique().notNullable();
            table.string('password', 255).notNullable();
            table.enum('status', ['activated', 'deactivated', 'blocked']).defaultTo('activated');
            table.timestamps();
        })
};

exports.down = function(knex) {
    return knex.schema.alterTable("departments", (table) => {
        table.dropForeign("org_id");
    }).
        alterTable("users", (table) => {
            table.dropForeign("dept_id");
            table.dropForeign("default_skin_id");
        })
        .dropTable("organizations")
        .dropTable("departments")
        .dropTable("skins")
        .dropTable("users");
};
