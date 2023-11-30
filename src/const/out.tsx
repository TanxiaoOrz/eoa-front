
export type ModuleOut = {
    moduleTypeId:number
    moduleTypeName:string
    workflowRemark:string
    creatorId:number
    creatorName:string
    createTime:string
    tableCounts:number
    flowCounts:number
    searchCounts:number
    chartsCounts:number
}

export type DropSelect = {
    key:number
    label:string
    disable:boolean
    children:DropSelect[]
}

export type TableOut = {
    tableId:number
    tableViewName:string
    tableDataName:string
    moduleNo:number
    workFlowNo:string
    detailNames:string[]
    detailSelect:DropSelect[]
    groupNames:string[]
    groupSelect:DropSelect[]
    remark:string
    virtual:boolean
    creator:number
    createName:string
    createTime:string
    moduleName:string
    defaultEdit:string
    defaultCreate:string
    defaultDelete:string
    defaultShare:string
}


export type ColumnOut = {
    columnId:number,
    columnViewName:string,
    columnDataName:string,
    columnType:string,
    columnTypeDescription:string,
    tableNo:number,
    columnGroupNo:number,
    columnViewNo:number,
    creator:number,
    creatorName:string,
    createTime:string,
    columnDetailNo:number,
    columnViewDisplay:boolean,
    virtual:boolean
}

export type CharacterOut = {
    dataId:number
    characterName:string
    characterDescription:string
    createTime:string
    creator:number
    createName:string
}

export type HumanOut = {
    dataId:number
    loginName:string
    name:string
    sex:number
    birth:string
    age:number
    telephone:string
    mail:string
    phone:string
    fax:string
    workCode:string
    section:number
    depart:number
    job:string
    directorLeader:number
    supporter:number
    photo:number
    signature:string
    lastLogin;Date
    safety:number

    departName:string
    sectionName:string
    leaderName:string
}

export type DepartOut = {
    dataId:number
    departName:string
    departCode:string
    fullName:string
    belongDepart:number
    belongSection:number
    departManager:number
    departIntroduction:string
    createTime:string
    photo:number

    belongDepartName:string
    belongSectionName:string
    managerName:string
}

export type SectionOut = {
    dataId:number
    sectionName:string
    sectionCode:string
    fullName:string
    belongSection:number
    sectionManager:number
    sectionIntroduction:string
    createTime:string
    photo:number

    belongSectionName:string
    managerName:string
}