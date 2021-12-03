require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const {
    ApolloServerPluginLandingPageGraphQLPlayground,
    ApolloServerPluginLandingPageDisabled
} = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')

//const { schema } = require('./graphql')
const { context } = require('./utils/context')
const { generateUser } = require('./utils/generator')
const { typeDefs } = require('./src/graphql/typeDefs')
const { resolvers } = require('./src/graphql/resolvers')
const { PrismaSelect } = require('@paljs/plugins')

const selects = async (resolve, root, args, context, info) => {
    const result = new PrismaSelect(info).value
    if (Object.keys(result.select).length > 0) {
        args = {
            ...args,
            ...result
        }
    }
    return resolve(root, args, context, info)
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

async function main() {
    const server = new ApolloServer({
        schema: applyMiddleware(schema, selects),
        context,
        formatError: (err) => {
            if (process.env.MODE === 'development') {
                console.error(err)
            }
            return err
        },
        plugins: [
            process.env.MODE === 'production'
                ? ApolloServerPluginLandingPageDisabled()
                : ApolloServerPluginLandingPageGraphQLPlayground()
        ]
    })

    const app = express()

    const port = process.env.PORT

    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }))
    app.use(bodyParser.json({ limit: '50mb' }))

    await server.start()

    server.applyMiddleware({ app })

    app.listen({ port }, async () => {
        console.log(`SERVER: started at :${port}`)
        generateUser()
    })
}

main()
