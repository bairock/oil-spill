const { default: gql } = require('graphql-tag')

const Worker = gql`
  type Worker {
    id: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    email: String!
    name: String!
    position: String!
    phone: String!
  }

  type Query {
    findUniqueWorker(where: WorkerWhereUniqueInput!): Worker
    findFirstWorker(
      where: WorkerWhereInput
      orderBy: [WorkerOrderByWithRelationInput]
      cursor: WorkerWhereUniqueInput
      take: Int
      skip: Int
      distinct: [WorkerScalarFieldEnum]
    ): Worker
    findManyWorker(
      where: WorkerWhereInput
      orderBy: [WorkerOrderByWithRelationInput]
      cursor: WorkerWhereUniqueInput
      take: Int
      skip: Int
      distinct: [WorkerScalarFieldEnum]
    ): [Worker!]
    findManyWorkerCount(
      where: WorkerWhereInput
      orderBy: [WorkerOrderByWithRelationInput]
      cursor: WorkerWhereUniqueInput
      take: Int
      skip: Int
      distinct: [WorkerScalarFieldEnum]
    ): Int!
    aggregateWorker(
      where: WorkerWhereInput
      orderBy: [WorkerOrderByWithRelationInput]
      cursor: WorkerWhereUniqueInput
      take: Int
      skip: Int
    ): AggregateWorker
  }

  type Mutation {
    createOneWorker(data: WorkerCreateInput!): Worker!
    updateOneWorker(
      data: WorkerUpdateInput!
      where: WorkerWhereUniqueInput!
    ): Worker!
    deleteOneWorker(where: WorkerWhereUniqueInput!): Worker
    upsertOneWorker(
      where: WorkerWhereUniqueInput!
      create: WorkerCreateInput!
      update: WorkerUpdateInput!
    ): Worker
    deleteManyWorker(where: WorkerWhereInput): BatchPayload
    updateManyWorker(
      data: WorkerUpdateManyMutationInput!
      where: WorkerWhereInput
    ): BatchPayload
  }
`

module.exports = {
  Worker,
}
