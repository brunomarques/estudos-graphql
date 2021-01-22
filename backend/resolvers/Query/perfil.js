const db = require('../../config/db')

module.exports = {
    async perfis(_, args , context) {
        context && context.validarAdmin()

        return db('perfis')
    },
    async perfil(_, { filter }, context) {
        context && context.validarAdmin()

        if(!filter) return null

        const { id, nome } = filter //Destructuring: pega as variáveis de filter e passa para as de const

        if(id) {
            return await db('perfis').where({ id }).first()
        }
        else if(nome) {
            return await db('perfis').where({ nome }).first()
        }
        else {
            return null
        }
    }
}