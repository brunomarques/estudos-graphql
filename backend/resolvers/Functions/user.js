const jwt = require('jwt-simple')
const { perfis: getPerfis } = require('../Type/User')

module.exports = {
    async getLoggedUser(user) {
        const perfis = await getPerfis(user)
        const now = Math.floor(Date.now() / 1000) //em segundos

        //Payload do JWT
        const userInfo = {
            id: user.id,
            name: user.nome,
            email: user.email,
            perfis: perfis.map(p => p.nome),
            iat: now, 
                      //D   H    M    S
            exp: now + (3 * 24 * 60 * 60) //daqui a 3 dias, em segundos
        }

        //Chave de segurança
        const authSecret = process.env.APP_AUTH_SECRET

        return {
            ...userInfo,
            token: jwt.encode(userInfo, authSecret)
        }
    }
}