const { Target } = require('./Target/resolvers')
const { User } = require('./User/resolvers')

const resolvers = [User, Target]

module.exports = { resolvers }
