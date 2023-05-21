import React from "react";
import { Button, Checkbox, Col, Input, Row } from "antd"
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import './MappingItem.css'

const MappingItem = props => {
    const { value, onAddClick, onRemoveClick, onChange, showAddBtn, showRemoveBtn } = props

    const onValueChange = e => {
        if (!onChange) return
        const newValue = {
            path: value.path,
            target: value.target,
            proxy_header: value.proxy_header
        }
        if (e.target.name === 'proxy_header') {
            newValue.proxy_header = e.target.checked
        } else {
            newValue[[e.target.name]] = e.target.value
        }
        onChange(newValue)
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
                <Col span={9}>
                    <Input
                        name="target"
                        addonBefore="目标："
                        value={value.target}
                        onChange={onValueChange}
                    />
                </Col>
                <Col span={4}>
                    <Checkbox
                        name="proxy_header"
                        style={{ lineHeight: 2.2 }}
                        checked={value.proxy_header}
                        onChange={onValueChange}
                    >
                        代理头
                    </Checkbox>
                </Col>
                <Col span={5}>
                    <Button
                        className="proxy-add-btn"
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<PlusOutlined />}
                        style={{ display: showAddBtn ? '' : 'none' }}
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
        </Input.Group>
    )
}

export default MappingItem;