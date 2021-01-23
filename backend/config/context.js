const jwt = require('jwt-simple')

module.exports = async ({ req }) => {
    await require('./simulatLoggedUser')(req) //comentar em produção

    const auth = req.headers.authorization
    const token = auth && auth.substring(7)

    let user = null
    let admin = false

    if(token) {
        try {
            let contentToken = jwt.decode(token, process.env.APP_AUTH_SECRET)

            if(new Date(contentToken.exp * 1000) > new Date()) {
                user = contentToken
            }
        }
        catch(e) {
            //
        }
    }

    if(user && user.perfis) {
        admin = user.perfis.includes('admin') //includes retorna true ou false na pesquisa dentro do array
    }

    const error = new Error('Acesso negado!')

    return {
        user, admin,
        validarUsuario() {
            if(!user) throw error
        },
        validarAdmin() {
            if(!admin) throw error
        },
        validarUsuarioFiltro(filtro) {
            if(admin) return

            if(!user) throw error

            if(!filtro) throw error

            const { id, email } = filtro
            if(!id && !email) throw error

            if(id && id !== user.id) throw error
            if(email && email !== user.email) throw error
        }
    }
}