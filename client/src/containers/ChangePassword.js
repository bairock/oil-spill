import styled from 'styled-components'
import { Input, Form, Button as AntButton, message } from 'antd'
// import { useMutation } from '@apollo/client'

// import { CHANGE_PASSWORD_ADMIN } from '../gqls/admin'

const Button = styled(AntButton)``

const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 400px;

    .change-pass-lable {
        font-size: 14px;
        color: gray;
        margin-bottom: 15px;
    }
`

const requiredRule = {
    required: true,
    message: 'Обязательное поле'
}

const ChangePassword = () => {
    const [form] = Form.useForm()

    const loading = false

    // const [change, { loading }] = useMutation(CHANGE_PASSWORD_ADMIN, {
    //     onCompleted: () => {
    //         message.success("Пароль успешно изменён")
    //         form.resetFields()
    //     },
    //     onError: e => {
    //         message.error("Что то пошло не так, повторите попытку позже")
    //     }
    // })

    const handleSubmitForm = ({ password, confirmPassword }) => {
        if (password !== confirmPassword) {
            message.error('Подтвердите пароль')
        }
        // change({
        //     variables: {
        //         data: {
        //             password: password,
        //             confirmPassword: confirmPassword
        //         }
        //     }
        // })
    }

    return (
        <>
            <Container>
                <span className="change-pass-lable">Изменение пароля для входа</span>
                <Form
                    form={form}
                    onFinish={handleSubmitForm}
                    layout="vertical"
                    name="change_password"
                >
                    <Form.Item name="password" rules={[requiredRule]}>
                        <Input.Password placeholder="Введите новый пароль" />
                    </Form.Item>
                    <Form.Item name="confirmPassword" rules={[requiredRule]}>
                        <Input.Password placeholder="Введите новый пароль еще раз" />
                    </Form.Item>
                    <Button disabled={loading} type="primary" htmlType="submit">
                        Измененить
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default ChangePassword
