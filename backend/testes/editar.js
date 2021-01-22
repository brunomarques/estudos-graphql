/*const db = require('../config/db')

const editUsuario = {
    nome: 'Pedro',
    email: 'pedro@email.com',
    password: '12345678'
}

async function update() {
            //pega o valor de qtde em si e nao o objeto com o valor
    const { qtde } = await db('users')
                     .count('* as qtde').first()

    if(qtde === 0) {
        console.error("insert user")
        await db('users').insert(editUsuario)
    }

    let { id } = await db('users')
                 .select('id')
                 .limit(1)
                 .first()
    await db('users')
    .where({ id })
    .update({
        nome: 'Pedrão editado',
        email: 'pedro.editado@email.com'
    }) 

    return db('users').where({ id })
}

update()
    .then(user => console.log(user))
    .finally(() => db.destroy())