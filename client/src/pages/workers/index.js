import { useState } from 'react'
import { Button, Input, message, Modal, Form } from 'antd'
import { useMutation } from '@apollo/client'

import { Top } from "../../components"
import WorkersContainer, { variables as listVariables } from '../../containers/Workers'

import { CREATE_ONE_WORKER, FIND_MANY_WORKER } from '../../gqls'

const Workers = () => {
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm()

    const [create, { loading }] = useMutation(CREATE_ONE_WORKER, {
        onCompleted: () => {
            message.success("Сотрудник добавлен")
            setVisible(false)
        },
        onError: e => {
            console.error(e)
            message.error("Что то пошло не так, повторите попытку позже")
            setVisible(false)
        },
        update: (client, { data: { createOneWorker } }) => {
            const prevData = client.readQuery({
                query: FIND_MANY_WORKER,
                variables: listVariables
            })
            if (prevData) {
                const { findManyWorker, findManyWorkerCount } = prevData
                client.writeQuery({
                    query: FIND_MANY_WORKER,
                    variables: listVariables,
                    data: {
                        findManyWorker: [createOneWorker, ...findManyWorker],
                        findManyWorkerCount: findManyWorkerCount + 1
                    }
                })
            }
        }
    })

    const handleOk = ({ ...data }) => {
        create({
            variables: { data }
        })
    }

    const handleCancel = () => {
        setVisible(false)
    }

    return (
        <>
            <Top
                title="Список сотрудников"
                action={
                    <Button onClick={() => { setVisible(true) }} type="link">
                        Добавить сотрудника
                    </Button>
                }
            />
            <WorkersContainer />
            <Modal
                title="Добавление сотрудника"
                visible={visible}
                confirmLoading={loading}
                onCancel={handleCancel}
                footer={[
                    <Button
                        form={'add-worker'}
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                    >
                        Создать
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    onFinish={handleOk}
                    layout="vertical"
                    name="add-worker"
                >
                    <Form.Item
                        name="name"
                        label="ФИО"
                        required
                        rules={[{ required: true, message: "Обязательное поле" }]}
                    >
                        <Input
                            name="name"
                            placeholder="Введите ФИО"
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Адрес электронной почты"
                        required
                        rules={[{ required: true, message: "Обязательное поле" }]}
                    >
                        <Input
                            placeholder="Введите email"
                        />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Номер телефона"
                        required
                        rules={[{ required: true, message: "Обязательное поле" }]}
                    >
                        <Input
                            placeholder="Ведите номер телефона"
                        />
                    </Form.Item>
                    <Form.Item
                        name="position"
                        label="Должность"
                        required
                        rules={[{ required: true, message: "Обязательное поле" }]}
                    >
                        <Input
                            placeholder="Введите должность"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Workers