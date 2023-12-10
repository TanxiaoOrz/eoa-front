import { Spin } from "antd"
import React from "react"

export default () => {
    return (
        <div
            style={{
            background: '#F5F7FA',
            display:"flex",
            height:"98vh"
            }} >
                <Spin size='large' style={{margin:"auto"}}></Spin>
        </div>)
}