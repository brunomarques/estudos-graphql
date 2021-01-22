require('dotenv').config()

const { ApolloServer, gql } = require('apollo-server')
const { importSchema }      = require('graphql-import')
const resolvers             = require('./resolvers')
const context               = require('./config/context')

const server = new ApolloServer({
    typeDefs: importSchema('./schemas/index.graphql'),
    resolvers,
    context
})

server.listen().then(({ url }) => {
    console.log(`Executando em ${url}`)
})