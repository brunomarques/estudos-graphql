const db = require('../../config/db')

module.exports = {
    async perfis(user) {
        return db('perfis')
                .join('perfis_users', 'perfis.id', 'perfis_users.perfil_id')
                .where({ user_id: user.id })
    }
}