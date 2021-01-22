const db = require('../../config/db')

module.exports = {
    async users(perfil) {
        return db('users')
                .join('perfis_users', 'users.id', 'perfis_users.user_id')
                .where({ perfil_id: perfil.id })
    }
}