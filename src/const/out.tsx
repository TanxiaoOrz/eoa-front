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
};

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