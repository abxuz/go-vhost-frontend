import React from "react";
import { Link } from "react-router-dom";
import { Button, Table, Tag, Modal, Spin, message } from "antd";
import { AppNavCtx } from '@/ctx.js'
import api from '@/api.js'
import './Cert.css'

const { Column } = Table;

const Cert = props => {

    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const appNavCtx = React.useContext(AppNavCtx)

    const loadData = async () => {
        setLoading(true)
        let r = await api.cert.gets()
        setLoading(false)
        if (!r) return
        setData(r)
    }

    const confirmDelete = (v) => {
        const doDelete = async () => {
            let r = await api.cert.del(v.name)
            if (!r) return
            message.success('删除成功')
            await loadData()
        }

        Modal.confirm({
            title: '危险操作',
            content: '确定要删除该证书？',
            onOk: doDelete
        })
    }

    React.useEffect(() => {
        appNavCtx.setBreadcrumb(['证书管理'])
        loadData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="op-btns">
                <Link to="add">
                    <Button type="primary">添加证书</Button>
                </Link>
            </div>
            <Spin spinning={loading}>
                <Table dataSource={data} rowKey={r => r.name}>
                    <Column title="证书名" dataIndex="name" key="name" />
                    <Column title="域名" key="domain" render={(_, v) => v.domain.map(d => (
                        <Tag key={d}>{d}</Tag>
                    ))} />
                    <Column title="发行机构" dataIndex="issuer" key="issuer" />
                    <Column title="有效期开始" dataIndex="valid_start" key="valid_start" />
                    <Column title="有效期结束" dataIndex="valid_stop" key="valid_stop" />
                    <Column title="操作" key="op" width="150px" render={(_, v) => (
                        <div className="table-op">
                            <Link to={'/cert/' + encodeURIComponent(v.name)}>
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
export default Cert;