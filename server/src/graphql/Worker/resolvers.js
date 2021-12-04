const { prisma } = require('../../../utils/context')

const Worker = {
  Query: {
    findUniqueWorker: (_parent, args, { verify }) => {
      return prisma.worker.findUnique(args)
    },
    findFirstWorker: (_parent, args, { verify }) => {
      return prisma.worker.findFirst(args)
    },
    findManyWorker: (_parent, args, { verify }) => {
      return prisma.worker.findMany(args)
    },
    findManyWorkerCount: (_parent, args, { verify }) => {
      return prisma.worker.count(args)
    },
    aggregateWorker: (_parent, args, { verify }) => {
      return prisma.worker.aggregate(args)
    },
  },
  Mutation: {
    createOneWorker: (_parent, args, { verify }) => {
      return prisma.worker.create(args)
    },
    updateOneWorker: (_parent, args, { verify }) => {
      return prisma.worker.update(args)
    },
    deleteOneWorker: async (_parent, args, { verify }) => {
      return prisma.worker.delete(args)
    },
    upsertOneWorker: async (_parent, args, { verify }) => {
      return prisma.worker.upsert(args)
    },
    deleteManyWorker: async (_parent, args, { verify }) => {
      return prisma.worker.deleteMany(args)
    },
    updateManyWorker: (_parent, args, { verify }) => {
      return prisma.worker.updateMany(args)
    },
  },
}

module.exports = {
  Worker,
}
