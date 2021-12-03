const { prisma } = require('../../../utils/context')

const Target = {
  Query: {
    findUniqueTarget: (_parent, args, { verify }) => {
      return prisma.target.findUnique(args)
    },
    findFirstTarget: (_parent, args, { verify }) => {
      return prisma.target.findFirst(args)
    },
    findManyTarget: (_parent, args, { verify }) => {
      return prisma.target.findMany(args)
    },
    findManyTargetCount: (_parent, args, { verify }) => {
      return prisma.target.count(args)
    },
    aggregateTarget: (_parent, args, { verify }) => {
      return prisma.target.aggregate(args)
    },
  },
  Mutation: {
    createOneTarget: (_parent, args, { verify }) => {
      return prisma.target.create(args)
    },
    updateOneTarget: (_parent, args, { verify }) => {
      return prisma.target.update(args)
    },
    deleteOneTarget: async (_parent, args, { verify }) => {
      return prisma.target.delete(args)
    },
    upsertOneTarget: async (_parent, args, { verify }) => {
      return prisma.target.upsert(args)
    },
    deleteManyTarget: async (_parent, args, { verify }) => {
      return prisma.target.deleteMany(args)
    },
    updateManyTarget: (_parent, args, { verify }) => {
      return prisma.target.updateMany(args)
    },
  },
}

module.exports = {
  Target,
}
