import { useState } from 'react'
import {
    Table,
    Popconfirm,
    message
} from 'antd'
import { DeleteFilled, LoadingOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'

import { DELETE_ONE_WORKER, FIND_MANY_WORKER } from '../gqls'

const limit = 50

const WorkersContainer = () => {
    const [currentPage, setCurrentPage] = useState(1)

    const [deleteWorker, { loading: deleteLoading }] = useMutation(DELETE_ONE_WORKER, {
        onCompleted: () => {
            message.success("Сотрудник удалён")
        },
        onError: e => {
            message.error("Что то пошло не так, повторите попытку позже")
        }
    })

    const { data, loading } = useQuery(FIND_MANY_WORKER, {
        variables: {
            take: limit,
            skip: (currentPage - 1) * limit,
            orderBy: [{ createdAt: 'desc' }],
        }
    })

    const workers = data ? data.findManyWorker : []
    const workersCount = data ? data.findManyWorkerCount : 0

    const handleChangeTable = ({ current }) => {
        setCurrentPage(current)
    }

    return (
        <Table
            loading={loading}
            rowKey={(obj) => obj.id}
            dataSource={workers}
            scroll={{ x: 600 }}
            size={window.innerWidth < 500 ? 'small' : 'large'}
            pagination={{
                current: currentPage,
                total: workersCount,
                pageSize: limit
            }}
            onChange={handleChangeTable}
            columns={[
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                },
                {
                    title: 'ФИО',
                    dataIndex: 'name',
                    key: 'name'
                },
                {
                    title: 'Номер телефона',
                    dataIndex: 'phone',
                    key: 'phone'
                },
                {
                    title: 'Должность',
                    dataIndex: 'position',
                    key: 'position'
                },
                {
                    title: "Действия",
                    dataIndex: 'delete',
                    key: 'delete',
                    align: "right",
                    render: (_, obj) => (
                        <>
                            <Popconfirm
                                title={"Удалить адрес"}
                                onConfirm={() => {
                                    deleteWorker({
                                        variables: {
                                            where: { id: obj.id }
                                        }
                                    })
                                }}
                                okText="Да"
                                cancelText="Нет"
                                disabled={deleteLoading}
                            >
                                {
                                    deleteLoading ? <LoadingOutlined /> : <DeleteFilled className="delete-button" />
                                }
                            </Popconfirm>
                        </>
                    )
                }
            ]}
        />
    )
}

export default WorkersContainer