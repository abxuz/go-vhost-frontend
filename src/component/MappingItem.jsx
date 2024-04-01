import React from "react";
import { Button, Checkbox, Col, Input, Row, Modal, message } from "antd"
import { PlusOutlined, MinusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'

import './MappingItem.css'

const { TextArea } = Input;

const MappingItem = ({
    value,
    onAddClick,
    onRemoveClick,
    onUpClick,
    onDownClick,
    onChange,
    showUpBtn,
    showDownBtn,
    showRemoveBtn
}) => {

    const [showAddHeader, setShowAddHeader] = React.useState(false)
    const [addHeader, setAddHeader] = React.useState('')

    const [showBasicAuth, setShowBasicAuth] = React.useState(false)
    const [basicAuth, setBasicAuth] = React.useState('')

    const onValueChange = e => {
        if (!onChange) return
        let newValue = { ...value }
        if (e.target.name === 'proxy_header') {
            newValue.proxy_header = e.target.checked
        } else if (e.target.name === 'redirect') {
            newValue.redirect = e.target.checked
        } else {
            newValue[[e.target.name]] = e.target.value
        }
        onChange(newValue)
    }

    const addHeaderOk = () => {
        const headers = [];
        const lines = addHeader.split("\n")
        for (let line of lines) {
            line = line.trim()
            if (line === '') continue;
            const items = line.split(":")
            if (items.length < 2) {
                message.error('格式有误');
                return
            }
            headers.push(line)
        }
        if (!onChange) {
            setShowAddHeader(false);
            return
        }

        let newValue = { ...value }
        newValue.add_header = headers
        onChange(newValue)
        setShowAddHeader(false);
    }


    const basicAuthOk = () => {
        const auths = [];
        const lines = basicAuth.split("\n")
        for (let line of lines) {
            const items = line.split(":")
            if (items.length < 2) {
                message.error('格式有误');
                return
            }
            auths.push(line)
        }
        if (!onChange) {
            setShowBasicAuth(false);
            return
        }

        let newValue = { ...value }
        newValue.basic_auth = auths
        onChange(newValue)
        setShowBasicAuth(false);
    }

    return (
        <Input.Group>
            <Row gutter={8}>
                <Col span={6}>
                    <Input
                        name="path"
                        addonBefore="路径："
                        defaultValue="/"
                        value={value.path}
                        onChange={onValueChange} />
                </Col>
                <Col span={8}>
                    <Input
                        name="target"
                        addonBefore="目标："
                        value={value.target}
                        onChange={onValueChange}
                    />
                </Col>
                <Col span={6} style={{ lineHeight: 2.2 }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            setAddHeader(value.add_header.join("\n"));
                            setShowAddHeader(true);
                        }}
                    >
                        添加头部
                    </Button>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            setBasicAuth(value.basic_auth.join("\n"));
                            setShowBasicAuth(true);
                        }}
                    >
                        BasicAuth
                    </Button>
                    <Checkbox
                        name="proxy_header"
                        checked={value.proxy_header}
                        onChange={onValueChange}
                    >
                        代理头
                    </Checkbox>
                    <Checkbox
                        name="redirect"
                        checked={value.redirect}
                        onChange={onValueChange}
                    >
                        重定向
                    </Checkbox>
                </Col>
                <Col span={4}>
                    <Button
                        className="proxy-up-btn"
                        shape="circle"
                        size="small"
                        icon={<UpOutlined />}
                        style={{ display: showUpBtn ? '' : 'none' }}
                        onClick={() => { onUpClick && onUpClick() }}
                    />
                    <Button
                        className="proxy-down-btn"
                        shape="circle"
                        size="small"
                        icon={<DownOutlined />}
                        style={{ display: showDownBtn ? '' : 'none' }}
                        onClick={() => { onDownClick && onDownClick() }}
                    />
                    <Button
                        className="proxy-add-btn"
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => { onAddClick && onAddClick() }}
                    />
                    <Button
                        className="proxy-remove-btn"
                        danger
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<MinusOutlined />}
                        style={{ display: showRemoveBtn ? '' : 'none' }}
                        onClick={() => { onRemoveClick && onRemoveClick() }}
                    />
                </Col>
            </Row>
            <Modal
                title="添加头部"
                open={showAddHeader}
                onOk={addHeaderOk}
                onCancel={() => setShowAddHeader(false)}>
                <TextArea
                    value={addHeader}
                    autoSize
                    placeholder="一行一个 Key:Value"
                    onChange={e => { setAddHeader(e.target.value) }}
                />
            </Modal>
            <Modal
                title="BasicAuth"
                open={showBasicAuth}
                onOk={basicAuthOk}
                onCancel={() => setShowBasicAuth(false)}>
                <TextArea
                    value={basicAuth}
                    autoSize
                    placeholder="一行一个，不要有无意义的空格 username:password"
                    onChange={e => setBasicAuth(e.target.value)}
                />
            </Modal>
        </Input.Group>
    )
}

export default MappingItem;