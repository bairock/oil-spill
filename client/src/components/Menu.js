import React from 'react'
import { Link } from 'react-router-dom'
import { Menu as AntMenu } from 'antd'

export const Menu = () => {
    const { pathname } = window.location

    return (
        <AntMenu theme="dark" mode="inline" defaultSelectedKeys={[pathname]}>
            <AntMenu.Item style={{ marginTop: 10 }} key={`/`}>
                <Link to={`/`}>Главная</Link>
            </AntMenu.Item>
            <AntMenu.Item key={`/map`}>
                <Link to={`/map`}>Карта</Link>
            </AntMenu.Item>
            <AntMenu.Item key={`/workers`}>
                <Link to={`/workers`}>Сотрудники</Link>
            </AntMenu.Item>
            <AntMenu.Item key={`/add`}>
                <Link to={`/add`}>API</Link>
            </AntMenu.Item>
        </AntMenu>
    )
}
