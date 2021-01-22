
exports.up = function(knex) {
  return knex.schema.createTable('perfis', (table) => {
    table.increments();
    table.string('nome').notNullable().unique();
    table.string('rotulo').notNullable().unique();

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.timestamp('deleted_at')
  }).then(() => {
      return knex('perfis').insert([
          {nome: 'comum', rotulo: 'Comum'},
          {nome: 'admin', rotulo: 'Administrador'},
          {nome: 'master', rotulo: 'Master'}
      ])
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('perfis');
};
