import { EditableFormInstance } from "@ant-design/pro-components"

export type ModuleOut = {
    moduleTypeId: number
    moduleTypeName: string
    workflowRemark: string
    creatorId: number
    creatorName: string
    createTime: string
    tableCounts: number
    flowCounts: number
    searchCounts: number
    chartsCounts: number
}

export type DropSelect = {
    key: number
    label: string
    disable: boolean
    children: DropSelect[]
}

export type TableOut = {
    tableId: number
    tableViewName: string
    tableDataName: string
    moduleNo: number
    workFlowNo: string
    detailNames: string[]
    detailSelect: DropSelect[]
    groupNames: string[]
    groupSelect: DropSelect[]
    remark: string
    virtual: boolean
    creator: number
    createName: string
    createTime: string
    moduleName: string
    defaultEdit: string
    defaultCreate: string
    defaultDelete: string
    defaultShare: string
}


export type ColumnOut = {
    columnId: number,
    columnViewName: string,
    columnDataName: string,
    columnType: string,
    columnTypeDescription: string,
    tableNo: number,
    columnGroupNo: number,
    columnViewNo: number,
    creator: number,
    creatorName: string,
    createTime: string,
    columnDetailNo: number,
    columnViewDisplay: boolean,
    virtual: boolean
}

export type CharacterOut = {
    dataId: number
    characterName: string
    characterDescription: string
    createTime: string
    creator: number
    createName: string
}

export type HumanOut = {
    dataId: number
    loginName: string
    name: string
    sex: number
    birth: string
    age: number
    telephone: string
    mail: string
    phone: string
    fax: string
    workCode: string
    section: number
    depart: number
    job: string
    directorLeader: number
    supporter: number
    photo: number
    signature: string
    lastLogin: Date
    safety: number
    isDeprecated: number
    departName: string
    sectionName: string
    leaderName: string
}

export type DepartOut = {
    dataId: number
    departName: string
    departCode: string
    fullName: string
    belongDepart: number
    belongSection: number
    departManager: number
    departIntroduction: string
    createTime: string
    photo: number
    isDeprecated: number
    belongDepartName: string
    belongSectionName: string
    managerName: string
}

export type SectionOut = {
    dataId: number
    sectionName: string
    sectionCode: string
    fullName: string
    belongSection: number
    sectionManager: number
    sectionIntroduction: string
    createTime: string
    photo: number
    isDeprecated: number
    belongSectionName: string
    managerName: string
}

export type ContentOut = {
    dataId: number
    deprecated: boolean
    contentName: string
    contentRemark: string
    creator: string
    createTime: string
    defaultEdit: string
    defaultCreate: string
    defaultDelete: string
    defaultShare: string
    leadContent: number
    creatorName: string
    leadName: string
}

export type FileOut = {
    dataId: number
    deprecated: boolean
    fileName: string
    fileRoute: string
    creator: number
    createTime: Date
    editAuthority: string
    viewAuthority: string
    deleteAuthority: string
    leadContent: string
    creatorName: string
    leadName: string
}

export type ColumnSimpleOut = {
    columnViewName: string,
    columnType: string,
    columnTypeDescription: string,
}

export type Group = {
    groupId: number
    groupName: string
    columns: any
    values: any
}

export type Detail = {
    detailId: number
    detailName: string
    columns: any
    values: any[]
    editorFormRef: React.MutableRefObject<EditableFormInstance | undefined>
}

export type FormOut = {
    dataId: number
    requestId: number
    tableId: number
    tableName: string
    requestStatus: number
    creator: number
    createTime: Date
    viewAuthority: string
    creatorName: string
    latestEditTime: Date
    virtual: boolean
    groups: Group[]
    details: Detail[]
    title: string
}

export type Authority = {
    dataId: number
    authorityName: string
    authorityDescription: string
    authorityRemark: string
}

export type GraphNode = {
    id: string
    value: {
        title: string
        name: string
        id: string
        type: string
        icon: string
        isDeprecated: string
    }
    children: GraphNode[]
}

export type RequestOut = {
    requestId: number
    dataId: number
    workflowId: number
    currentNode: number
    requestStatus: number
    doneHistory: string
    flowHistory: string
    submitTime: string
    finishTime: string
    creator: number
    time: string
    timeSelectName: string
    workflowName: string
    currentNodeName: string
    creatorName: string
    requestTitle: string
}

export type RequestDtoOut = {
    requestOut: RequestOut
    workflow: WorkflowOut
    formOut: FormOut
    currentNode: WorkflowNodeOut
}

export type WorkflowOut = {
    dataId: number
    moduleTypeId: number
    tableId: number
    titleColumnId: number
    workFlowName: string
    workFlowDescription: string
    workflowBaseTitle: string
    creator: number
    createTime: string
    isDeprecated: number
    moduleTypeName: string
    tableName: string
    creatorName: string
    createNode: number
    createNodeName: string
}

export type WorkflowRouteOut = {
    dataId: number
    routeName: string
    workflowId: number
    startNodeId: number
    endNodeId: number
    viewNo: number
    enterCondition: string
    routeAction: string
    creator: number
    createTime: string
    creatorName: string
    workflowName: string
    startNodeName: string
    endNodeName: string
    tableId: number
}

export type WorkflowNodeOut = {
    dataId: number
    workflowNodeName: string
    isCounterSign: number
    nodeType: number
    workflowId: number
    viewNo: number
    userAuthorityLimit: string
    beforeAction: string
    checkAction: string
    afterAction: string
    creator: number
    createTime: string
    creatorName: string
    workflowName: string
    tableId: number
}