const bcrypt = require('bcrypt-nodejs')

const db = require('../../config/db')
const { perfil: getPerfil } = require('../Query/perfil') //Reuso de código
const { user: getUser } = require('../Query/user') //Reuso de código

const mutations = {
    registerUser(_, { data }) {
        return mutations.newUser(_, {
            data: {
                nome: data.nome,
                email: data.email,
                password: data.password,
            }
        })
    },

    async newUser(_, { data }, context) {
        context && context.validarAdmin()

        try {
            const perfisId = []

            if(!data.perfis || !data.perfis.length) {
                data.perfis = [{
                    nome: 'comum'
                }]
            }

            for(let filter of data.perfis) {
                const perfil = await getPerfil(_, { filter })

                if(perfil) {
                    perfisId.push(perfil.id)
                }
            }

            delete data.perfis //Remove do objeto data pois na tabela user nao tem o campo perfis, vai gerar erro no insert

            //Criptografar senhas
            const salt = bcrypt.genSaltSync()
            data.password = bcrypt.hashSync(data.password, salt)

            const [ id ] = await db('users').insert({ ...data })

            //usar o mesmo nome do campo do BD, evita perfil_id: perfil_id
            for(let perfil_id of perfisId) {
                await db('perfis_users').insert({ perfil_id, user_id: id })
            }

            return db('users').where({ id }).first()
        }
        catch (e) {
            throw new Error(e.sqlMessage)
        }
    },

    async deleteUser(_, { filter }, context) {
        context && context.validarAdmin()

        try {
            const user = await getUser(_, { filter })

            if(user) {
                const { id } = user

                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                var hh = String(today.getHours()).padStart(2, '0')
                var mi = String(today.getMinutes()).padStart(2, '0')
                var ss = String(today.getSeconds()).padStart(2, '0')
                today = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mi + ':' + ss;

                await db('users').where({ id }).update({ deleted_at: today })
                return user
            }
        }
        catch (e) {
            throw new Error(e.sqlMessage)
        }
    },

    async editUser(_, { filter, data }, context) {
        context && context.validarUsuarioFiltro(filter)

        try {
            const user = await getUser(_, { filter })

            if(user) {
                const { id } = user

                if(context.admin && data.perfis) {
                    await db('perfis_users').where({ user_id: id }).delete()

                    for(let filter of data.perfis) {
                        const perfil = await getPerfil(_, { filter })
                        //&& faz o papel do if: if(perfil) { await........}
                        perfil && await db('perfis_users').insert({ perfil_id: perfil.id, user_id: id })
                    }
                }

                delete data.perfis //Remove do objeto data pois na tabela user nao tem o campo perfis, vai gerar erro no insert

                if(data.password) {
                    //Criptografar senhas
                    const salt = bcrypt.genSaltSync()
                    data.password = bcrypt.hashSync(data.password, salt)
                }

                await db('users').where({ id }).update(data)
                //return { ...user, ...data } //Objeto com os dados antigos e novos mesclados
            }

            return !user ? null : { ...user, ...data }
        }
        catch (e) {
            throw new Error(e)
        }
    }
}

module.exports = mutations