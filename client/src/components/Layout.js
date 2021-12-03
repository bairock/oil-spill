import styled from 'styled-components'
import { Spin, Layout as AntLayout } from 'antd'
import { Navigate } from 'react-router-dom'

import {
    Header,
    Menu
} from '.'

import { useUser } from '../utils/hooks'

const { Content: AntContent, Footer: AntFooter, Sider: AntSider } = AntLayout

export const Layout = ({ children, ...props }) => {
    const { user, loading, error } = useUser()

    if (loading) {
        return (
            <LoadingView>
                <Spin />
            </LoadingView>
        )
    }

    if (error || !user) {
        return <Navigate to={`/login`} />
    }

    return (
        <Provider>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div className="logo">
                    Панель управления
                </div>
                <Menu />
            </Sider>
            <AntLayout>
                <Header
                    user={user}
                    {...props}
                />
                <Content>
                    <div className="inside">{children}</div>
                </Content>
                <Footer>
                    {`Панель администратора`}
                </Footer>
            </AntLayout>
        </Provider>
    )
}

export const LoadingView = styled.div`
    background: whitesmoke;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Content = styled(AntContent)`
    margin: 20px 20px 0;

    @media only screen and (max-width: 480px) {
        margin: 10px 0;
    }

    .inside {
        padding: 18px 22px;
        background: #fff;
        min-height: 100%;

        @media only screen and (max-width: 480px) {
            padding: 20px 14px;
        }
    }
`

const Footer = styled(AntFooter)`
    text-align: center;
`

const Provider = styled(AntLayout)`
    min-height: 100vh;

    .logo {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        background: whitesmoke;
        cursor: pointer;
        transition: 0.3s background;
        
        img {
            width: 60%;
        }
    }

    .ant-layout-sider-zero-width-trigger {
        top: 11px;
    }
`

const Sider = styled(AntSider)`
    z-index: 3;

    @media only screen and (max-width: 992px) {
        position: absolute;
        height: 100%;
    }
`