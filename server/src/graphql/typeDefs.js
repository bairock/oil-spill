const { Image } = require('./Image/typeDefs')
const { Target } = require('./Target/typeDefs')
const { User } = require('./User/typeDefs')
const { mergeTypeDefs } = require('@graphql-tools/merge')
const { sdlInputs } = require('@paljs/plugins')

const typeDefs = mergeTypeDefs([sdlInputs(), User, Target, Image])

module.exports = { typeDefs }
