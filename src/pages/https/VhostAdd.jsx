import React from "react";
import { Button, Form, Input, Select, message } from "antd";
import MappingItem from "@/component/MappingItem";
import { AppNavCtx } from '@/ctx.js'
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";

const { Option } = Select;

const VhostAdd = _ => {

    const defaultMapping = () => ({
        path: '/',
        target: '',
        add_header: [],
        basci_auth: [],
        proxy_header: true,
        redirect: false
    })

    const [loading, setLoading] = React.useState(false)
    const [name, setName] = React.useState('')
    const [domain, setDomain] = React.useState('')
    const [mapping, setMapping] = React.useState([defaultMapping()])
    const [cert, setCert] = React.useState('')
    const navigate = useNavigate()
    const appNavCtx = React.useContext(AppNavCtx)

    const [certLoading, setCertLoading] = React.useState(false)
    const [certList, setCertList] = React.useState([])
    const loadCert = async () => {
        setCertLoading(true)
        let r = await api.cert.gets()
        setCertLoading(false)
        if (!r) return
        setCertList(r)
    }

    const addMapping = i => {
        setMapping(prev => [
            ...prev.slice(0, i + 1),
            defaultMapping(),
            ...prev.slice(i + 1)
        ])
    }
    const delMapping = i => {
        setMapping(prev => {
            let m = [...prev]
            m.splice(i, 1)
            return m
        })
    }
    const modMapping = (i, v) => {
        setMapping(prev => {
            let m = [...prev]
            m[i] = v
            return m
        })
    }

    const moveMapping = (i1, i2) => {
        setMapping(prev => {
            let m = [...prev]
            let x = m[i1]
            m[i1] = m[i2]
            m[i2] = x
            return m
        })
    }

    const addVhost = async v => {
        setLoading(true)
        let r = await api.https.add(v)
        setLoading(false)
        if (!r) return
        message.success('添加成功')
        navigate(-1)
    }

    const onSubmit = () => {
        if (name.trim() === '') {
            message.error('项目名不能为空')
            return
        }
        if (domain.trim() === '') {
            message.error('映射域名不能为空')
            return
        }

        if (cert.trim() === '') {
            message.error('证书不能为空')
            return
        }

        let pathMap = new Map();
        for (let m of mapping) {
            let path = m.path.trim()
            if (path === '') {
                message.error('映射目标的路径不能为空')
                return
            }
            if (path.charAt(0) !== '/') {
                message.error('映射目标的路径需要以/开头')
                return
            }
            if (pathMap.has(path)) {
                message.error('映射目标的路径存在重复')
                return
            }
            const targetExp = new RegExp('^(http://|https://|http3://).+$')
            if (!m.target.match(targetExp)) {
                message.error('映射目标的目标需要以http://、https://、http3://开头')
                return
            }
            pathMap.set(path, m)
        }

        addVhost({
            name: name.trim(),
            domain: domain.trim(),
            mapping: mapping,
            cert: cert.trim()
        })
    }

    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['HTTPS映射', '添加映射'])
        loadCert()
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 7 }}>
                <Form.Item label="项目名" required>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                </Form.Item>
                <Form.Item label="映射域名" required>
                    <Input
                        addonBefore="https://"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="证书" required>
                    <Select loading={certLoading} value={cert} onChange={v => { setCert(v) }}>
                        {certList.map(v => (
                            <Option
                                key={v.name}
                                value={v.name}>
                                {v.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="映射目标" wrapperCol={{ span: 24 }} required>
                    {mapping.map((v, i) => (
                        <MappingItem
                            key={i}
                            value={v}
                            onRemoveClick={() => delMapping(i)}
                            onAddClick={() => addMapping(i)}
                            onUpClick={() => moveMapping(i, i - 1)}
                            onDownClick={() => moveMapping(i, i + 1)}
                            onChange={v => modMapping(i, v)}
                            showRemoveBtn={mapping.length > 1}
                            showUpBtn={i > 0}
                            showDownBtn={i < mapping.length - 1}
                        />
                    ))}
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2, span: 24 }}>
                    <Button type="primary" onClick={onSubmit} loading={loading}>添加</Button>
                    <Link to={-1}>
                        <Button style={{ marginLeft: '10px' }}>取消</Button>
                    </Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default VhostAdd