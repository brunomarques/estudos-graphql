const db = require('../../config/db')
const { perfil: getPerfil } = require('../Query/perfil') //Reuso de código

module.exports = {
    async newPerfil(_, { data }, context) {
        context && context.validarAdmin() //é a mesma coisa que: if(context) { context.validarAdmin() }

        try {
            const [ id ] = await db('perfis').insert({ ...data })
            return db('perfis').where({ id }).first()
        }
        catch (e) {
            throw new Error(e.sqlMessage)
        }
    },

    async deletePerfil(_, { filter }, context) {
        context && context.validarAdmin()

        try {                                   //objeto
            const perfil = await getPerfil(_, { filter })

            if(perfil) {
                const { id } = perfil //"Retira" (pega o valor) o id de dentro do objeto
                await db('perfis_users').where({ perfil_id: id }).delete()
                await db('perfis').where({ id }).delete()

                return perfil
            }
        }
        catch (e) {
            throw new Error(e.sqlMessage)
        }
    },

    async editPerfil(_, { filter, data }, context) {
        context && context.validarAdmin()

        try {                                   //objeto
            const perfil = await getPerfil(_, { filter })

            if(perfil) {
                const { id } = perfil //"Retira" (pega o valor) o id de dentro do objeto
                await db('perfis').where({ id }).update({ ...data })

                return { ...perfil, ...data } //Mescla o que trouxe do banco com o que foi passado para alteração (troca o velho pelo novo)
            }
        }
        catch (e) {
            throw new Error(e.sqlMessage)
        }
    }
}