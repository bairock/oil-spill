import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Form, Card as AntCard, Input, Button as AntButton, message, Spin } from 'antd'
import { useMutation } from '@apollo/client'
// import { Link } from 'react-router-dom'

import { LoadingView } from '../components'
import { LOGIN_USER } from '../gqls'
import { useUser } from '../utils/hooks'
import { Navigate } from 'react-router'

const requiredRule = {
    required: true,
    message: 'Обязательное поле'
}

const emailRule = {
    type: 'email',
    message: 'Введите правильный электронный адрес'
}

export const Login = () => {

    const { user, loading: userLoading } = useUser()
    const [form] = Form.useForm()

    useEffect(() => {
        form.setFieldsValue({
            login: "user@mail.ru",
            password: "qwe123qwe"
        })
    }, [])

    const [signIn, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: ({ loginUser: { token } }) => {
            localStorage.setItem('token', token)
            window.location = '/'
        },
        onError: (e) => {
            message.error('Неправильный логин или пароль')
            console.error(e)
        }
    })

    const handleSubmitForm = ({ login, password }) => {
        signIn({
            variables: {
                data: {
                    email: login,
                    password
                }
            }
        })
    }

    if (userLoading) {
        <LoadingView>
            <Spin />
        </LoadingView>
    }

    if (user) {
        return <Navigate to={`/`} />
    }

    return (
        <Wrapper>
            <Card title="Вход в панель администратора">
                <Form form={form} onFinish={handleSubmitForm} layout="vertical" name="login">
                    <Form.Item
                        colon={false}
                        label="Эл. почта"
                        name="login"
                        rules={[requiredRule, emailRule]}
                    >
                        <Input placeholder="Введите электронную почту..." />
                    </Form.Item>
                    <Form.Item label="Пароль" name="password" rules={[requiredRule]}>
                        <Input.Password placeholder="Введите пароль..." />
                    </Form.Item>
                    <Actions>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Войти
                        </Button>
                        {/* <Link to={`/moderator/login`}>Войти как модератор</Link> */}
                    </Actions>
                    {/* <Link to={`/admin/forgot`}>Забыли пароль?</Link> */}
                </Form>
            </Card>
        </Wrapper>
    )
}


const Card = styled(AntCard)`
    width: 400px;

    @media only screen and (max-width: 420px) {
        width: 95%;
    }
`

const Button = styled(AntButton)``

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;

    @media only screen and (max-width: 420px) {
        justify-content: flex-start;
        padding-top: 30px;
    }
`

const Actions = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 5px;
`

export default Login
