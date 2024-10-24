import { faChevronDown, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Group } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveTabContext } from '../../../layout/Layout';
import { createB2BAPI } from '../../../api/Interceptor';

const GetCategory = () => {
    const { stateData } = useContext(ActiveTabContext);

    const [category, setCategory] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});
    const navigate = useNavigate();
    const B2B_API = createB2BAPI();

    const toggleNode = (nodeName) => {
        setExpandedNodes((prevExpanded) => ({
            ...prevExpanded,
            [nodeName]: !prevExpanded[nodeName],
        }));
    };

    const renderTreeNode = (node, level = 0) => {
        const isExpanded = !!expandedNodes[node.name];
        const hasChildren = node.child && node.child.length > 0;

        return (
            <div key={node.name} style={{ marginLeft: level * 10 }}>
                <TreeNode
                    node={node}
                    expanded={isExpanded}
                    hasChildren={hasChildren}
                    onToggle={() => hasChildren && toggleNode(node.name)}
                />
                {isExpanded && hasChildren && (
                    <div style={{ marginLeft: `${(level - 1) * -40}px` }}>
                        {node.child.map((child) => renderTreeNode(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async () => {
        try {
            const response = await B2B_API.get('product-category').json();
            setCategory(response.response);
        } catch (error) {
            notify({
                title: "Error!!",
                message: error.message,
                error: true,
                success: false
            })
        }
    };

    const categoryEdit = (node) => {
        const categoryId = node.categoryId;
        navigate(`/product/product-hierarchy?id=${categoryId}`, { state: { ...stateData, tabs: stateData.childTabs } });
    }

    const TreeNode = ({ node, expanded, hasChildren, onToggle }) => {
        return (
            <div>
                {
                    _.size(category) > 0 && (
                        <div className='f-a c-j-10'>
                            {node.parentId === null && <FontAwesomeIcon className='cursor' icon={faPenToSquare} onClick={() => categoryEdit(node)} />}
                            <Group gap="xs" style={{ display: 'contents' }}>
                                <Group gap={5} onClick={onToggle} style={{ cursor: 'pointer', width: '100%', justifyContent: 'space-between', padding: '5px' }}>
                                    <span className='fs-16'>{node.name}</span>
                                    {hasChildren && (
                                        <FontAwesomeIcon
                                            icon={faChevronDown}
                                            size={14}
                                            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                        />
                                    )}
                                </Group>
                                <Divider color='gray' />
                            </Group>
                        </div>
                    )
                }
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#fff', width: '300px', padding: '10px', boxShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}>{category.map((node) => renderTreeNode(node))}</div>
    )
}

export default GetCategory
