import { useState, useEffect, useRef } from "react"
import { getDataList } from "../../const/http"
import { ModuleOut } from "../../const/out"
import config from "../../const/config"
import { SnippetsFilled, FolderOpenTwoTone } from "@ant-design/icons"
import { Layout, List, Tabs, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { Header, Content } from "antd/es/layout/layout"
import tabs from "antd/es/tabs"
import React from "react"
import { ActionType } from "@ant-design/pro-components"
import { useLocation } from "react-router"

const {Title} = Typography;

const createWorkflow = () => {
    const query = new URLSearchParams(useLocation().search);
    const moduleNo = query.get("moduleNo");
}

const WorkflowList = () => {
    const actionRef = useRef<ActionType>();
    const query = new URLSearchParams(useLocation().search);
    const moduleNo = query.get("moduleNo");

    return (<>
    
    </>)
}


const BackWorkflow = () => {
    const [moduleList, setModuleList] = useState<ModuleOut[]>([])
    useEffect(() => {
        if (moduleList.length == 0)
            (getDataList(config.backs.module)).then((value) => {
                setModuleList(value.data)
            })
    })

    return (
        <Layout style={{ minHeight: '98.5vh'}}>
          <Header style={{ display: 'flex', alignItems: 'center', background: "#ffffff", borderRadius: "8px",}}>
            <SnippetsFilled  style={{fontSize:"36px",marginTop:"30px",marginLeft:"5px",marginBottom:'30px'}} />
            <Title level = {2} style={{color:'GrayText', marginLeft:'10px',marginBottom:'30px'}}>表单列表</Title>
          </Header>
          <Layout hasSider>
            <Sider style={{ padding: '10px 10px',backgroundColor:"#f7f7f7"}}>
            <List 
              style={{ minHeight: '100%'}}
              pagination={{position:'top', align:'center'}}
              bordered = {true}
              itemLayout="horizontal"
              dataSource={moduleList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<FolderOpenTwoTone/>}
                    title={<a href={window.location.pathname+"?moduleNo="+item.moduleTypeId}>{item.moduleTypeName}</a>}
                  />
                </List.Item>
              )}
            />
            </Sider>
            <Content style={{ padding: '15px 50px'}}>
                <WorkflowList />
            </Content>
          </Layout>
        </Layout>
      );
}

export default BackWorkflow;