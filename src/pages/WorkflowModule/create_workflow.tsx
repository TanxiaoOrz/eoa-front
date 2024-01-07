import React, { useEffect, useState } from "react"
import { ModuleOut, WorkflowOut } from "../../const/out.tsx"
import { getDataList } from "../../const/http.tsx"
import config from "../../const/config.js"
import { ProCard } from "@ant-design/pro-components"
import url from "../../const/url"
import PageWait from "../../componet/PageWait.tsx"
import { FolderOpenTwoTone } from "@ant-design/icons"
import { Col, Layout, Row, Typography } from "antd"
import { Header, Content } from "antd/es/layout/layout"
const { Title } = Typography

const ModeuleCard = (prop: { workflows: WorkflowOut[], moduleName: string }) => {

    if (module === undefined)
        return (
            <ProCard
                loading
                layout="center"
            />
        )

    let workflowLinks = prop.workflows.map((workflow) =>
        <div key={workflow.dataId}><a href={url.frontUrl.request_concrete + '0?workflow=' + workflow.dataId} >{workflow.workFlowName}</a></div>
    )

    return (
        <ProCard
            title={prop.moduleName}
            collapsible
            headerBordered
            style={{ marginTop: '5px' }}
            boxShadow
        >
            {workflowLinks}
        </ProCard>
    )

}

const CreateWorkflow = () => {
    const [workflows, setWorkflows] = useState<WorkflowOut[]>()
    const [modules, setModules] = useState<ModuleOut[]>()
    useEffect(() => {
        if (modules === undefined)
            getDataList(config.fronts.module).then((value) => {
                if (value.success)
                    setModules(value.data)
            })
    })
    useEffect(() => {
        if (workflows === undefined)
            getDataList(config.fronts.workflow).then((value) => {
                if (value.success)
                    setWorkflows(value.data)
            })
    })

    if (workflows === undefined || modules === undefined)
        return <PageWait />


    let workflowGroups = modules.map((module) => { return { moduleName: module.moduleTypeName, workflows: workflows.filter((workflow) => workflow.moduleTypeId === module.moduleTypeId) } })



    let header = (
        <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px", }}>
            <div style={{ display: 'flex' }}>
                <FolderOpenTwoTone style={{ fontSize: "36px", marginTop: "15px", marginLeft: "5px" }} />
                <Title level={2} style={{ color: 'GrayText', marginLeft: '10px', marginBottom: '15px' }}>新建流程列表</Title>
            </div>
        </Header>
    )

    const style = {
        padding: '8px 0'
    }


    return (
        <Layout style={{ minHeight: '100vh' }}>
            {header}
            <Content style={{ padding: '15px 50px', minHeight: '100%' }}>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <div style={style}>
                            {workflowGroups.filter((value, index) => index % 4 === 0).map((group) => <ModeuleCard {...group} />)}
                        </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div style={style}>
                            {workflowGroups.filter((value, index) => index % 4 === 1).map((group) => <ModeuleCard {...group} />)}
                        </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div style={style}>
                            {workflowGroups.filter((value, index) => index % 4 === 2).map((group) => <ModeuleCard {...group} />)}
                        </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div style={style}>
                            {workflowGroups.filter((value, index) => index % 4 === 3).map((group) => <ModeuleCard {...group} />)}
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default CreateWorkflow