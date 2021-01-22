const db = require('../../config/db')
const bcrypt = require('bcrypt-nodejs')
const { getLoggedUser } = require('../Functions/user')

module.exports = {
    async users(_, args, context) {
        context && context.validarAdmin()

        return db('users').where({deleted_at: null})
    },

    async user(_, { filter }, context) {
        context && context.validarUsuarioFiltro(filter)

        if(!filter) return null

        const { id, email } = filter //Destructuring: pega as variáveis de filter e passa para as de const

        if(id) {
            return await db('users').where({ id }).first()
        }
        else if(email) {
            return await db('users').where({ email }).first()
        }
        else {
            return null
        }
    },

    async login(_, { filter }) {
        const user = await db('users').where({ email: filter.email }).first()
        if(!user) {
            throw new Error('Usuário/Senha inválidos!');
        }

        const comparePasswords = bcrypt.compareSync(filter.password, user.password)
        if(!comparePasswords) {
            throw new Error('Usuário/Senha não conferem!');
        }

        return getLoggedUser(user)
    },
}