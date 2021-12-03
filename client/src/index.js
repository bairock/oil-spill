import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import locale from 'antd/es/locale/ru_RU'
import { ConfigProvider } from 'antd'
import 'antd/dist/antd.css'
import { ApolloProvider } from '@apollo/client'

import {
    GlobalStyle,
    Layout
} from './components'
import apolloClient from './utils/apollo'

import Home from './pages/home'
import Login from './pages/login'
import Map from './pages/map'

const App = () => {
    return (
        <ApolloProvider client={apolloClient} >
            <ConfigProvider locale={locale}>
                <Router>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <Login />
                            }
                        />
                        <Route
                            path="/"
                            exact
                            element={
                                <Layout>
                                    <Home />
                                </Layout>
                            }
                        />
                        <Route
                            path="/map"
                            exact
                            element={
                                <Layout>
                                    <Map />
                                </Layout>
                            }
                        />
                    </Routes>
                </Router>
                <GlobalStyle />
            </ConfigProvider>
        </ApolloProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
