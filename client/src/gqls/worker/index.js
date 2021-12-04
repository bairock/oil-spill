import { gql } from "@apollo/client"

export const FIND_UNIQUE_WORKER = gql`
	query(
		$where: WorkerWhereUniqueInput!
	){
		findUniqueWorker(
			where: $where
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`
export const FIND_FIRST_WORKER = gql`
	query(
		$where: WorkerWhereInput
		$orderBy: [WorkerOrderByWithRelationInput]
		$cursor: WorkerWhereUniqueInput
		$take: Int
		$skip: Int
		$distinct: [WorkerScalarFieldEnum]
	){
		findFirstWorker(
			where: $where
			orderBy: $orderBy
			cursor: $cursor
			take: $take
			skip: $skip
			distinct: $distinct
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`
export const FIND_MANY_WORKER = gql`
	query(
		$where: WorkerWhereInput
		$orderBy: [WorkerOrderByWithRelationInput]
		$cursor: WorkerWhereUniqueInput
		$take: Int
		$skip: Int
		$distinct: [WorkerScalarFieldEnum]
	){
		findManyWorker(
			where: $where
			orderBy: $orderBy
			cursor: $cursor
			take: $take
			skip: $skip
			distinct: $distinct
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
		findManyWorkerCount(
			where: $where
			orderBy: $orderBy
			cursor: $cursor
			take: $take
			skip: $skip
			distinct: $distinct
		)
	}
`
export const CREATE_ONE_WORKER = gql`
	mutation(
		$data: WorkerCreateInput!
	){
		createOneWorker(
			data: $data
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`
export const UPDATE_ONE_WORKER = gql`
	mutation(
		$data: WorkerUpdateInput!
		$where: WorkerWhereUniqueInput!
	){
		updateOneWorker(
			data: $data
			where: $where
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`
export const DELETE_ONE_WORKER = gql`
	mutation(
		$where: WorkerWhereUniqueInput!
	){
		deleteOneWorker(
			where: $where
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`
export const UPSERT_ONE_WORKER = gql`
	mutation(
		$where: WorkerWhereUniqueInput!
		$create: WorkerCreateInput!
		$update: WorkerUpdateInput!
	){
		upsertOneWorker(
			where: $where
			create: $create
			update: $update
		){
			id
			createdAt
			updatedAt
			email
			name
			position
			phone
		}
	}
`