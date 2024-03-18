import React from 'react';
import { Route, Navigate, Routes, Outlet, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, Button, Modal, message } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';

import HttpVhost from '@/pages/http/Vhost'
import HttpVhostAdd from '@/pages/http/VhostAdd';
import HttpVhostEdit from '@/pages/http/VhostEdit';
import HttpsVhost from '@/pages/https/Vhost';
import HttpsVhostAdd from '@/pages/https/VhostAdd';
import HttpsVhostEdit from '@/pages/https/VhostEdit';
import Http3Vhost from '@/pages/http3/Vhost';
import Http3VhostAdd from '@/pages/http3/VhostAdd';
import Http3VhostEdit from '@/pages/http3/VhostEdit';
import Cert from '@/pages/cert/Cert'
import CertAdd from '@/pages/cert/CertAdd'
import CertEdit from '@/pages/cert/CertEdit'
import SystemEdit from '@/pages/system/SystemEdit'

import { AppNavCtx } from '@/ctx.js'
import api from '@/api.js'

import './App.css';

const App = _ => {

    const navigate = useNavigate()
    const menuItems = [
        { key: 'http', label: 'HTTP映射' },
        { key: 'https', label: 'HTTPS映射' },
        { key: 'http3', label: 'HTTP3映射' },
        { key: 'cert', label: '证书管理' },
        { key: 'system', label: '系统设置' },
    ]

    const [breadcrumb, setBreadcrumb] = React.useState([])
    const breadcrumbItems = ['首页'].concat(breadcrumb).map(v => ({ title: v }))

    const menuItemClick = (v) => {
        switch (v.key) {
            case 'http':
                navigate('http')
                break
            case 'https':
                navigate('https')
                break
            case 'http3':
                navigate('http3')
                break
            case 'cert':
                navigate('cert')
                break
            case 'system':
                navigate('system')
                break
            default:
        }
    }

    const confirmSave = () => {
        const save = async () => {
            let r = await api.save()
            if (!r) return
            message.success('保存成功')
        }
        Modal.confirm({
            title: '危险操作',
            content: '确定要保存配置？',
            onOk: save
        })
    }

    const confirmReload = () => {
        const reload = async () => {
            let r = await api.reload()
            if (!r) return
            message.success('重载配置成功')
        }
        Modal.confirm({
            title: '危险操作',
            content: '确定要重载配置？',
            onOk: reload
        })
    }

    return (
        <Layout style={{ height: '100%' }}>
            <Header>
                <div id='nav-logo'>Web映射管理系统</div>
                <Menu
                    id='nav-menu'
                    selectable={false}
                    theme='dark'
                    mode='horizontal'
                    items={menuItems}
                    onClick={menuItemClick} />
                <div id='nav-op'>
                    <Button
                        type='primary'
                        onClick={confirmSave}>
                        保存
                    </Button>
                    <Button
                        danger
                        type='primary'
                        onClick={confirmReload}>
                        重载
                    </Button>
                </div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                <div className="site-layout-content">
                    <AppNavCtx.Provider value={{ setBreadcrumb }}>
                        <Routes>
                            <Route path='http' element={<Outlet />}>
                                <Route path='' element={<HttpVhost />} />
                                <Route path='add' element={<HttpVhostAdd />} />
                                <Route path=':domain' element={<HttpVhostEdit />} />
                            </Route>
                            <Route path='https' element={<Outlet />}>
                                <Route path='' element={<HttpsVhost />} />
                                <Route path='add' element={<HttpsVhostAdd />} />
                                <Route path=':domain' element={<HttpsVhostEdit />} />
                            </Route>
                            <Route path='http3' element={<Outlet />}>
                                <Route path='' element={<Http3Vhost />} />
                                <Route path='add' element={<Http3VhostAdd />} />
                                <Route path=':domain' element={<Http3VhostEdit />} />
                            </Route>
                            <Route path='cert' element={<Outlet />}>
                                <Route path='' element={<Cert />} />
                                <Route path='add' element={<CertAdd />} />
                                <Route path=':name' element={<CertEdit />} />
                            </Route>
                            <Route path='system' element={<SystemEdit />} />
                            <Route path='/' element={<Navigate to='http' />} />
                            <Route path='*' element={<Navigate to='404' replace />} />
                        </Routes>
                    </AppNavCtx.Provider>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                doubi.fun ©2023-2024
            </Footer>
        </Layout>
    );
}

export default App;
