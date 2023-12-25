import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { OrganizationGraph } from '@ant-design/graphs';
import { GraphNode } from '../../const/out.tsx';
import config from '../../const/config.js'
import { getDataOne } from '../../const/http.tsx'
import PageWait from '../../componet/PageWait.tsx'
import url from '../../const/url.js'

const OrganizationTree = (prop: { showDeprecated: boolean }) => {

    const [tree, setTree] = useState<GraphNode>()
    useEffect(() => {
        if (tree === undefined) {
            let getUrl: string
            if (prop.showDeprecated)
                getUrl = config.backs.organization_tree
            else
                getUrl = config.fronts.organization_tree
            getDataOne(getUrl).then((value) => {
                if (value.success)
                    setTree(value.data)
            })
        }
    })
    if (tree === undefined)
        return <PageWait />

    const getTextStyle = (type: string) => {
        switch (type) {
            case "sum":
                return 20;
            case "section":
                return 18;
            default:
                return 12;
        }
    };

    const getRootTextAttrs = (type: string) => {
        return {
            fontSize: getTextStyle(type),
            fontWeight: 'bold',
            fill: '#fff',
        };
    };

    const getSecondTextStyle = (type: string) => {
        return {
            fontSize: getTextStyle(type),
            color: '#000',
        };
    };

    const getRootNodeStyle = () => {
        return {
            fill: '#1E88E5',
            stroke: '#1E88E5',
            radius: 5,
        };
    };

    const getSecondNodeStyle = () => {
        return {
            fill: '#e8e8e8',
            stroke: '#e8e8e8',
            radius: 5,
        };
    };

    const calcStrLen = function calcStrLen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
                len++;
            } else {
                len += 2;
            }
        }
        return len;
    };

    const graphConfig = {
        nodeCfg: {
            size: [40, 40],
            autoWidth: true,
            padding: 10,
            style: (item:GraphNode) => {
                const { type } = item.value;
                return {
                    fill: 'transparent',
                    stroke: 'transparent',
                    radius: 4,
                    cursor: 'pointer',
                    ...(type === "section" || type === "sum" ? getRootNodeStyle() : {}),
                    ...(type === "depart" ? getSecondNodeStyle() : {}),
                };
            },
            nodeStateStyles: {
                hover: {
                    lineWidth: 2,
                    stroke: '#96DEFF',
                },
            },
            label: {
                style: (cfg, group, types) => {
                    const { type } = cfg.value;

                    if (types !== 'name') {
                        return {};
                    }
                    return {
                        fontSize: getTextStyle(type),
                        cursor: 'pointer',
                        fill: '#1890ff',
                        ...(type === "section" || type === "sum" ? getRootTextAttrs(type) : {}),
                        ...(type === "depart" ? getSecondTextStyle(type) : {}),
                    };
                },
            },
            anchorPoints: [
                [0, 0.5],
                [1, 0.5],
            ],
        },
        edgeCfg: {
            type: 'polyline',
            style: {
                stroke: '#000',
                endArrow: false,
            },
        },
        markerCfg: (cfg) => {
            const { level, direction } = cfg.value;
            const show = level !== 1 && cfg.children && cfg.children.length > 0;
            return {
                position: direction,
                show,
            };
        },
        layout: {
            type: 'mindmap',
            direction: 'H',
            getWidth: (cfg) => {
                const { name, level } = cfg.value;
                const fontSize = getTextStyle(level);
                const width = (fontSize * calcStrLen(name)) / 2;
                return width;
            },
            getHeight: () => {
                return 25;
            },
            getVGap: () => {
                return 20;
            },
            getHGap: () => {
                return 40;
            },
            getSide: (d) => {
                return d.data.value.direction === 'left' ? 'left' : 'right';
            },
        },
        autoFit: true,
        fitCenter: true,
        animate: false,
        behaviors: ['drag-canvas', 'zoom-canvas'],
        onReady: (graph) => {
            graph.on('node:click', (evt) => {
                const { item, target } = evt;
                const { value } = item.get('model');
                if (value.type !== "sum") {
                    let href
                    if (prop.showDeprecated)
                        href = value.type === 'section' ? url.backUrl.section_concrete : url.backUrl.depart_concrete
                    else
                    href = value.type === 'section' ? url.frontUrl.section_concrete : url.frontUrl.depart_concrete
                    window.open(value.href+value.dataId);
                }
            });
        },
    };

    return <OrganizationGraph data={tree} {...graphConfig} />;
};

export default OrganizationTree 
