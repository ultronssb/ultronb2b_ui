import React, { useState } from 'react';
import { colorsTuple, Tabs } from '@mantine/core';
import B2BTabs from '../../../common/B2BTabs';
import B2BButton from '../../../common/B2BButton';
import Hierarchy from './EnrichmentHierarchy';
import Attributes from './EnrichmentAttributes';
import EnrichmentProduct from './EnrichmentProduct';
import EnrichmentVariants from './EnrichmentVariants';
import EnrichmentPrice from './EnrichmentPrice';
import EnrichmentMedia from './EnrichmentMedia';
import EnrichmentSeo from './EnrichmentSeo';
import EnrichmentHierarchy from './EnrichmentHierarchy';
import EnrichmentAttributes from './EnrichmentAttributes';
import EnrichmentTransaction from './EnrichmentTransaction';

const EnrichmentTabs = () => {
    const [activeTab, setActiveTab] = useState("1");

    const initialTabs = [
        { id: "1", name: "Hireachy", disabled: false },
        { id: "2", name: "Attributes", disabled: true },
        { id: "3", name: "Product", disabled: true },
        { id: "4", name: "Transaction", disabled: true },
        { id: "5", name: "SEO", disabled: true },
        { id: "6", name: "Price", disabled: true },
        { id: "7", name: "Image/Video", disabled: true },
    ];

    const [tabs, setTabs] = useState(initialTabs);

    const renderActiveComponent = () => {
        switch (activeTab) {
            case "1":
                return <EnrichmentHierarchy />;
            case "2":
                return <EnrichmentAttributes />;
            case "3":
                return <EnrichmentProduct />;
            case "4":
                return <EnrichmentTransaction />;
            case "5":
                return <EnrichmentSeo />;
            case "6":
                return <EnrichmentPrice />;
            case "7":
                return <EnrichmentMedia />;
            default:
                return <Hierarchy />;
        }
    };

    const handleTabClick = (index) => {
        handleNextTab();
        if (!index.disabled) {
            setActiveTab(index.id);
        }
    };

    const handleBackTab = () => {
        const prevTabIndex = tabs.findIndex((tab) => tab.id === activeTab) - 1;
        if (prevTabIndex >= 0) {
            setActiveTab(tabs[prevTabIndex].id);
        }
    };

    const enableNextTab = () => {
        setTabs((prevTabs) => {
            const updatedTabs = prevTabs.map((tab, index) => {
                if (tab.id === activeTab) {
                    const nextIndex = index + 1;
                    if (nextIndex < prevTabs.length) {
                        prevTabs[nextIndex].disabled = false; // Enable the next tab
                    }
                }
                return tab;
            });
            return [...updatedTabs];
        });
    };

    const handleNextTab = () => {
        enableNextTab();
        const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
        const nextIndex = currentIndex + 1;
        if (nextIndex < tabs.length && !tabs[nextIndex].disabled) {
            setActiveTab(tabs[nextIndex].id);
        }
    };

    return (
        <div>
            <B2BTabs
                tabsData={tabs}
                justify={"flex-start"}
                onClick={handleTabClick}
                activeId={activeTab}
                variant='default'
                margin='10px'
            />
            <div style={{ minHeight: '50vh' }}>
                {renderActiveComponent()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} />}
                {activeTab < "7" && <B2BButton name={'Next'} onClick={handleNextTab} />}
                {activeTab === "7" &&
                    <B2BButton
                        style={{ backgroundColor: 'green' }}
                        name={"Save"}
                        id={"Save"}
                    // disabled={!isFormValid} // Disable Save button if the form is not valid
                    />
                }
            </div>
        </div>
    );
};

export default EnrichmentTabs;
