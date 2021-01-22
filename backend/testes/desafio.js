const db = require('../config/db')

async function saveUser(nome, email, password) {
    let hasUser = await db('users').where({ email }).first()

    let newUser = {
        nome: nome,
        email: email,
        password: password
    }

    if(!hasUser) {
        await db('users').insert(newUser)
        hasUser = await db('users').where({ email }).first()
    }
    else {
        await db('users')
            .where({ id: hasUser.id })
            .update(newUser)
            
        hasUser = { ...hasUser, newUser}
    }

    return hasUser
}

async function savePerfil(nome, rotulo) {
    let hasPerfil = await db('perfis').where({ nome }).first()

    let newPerfil = {
        nome: nome,
        rotulo: rotulo,
    }

    if(!hasPerfil) {
        await db('perfis').insert(newPerfil)

    }
    else {
        await db('perfis')
            .where({ id: hasPerfil.id })
            .update(newPerfil)
    }

    hasPerfil = { ...hasPerfil, newPerfil}

    return hasPerfil
}

async function addPerfis(user, ...perfis) {
    const user_id = user.id
    await db('perfis_users')
            .where({ user_id })
            .delete()

    for(perfil of perfis) {
        const perfil_id = perfil.id
        await db('perfis_users')
                .insert({ user_id, perfil_id })
    }
}

async function execute() {
    const user    = await saveUser('Carlos das cove', 'carlos@email.com', '123456')
    const perfilA = await savePerfil('rh', 'Pessoal')
    const perfilB = await savePerfil('fin', 'Financeiro')
    const perfilC = await savePerfil('dev', 'Desenvolvimento')
    const perfilD = await savePerfil('infra', 'Infra estrutura de TI')
    const perfilE = await savePerfil('tel', 'Telefonia')

    console.log(user)
    console.log(perfilA)
    console.log(perfilB)
    console.log(perfilC)
    console.log(perfilD)
    console.log(perfilE)

    await addPerfis(user, /*perfilA,*/ perfilB/*, perfilC, perfilD, perfilE*/)
}

execute()
    .catch(err => console.log(err))
    .finally(() => db.destroy())