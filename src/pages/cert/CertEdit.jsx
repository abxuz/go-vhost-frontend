import React from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { AppNavCtx } from '@/ctx.js'
import { Link, useNavigate, useMatch } from "react-router-dom";
import api from "@/api";

const { TextArea } = Input;

const CertEdit = _ => {

    const [saving, setSaving] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [name, setName] = React.useState('')
    const [content, setContent] = React.useState('')

    const match = useMatch('/cert/:name')
    const navigate = useNavigate()
    const appNavCtx = React.useContext(AppNavCtx)

    const loadData = async () => {
        setLoading(true)
        let r = await api.cert.get(match.params.name)
        setLoading(false)
        if (!r) return
        setName(r.name)
        setContent(r.content)
    }

    const saveCert = async v => {
        setSaving(true)
        let r = await api.cert.mod(v)
        setSaving(false)
        if (!r) return
        message.success('保存成功')
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
        saveCert({
            name: name.trim(),
            content: content.trim()
        })
    }

    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['证书管理', '编辑证书'])
        loadData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Spin spinning={loading}>
                <Form labelCol={{ span: 2 }} wrapperCol={{ span: 7 }}>
                    <Form.Item label="文件名" required>
                        <Input value={name} disabled />
                    </Form.Item>
                    <Form.Item label="证书内容" required>
                        <TextArea
                            value={content}
                            rows={8}
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
                            loading={saving}>
                            保存
                        </Button>
                        <Link to={-1}>
                            <Button style={{ marginLeft: '10px' }}>取消</Button>
                        </Link>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}

export default CertEdit