import React from "react";
import { Button, Form, Input, message } from "antd";
import { AppNavCtx } from '@/ctx.js'
import { Link, useNavigate } from "react-router-dom";
import api from "@/api";

const { TextArea } = Input;

const CertAdd = props => {

    const [loading, setLoading] = React.useState(false)
    const [name, setName] = React.useState('')
    const [content, setContent] = React.useState('')

    const navigate = useNavigate()
    const appNavCtx = React.useContext(AppNavCtx)

    const addCert = async v => {
        setLoading(true)
        let r = await api.cert.add(v)
        setLoading(false)
        if (!r) return
        message.success('添加成功')
        navigate(-1)
    }

    const onSubmit = () => {
        if (name.trim() === '') {
            message.error('证书名不能为空')
            return
        }

        if (content.trim() === '') {
            message.error('证书内容不能为空')
            return
        }

        addCert({
            name: name.trim(),
            content: content.trim()
        })
    }

    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['证书管理', '添加证书'])
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 7 }}>
                <Form.Item label="证书名" required>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)} />
                </Form.Item>
                <Form.Item label="证书内容" required>
                    <TextArea
                        value={content}
                        autoSize={{
                            minRows: 8,
                            maxRows: 16,
                        }}
                        onChange={e => setContent(e.target.value)}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2, span: 24 }}>
                    <Button
                        type="primary"
                        onClick={onSubmit}
                        loading={loading}>
                        添加
                    </Button>
                    <Link to={-1}>
                        <Button style={{ marginLeft: '10px' }}>取消</Button>
                    </Link>
                </Form.Item>
            </Form>
        </div>
    )
}

export default CertAdd