import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Menu as AntMenu } from 'antd'

export const Menu = () => {
    const { pathname } = window.location

    return (
        <AntMenu theme="dark" mode="inline" defaultSelectedKeys={[pathname]}>
            <AntMenu.Item style={{ marginTop: 0 }} key={`/`}>
                <Link to={`/`}>
                    Главная
                </Link>
            </AntMenu.Item>
            <AntMenu.Item key={`/map`}>
                <Link to={`/map`}>
                    Карта
                </Link>
            </AntMenu.Item>
        </AntMenu>
    )
}

const MenuLink = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
        color: white;
    }
`
