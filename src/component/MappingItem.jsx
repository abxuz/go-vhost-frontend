import React from "react";
import { Button, Checkbox, Col, Input, Row } from "antd"
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'

import './MappingItem.css'

const MappingItem = props => {
    const { value, onAddClick, onRemoveClick, onChange, showRemoveBtn } = props

    const onValueChange = e => {
        if (!onChange) return
        let newValue = {...value}
        if (e.target.name === 'proxy_header') {
            newValue.proxy_header = e.target.checked
        } else if (e.target.name === 'redirect') {
            newValue.redirect = e.target.checked
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
                    <Checkbox
                        name="redirect"
                        style={{ lineHeight: 2.2 }}
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
        </Input.Group>
    )
}

export default MappingItem;