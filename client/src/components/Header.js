import styled from 'styled-components'
import { Layout, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'

const { Header: AntHeader } = Layout

const HeaderContainer = styled(AntHeader)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    padding-left: 0;
    background: #fff;
`

export const Header = ({ user }) => {
    const handleLogout = () => {
        localStorage.clear()
        window.location.href = '/'
    }

    return (
        <HeaderContainer>
        
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
                Выйти
            </Button>
        </HeaderContainer>
    )
}