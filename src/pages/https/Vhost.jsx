import React from "react";
import { Link } from "react-router-dom";
import { Button, Table, Tag, Modal, Spin, message } from "antd";
import { AppNavCtx } from '@/ctx.js'
import api from '@/api.js'
import './Vhost.css'

const { Column } = Table;

const Vhost = props => {

    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const appNavCtx = React.useContext(AppNavCtx)

    const loadData = async () => {
        setLoading(true)
        let r = await api.https.gets()
        setLoading(false)
        if (!r) return;
        setData(r)
    }

    const confirmDelete = (v) => {
        const doDelete = async () => {
            let r = await api.https.del(v.domain)
            if (!r) return
            message.success('删除成功')
            await loadData()
        }

        Modal.confirm({
            title: '危险操作',
            content: '确定要删除该映射？',
            onOk: doDelete
        })
    }

    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['HTTPS映射'])
        loadData()
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="op-btns">
                <Link to="add">
                    <Button type="primary">添加映射</Button>
                </Link>
            </div>
            <Spin spinning={loading}>
                <Table dataSource={data} rowKey={r => r.domain}>
                    <Column title="项目名" dataIndex="name" key="name" />
                    <Column title="映射域名" key="domain" render={(_, v) => (
                        <a href={'https://' + v.domain} target="_blank" rel="noreferrer">{'https://' + v.domain}</a>
                    )} />
                    <Column title="映射目标" key="mapping" render={(_, v) => v.mapping.map(m => (
                        <div key={m.path} className="proxy-item">
                            <Tag color="magenta">{m.path}</Tag>
                            <span> =&gt; </span>
                            <Tag color="blue">
                                <a href={m.target} target="_blank" rel="noreferrer">{m.target}</a>
                            </Tag>
                            <Tag color="green" style={{ display: m.proxy_header ? '' : 'none' }}>代理头</Tag>
                            <Tag color="orange" style={{ display: m.redirect ? '' : 'none' }}>重定向</Tag>
                        </div>
                    ))} />
                    <Column title="证书" key="cert" render={(_, v) => (
                        <div><Tag>{v.cert}</Tag> </div>
                    )} />
                    <Column title="操作" key="op" width="150px" render={(_, v) => (
                        <div className="table-op">
                            <Link to={'/https/' + encodeURIComponent(v.domain)}>
                                <Button type="primary" size="small">编辑</Button>
                            </Link>
                            <Button danger size="small"
                                onClick={(_) => confirmDelete(v)}>
                                删除
                            </Button>
                        </div>
                    )} />
                </Table>
            </Spin>
        </div>
    )
}
export default Vhost;