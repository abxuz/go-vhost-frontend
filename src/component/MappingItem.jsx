import React from "react";
import { Button, Checkbox, Col, Input, Row, Modal, message } from "antd"
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import './MappingItem.css'

const { TextArea } = Input;

const MappingItem = props => {
    const { value, onAddClick, onRemoveClick, onChange, showRemoveBtn } = props

    const [showModal, setShowModal] = React.useState(false)
    const [addHeader, setAddHeader] = React.useState('')

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

    const showAddHeader = () => {
        setAddHeader(value.add_header.join("\n"))
        setShowModal(true)
    }

    const handleOk = () => {
        const headers = [];
        const lines = addHeader.split("\n")
        for (let line of lines) {
            line = line.trim()
            const items = line.split(":")
            if (items.length < 2) {
                message.error('格式有误');
                return
            }
            headers.push(line)
        }
        if (!onChange) {
            setShowModal(false);
            return
        }

        let newValue = { ...value }
        newValue.add_header = headers
        onChange(newValue)
        setShowModal(false);
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
                <Col span={5} style={{ lineHeight: 2.2 }}>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={showAddHeader}
                    >
                        添加头部
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
                <Col span={5}>
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
                open={showModal}
                onOk={handleOk}
                onCancel={() => setShowModal(false)}>
                <TextArea
                    value={addHeader}
                    autoSize
                    placeholder="一行一个 Key:Value"
                    onChange={e => setAddHeader(e.target.value)}
                />
            </Modal>
        </Input.Group>
    )
}

export default MappingItem;