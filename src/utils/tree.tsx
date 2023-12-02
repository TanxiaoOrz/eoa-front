
export type TreeBase = {
    title:string
    value:any
    parent:any
}

export type TreeNode = {
    title:string
    value:any
    children:TreeNode[]
}

export function getTree(bases:TreeBase[]):TreeNode[]{
    let roots = bases.filter((value,index,array)=>value.parent === null)
    let rests = bases.filter((value,index,array)=>value.parent !== null)
    return roots.map((root,index,array)=>{
        return {
            value:root.value,
            title:root.title,
            children:consistNode(rests.filter((child,index,array)=>child.parent === root.value)
            ,rests.filter((child,index,array)=>child.parent !== root.value))
        }
    })

}

function consistNode(children:TreeBase[],rests:TreeBase[]):TreeNode[]{
    if (children.length === 0)
        return [];
    else
        return children.map((node,index,array)=> {
            return {
                title:node.title,
                value:node.value,
                children: consistNode(rests.filter((child,index,array)=>child.parent === node.value)
                    ,rests.filter((child,index,array)=>child.parent !== node.value))
            }
        })
}