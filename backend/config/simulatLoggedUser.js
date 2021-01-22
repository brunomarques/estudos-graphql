const db = require('./db')
const { getLoggedUser } = require('../resolvers/Functions/user')

const sql = `
    select 
        u.*
    from 
        users u,
        perfis_users pu,
        perfis p
    where
        pu.user_id = u.id and
        pu.perfil_id = p.id and
        u.active = 1 and
        p.nome = :perfilName
    limit 1
`

const getUser = async (perfilName) => {
    const res = await db.raw(sql, {perfilName})
    return res ? res[0][0] : null
}

module.exports = async (req) => {
    const user = await getUser('admin')
    if(user) {
        const { token } = await getLoggedUser(user)
        req.headers = {
            authorization: `Bearer ${token}`
        }
    }
}