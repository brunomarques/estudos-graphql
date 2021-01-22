
exports.up = function(knex) {
  return knex.schema.createTable('perfis_users', (table) => {
    table.integer('perfil_id').unsigned();
    table.integer('user_id').unsigned();

    table.foreign('user_id').references('users.id');
    table.foreign('perfil_id').references('perfis.id');
    table.primary(['perfil_id', 'user_id']);

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('perfis_users');
};
