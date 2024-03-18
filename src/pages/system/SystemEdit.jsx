
import React from 'react'
import { Button, Form, Input, message, Spin, Col, Row, Card } from "antd";
import { AppNavCtx } from '@/ctx.js'
import api from '@/api.js'

const { TextArea } = Input;

const SystemEdit = props => {

    const [apiLoading, setApiLoading] = React.useState(false)
    const [apiSaving, setApiSaving] = React.useState(false)
    const [apiListen, setApiListen] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const loadApiConfig = async () => {
        setApiLoading(true)
        let data = await api.api.getConfig()
        setApiLoading(false)
        if (!data) return;
        data.listen && setApiListen(data.listen.join("\n"));
        if (data.auth) {
            data.auth.username && setUsername(data.auth.username);
            data.auth.password && setPassword(data.auth.password);
        }
    }

    const saveApiConfig = async () => {
        let v = {
            listen: [],
            auth: null,
        }
        if (username !== '' || password !== '') {
            v.auth = {
                username: username,
                password: password,
            }
        }

        apiListen.split("\n").forEach(l => {
            l = l.trim()
            if (l !== '') {
                v.listen.push(l)
            }
        })

        setApiSaving(true)
        let r = await api.api.setConfig(v)
        setApiSaving(false)
        if (!r) return
        message.success('管理平台配置保存成功')
        loadApiConfig()
    }

    const [vhostLoading, setVhostLoading] = React.useState(false)
    const [vhostSaving, setVhostSaving] = React.useState(false)
    const [httpListen, setHttpListen] = React.useState('')
    const [httpsListen, setHttpsListen] = React.useState('')
    const [http3Listen, setHttp3Listen] = React.useState('')
    const loadVhostListen = async () => {
        setVhostLoading(true)
        let data = await api.vhost.getListen();
        setVhostLoading(false)
        if (!data) return
        data.http  && setHttpListen(data.http.join("\n"));
        data.https && setHttpsListen(data.https.join("\n"));
        data.http3 && setHttp3Listen(data.http3.join("\n"));
    }

    const saveVhostListen = async () => {
        const v = {
            http: [],
            https: [],
            http3: []
        }

        httpListen.split("\n").forEach(l => {
            l = l.trim()
            if (l !== '') {
                v.http.push(l)
            }
        })

        httpsListen.split("\n").forEach(l => {
            l = l.trim()
            if (l !== '') {
                v.https.push(l)
            }
        })

        http3Listen.split("\n").forEach(l => {
            l = l.trim()
            if (l !== '') {
                v.http3.push(l)
            }
        })

        setVhostSaving(true)
        let r = await api.vhost.setListen(v)
        setVhostSaving(false)
        if (!r) return
        message.success('映射配置保存成功')
        loadVhostListen()
    }

    const appNavCtx = React.useContext(AppNavCtx)
    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['系统设置'])
        loadApiConfig()
        loadVhostListen()
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="管理平台配置" bordered={true}>
                        <Spin spinning={apiLoading}>
                            <Form labelCol={{ span: 4 }}>
                                <Form.Item label="监听地址">
                                    <TextArea
                                        value={apiListen}
                                        autoSize
                                        onChange={e => setApiListen(e.target.value)}
                                        placeholder="一行一个、留空关闭"
                                    />
                                </Form.Item>
                                <Form.Item label="用户名">
                                    <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="" />
                                </Form.Item>
                                <Form.Item label="密码">
                                    <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="" />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" loading={apiSaving} onClick={() => { saveApiConfig() }}>保存</Button>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="映射配置" bordered={true}>
                        <Spin spinning={vhostLoading}>
                            <Form labelCol={{ span: 8 }}>
                                <Form.Item label="HTTP监听地址">
                                    <TextArea
                                        value={httpListen}
                                        autoSize
                                        onChange={e => setHttpListen(e.target.value)}
                                        placeholder="一行一个、留空关闭"
                                    />
                                </Form.Item>
                                <Form.Item label="HTTPS监听地址">
                                    <TextArea
                                        value={httpsListen}
                                        autoSize
                                        onChange={e => setHttpsListen(e.target.value)}
                                        placeholder="一行一个、留空关闭"
                                    />
                                </Form.Item>
                                <Form.Item label="HTTP3监听地址">
                                    <TextArea
                                        value={http3Listen}
                                        autoSize
                                        onChange={e => setHttp3Listen(e.target.value)}
                                        placeholder="一行一个、留空关闭"
                                    />
                                </Form.Item>
                                <Form.Item style={{ float: 'right' }}>
                                    <Button type="primary" loading={vhostSaving} onClick={() => { saveVhostListen() }}>保存</Button>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </Card>
                </Col>
            </Row>
        </div >
    )
}

export default SystemEdit