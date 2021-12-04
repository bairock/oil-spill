import { DatePicker, Form as AntForm, Input, Upload, Select, Button, message } from 'antd'
import { useState } from 'react'
import styled from 'styled-components'
import { Top } from '../components'
import { useMutation, useQuery } from '@apollo/client'

import { FIND_MANY_TARGET, CREATE_ONE_IMAGE } from '../gqls'

const Form = styled(AntForm)`
    max-width: 400px;
`

const Add = () => {

    const [form] = Form.useForm()
    const [image, setImage] = useState("")

    const { data, loading } = useQuery(FIND_MANY_TARGET)

    const [create, { loading: createLoading }] = useMutation(CREATE_ONE_IMAGE, {
        onCompleted: () => {
            message.success("Данные отправлены")
            setImage("")
            form.resetFields()
        },
        onError: e => {
            message.error("Что то пошло не так, повторите попытку позже")
        }
    })

    const handleSubmitForm = ({ a, b, c, d, target, date, ...data }) => {
        create({
            variables: {
                data: {
                    date,
                    name: image,
                    cornerCoordinates: {
                        1: [parseFloat(a.replace(/ /g, '').split(",")[0]), parseFloat(a.replace(/ /g, '').split(",")[1])],
                        2: [parseFloat(b.replace(/ /g, '').split(",")[0]), parseFloat(b.replace(/ /g, '').split(",")[1])],
                        3: [parseFloat(c.replace(/ /g, '').split(",")[0]), parseFloat(c.replace(/ /g, '').split(",")[1])],
                        4: [parseFloat(d.replace(/ /g, '').split(",")[0]), parseFloat(d.replace(/ /g, '').split(",")[1])],
                    },
                    target: {
                        connect: { id: target }
                    }
                }
            }
        })
    }

    const onChange = ({ file }) => {
        if (file.status === "done") {
            setImage(file.response.filename)
        }
    }

    const targets = data ? data.findManyTarget : []


    return (
        <>
            <Top
                title="Отправка собственного изображения"
            />
            <Form form={form} onFinish={handleSubmitForm} layout="vertical" name="add">
                <Form.Item
                    name="image"
                    required
                    label="Изображение"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Upload
                        name="image"
                        listType="picture-card"
                        action="/api/image"
                        onChange={onChange}
                        onRemove={() => setImage("")}
                    >
                        {
                            !image ? "Выбрать изображение" : null
                        }
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="date"
                    required
                    label="Дата и время"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <DatePicker
                        name="date"
                        showTime
                    />
                </Form.Item>
                <Form.Item
                    name="a"
                    required
                    label="Координы угла А"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Input
                        name="cornerCoordinates"
                        showTime
                        placeholder="72.964411,60.50716"
                    />
                </Form.Item>
                <Form.Item
                    name="b"
                    required
                    label="Координы угла Б"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Input
                        name="cornerCoordinates"
                        showTime
                        placeholder="72.964411,60.50716"
                    />
                </Form.Item>
                <Form.Item
                    name="c"
                    required
                    label="Координы угла В"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Input
                        name="cornerCoordinates"
                        showTime
                        placeholder="72.964411,60.50716"
                    />
                </Form.Item>
                <Form.Item
                    name="d"
                    required
                    label="Координы угла Г"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Input
                        name="cornerCoordinates"
                        showTime
                        placeholder="72.964411,60.50716"
                    />
                </Form.Item>
                <Form.Item
                    name="target"
                    required
                    label="Местность"
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Select
                        loading={loading}
                        placeholder="Выберите местность"
                    >
                        {
                            targets.map(item => (
                                <Select.Option key={item.name} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={createLoading}
                >
                    Создать
                </Button>
            </Form>
        </>
    )
}

export default Add