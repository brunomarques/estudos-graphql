
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('nome').notNullable();
    table.string('email').notNullable().unique();
    table.string('password', 60).notNullable();
    table.boolean('active').notNullable().defaultTo(true);

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
