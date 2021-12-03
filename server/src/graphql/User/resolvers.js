const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { prisma } = require('../../../utils/context')

const User = {
  Query: {
    findMeUser: async (_parent, { }, { verify, select }) => {
      return prisma.user.findUnique({ where: { id: verify.id }, ...select })
    },
    findUniqueUser: (_parent, args, { verify }) => {
      return prisma.user.findUnique(args)
    },
    findFirstUser: (_parent, args, { verify }) => {
      return prisma.user.findFirst(args)
    },
    findManyUser: (_parent, args, { verify }) => {
      return prisma.user.findMany(args)
    },
    findManyUserCount: (_parent, args, { verify }) => {
      return prisma.user.count(args)
    },
    aggregateUser: (_parent, args, { verify }) => {
      return prisma.user.aggregate(args)
    },
  },
  Mutation: {
    loginUser: async (_parent, { data: { email, password } }, { }) => {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) throw new Error('not-found')
      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) throw new Error('invalid-password')
      const token = await jwt.sign({ id: user.id }, process.env.TOKEN_SECRET)
      return { token, user }
    },
    createOneUser: (_parent, args, { verify }) => {
      return prisma.user.create(args)
    },
    updateOneUser: (_parent, args, { verify }) => {
      return prisma.user.update(args)
    },
    deleteOneUser: async (_parent, args, { verify }) => {
      return prisma.user.delete(args)
    },
    upsertOneUser: async (_parent, args, { verify }) => {
      return prisma.user.upsert(args)
    },
    deleteManyUser: async (_parent, args, { verify }) => {
      return prisma.user.deleteMany(args)
    },
    updateManyUser: (_parent, args, { verify }) => {
      return prisma.user.updateMany(args)
    },
  },
}

module.exports = {
  User,
}
