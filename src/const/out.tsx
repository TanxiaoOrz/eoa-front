
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