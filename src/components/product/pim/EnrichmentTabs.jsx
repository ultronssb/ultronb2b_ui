// import { Slider } from '@mantine/core';
// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { B2B_API } from '../../../api/Interceptor';
// import B2BButton from '../../../common/B2BButton';
// import B2BTabs from '../../../common/B2BTabs';
// import EnrichmentAttributes from './EnrichmentAttributes';
// import { default as EnrichmentHierarchy, default as Hierarchy } from './EnrichmentHierarchy';
// import EnrichmentPrice from './EnrichmentPrice';
// import EnrichmentProduct from './EnrichmentProduct';
// import EnrichmentProductVariant from './EnrichmentProductVariant';
// import EnrichmentSeo from './EnrichmentSeo';
// import EnrichmentTransaction from './EnrichmentTransaction';
// import { EnrichProductContext } from './EnrichProduct';

// const EnrichmentTabs = () => {
//     const { product, pim, videoFile, multimedia } = useContext(EnrichProductContext);
//     const [activeTab, setActiveTab] = useState("1");
//     const [sliderValue, setSliderValue] = useState(0)
//     const navigate = useNavigate();
//     const query_param = new URLSearchParams(location.search);
//     const from = query_param.get('from');

//     const initialTabs = [
//         { id: "1", name: "Hireachy", disabled: false },
//         // { id: "2", name: "Attributes", disabled: false },
//         { id: "3", name: "Product", disabled: false },
//         { id: "4", name: "Transaction", disabled: false },
//         { id: "5", name: "SEO", disabled: false },
//         { id: "6", name: "Price", disabled: false },
//         { id: "7", name: "Variants", disabled: false },
//     ];

//     const [tabs, setTabs] = useState(initialTabs);

//     const renderActiveComponent = () => {
//         switch (activeTab) {
//             case "1":
//                 return <EnrichmentHierarchy />;
//             case "3":
//                 return <EnrichmentProduct />;
//             case "4":
//                 return <EnrichmentTransaction />;
//             case "5":
//                 return <EnrichmentSeo />;
//             case "6":
//                 return <EnrichmentPrice />;
//             case "7":
//                 return <EnrichmentProductVariant />;
//             default:
//                 return <Hierarchy />;
//         }
//     };

//     const handleTabClick = (index) => {
//         if (!index.disabled) {
//             setActiveTab(index.id);
//         }
//     };

//     const handleBackTab = () => {
//         const prevTabIndex = tabs.findIndex((tab) => tab.id === activeTab) - 1;
//         if (prevTabIndex >= 0) {
//             setActiveTab(tabs[prevTabIndex].id);
//             setSliderValue((prev) => Math.max(0, prev - 17));
//         }
//     };

//     const enableNextTab = () => {
//         setTabs((prevTabs) => {
//             const updatedTabs = prevTabs.map((tab, index) => {
//                 if (tab.id === activeTab) {
//                     const nextIndex = index + 1;
//                     if (nextIndex < prevTabs.length) {
//                         prevTabs[nextIndex].disabled = false;
//                     }
//                 }
//                 return tab;
//             });
//             return [...updatedTabs];
//         });
//     };

//     const handleNextTab = () => {
//         enableNextTab();
//         const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
//         const nextIndex = currentIndex + 1;
//         if (nextIndex < tabs.length && !tabs[nextIndex].disabled) {
//             setActiveTab(tabs[nextIndex].id);
//             setSliderValue((prev) => Math.min(100, prev + 17));
//         } else if (nextIndex === tabs.length - 1) {
//             setSliderValue(100);
//         }
//     };

//     const handlePimSave = async () => {
//         try {
//             const formData = new FormData();
//             let updatedPim = {
//                 ...pim,
//                 attributes: [...pim.attributes]
//             };
//             updatedPim.attributes = updatedPim.attributes
//                 ? updatedPim.attributes.reduce((acc, item) => {
//                     acc[item.key] = item.value;
//                     return acc;
//                 }, {})
//                 : {};
//             formData.append("pim", JSON.stringify(updatedPim));
//             formData.append("video", videoFile);

//             pim.pimVariants.forEach((file, index) => {
//                 if (file.file) {
//                     formData.append(`files`, file.file);
//                     formData.append(`productVarId`, file.id);
//                 }
//             });

//             const res = await B2B_API.post(`pim`, {
//                 body: formData,
//             }).json();
//             navigate(from);
//         } catch (err) {
//             console.error("Failed to add Pim", err);
//         }
//     };


//     return (
//         <div>

//             <div style={{ textAlign: 'right', marginBottom: '10px' }}>
//                 <strong>{sliderValue}% Completed</strong>
//             </div>

//             <Slider value={sliderValue} marks={[{ value: 0 }, { value: 17 }, { value: 34 }, { value: 51 }, { value: 68 }, { value: 85 }, { value: 100 }]} />
//             <B2BTabs
//                 tabsData={tabs}
//                 justify={"flex-start"}
//                 onClick={handleTabClick}
//                 activeId={activeTab}
//                 variant='default'
//                 margin='10px'
//             />
//             <div style={{ minHeight: '50vh' }}>
//                 {renderActiveComponent()}
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
//                 {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} style={{ marginTop: '1px' }} />}
//                 {activeTab < "7" && <B2BButton name={'Next'} onClick={handleNextTab} style={{ marginTop: '1px' }} />}
//                 {activeTab === "7" &&
//                     <B2BButton
//                         style={{ backgroundColor: 'green' }}
//                         name={"Save"}
//                         id={"Save"}
//                         onClick={(e) => handlePimSave(e)}
//                     />
//                 }
//             </div>
//         </div>
//     );
// };
// export default EnrichmentTabs;


import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTabs from '../../../common/B2BTabs';
import EnrichmentAttributes from './EnrichmentAttributes';
import { default as EnrichmentHierarchy, default as Hierarchy } from './EnrichmentHierarchy';
import EnrichmentPrice from './EnrichmentPrice';
import EnrichmentProduct from './EnrichmentProduct';
import EnrichmentProductVariant from './EnrichmentProductVariant';
import EnrichmentSeo from './EnrichmentSeo';
import EnrichmentTransaction from './EnrichmentTransaction';
import { EnrichProductContext } from './EnrichProduct';
import _ from 'lodash';

const EnrichmentTabs = () => {
    const { product, pim, videoFile, multimedia } = useContext(EnrichProductContext);
    const [activeTab, setActiveTab] = useState("1");
    const [sliderValue, setSliderValue] = useState(0); // Percentage filled
    const [filledFieldsCount, setFilledFieldsCount] = useState(0); // Count of filled fields
    const [totalFieldsCount, setTotalFieldsCount] = useState(0); // Total number of fields to track

    const navigate = useNavigate();
    const query_param = new URLSearchParams(location.search);
    const from = query_param.get('from');

    const initialTabs = [
        { id: "1", name: "Attributes", disabled: false },
        { id: "2", name: "Product", disabled: false },
        { id: "3", name: "Transaction", disabled: false },
        { id: "4", name: "SEO", disabled: false },
        { id: "5", name: "Price", disabled: false },
        { id: "6", name: "Variants", disabled: false },
    ];

    const [tabs, setTabs] = useState(initialTabs);

    useEffect(() => {
        const sliderPercent = calculateInitialFilledPercentage();
        setSliderValue(sliderPercent)
    }, [product, pim]);

    const calculateInitialFilledPercentage = () => {
        let filledFields = 0;
        let totalFields = 0;

        // Calculate filled fields for product and pim
        if (pim) {
            totalFields += Object.keys(pim).length; // Count actual fields in pim
            filledFields += Object.values(pim).filter(value => value !== null && value !== "").length; // Count filled fields in pim
        }

        // Logging for debugging
        setFilledFieldsCount(filledFields);
        setTotalFieldsCount(totalFields);

        const initialPercentage = totalFields ? Math.round((filledFields / totalFields) * 100) : 0;
        return initialPercentage;
    };


    const renderActiveComponent = () => {
        switch (activeTab) {
            case "1":
                return <EnrichmentHierarchy />;
            case "2":
                return <EnrichmentProduct />;
            case "3":
                return <EnrichmentTransaction />;
            case "4":
                return <EnrichmentSeo />;
            case "5":
                return <EnrichmentPrice />;
            case "6":
                return <EnrichmentProductVariant />;
            default:
                return <Hierarchy />;
        }
    };

    const handleTabClick = (index) => {
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
                        prevTabs[nextIndex].disabled = false;
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

    const handlePimSave = async () => {
        try {
            const formData = new FormData();
            let updatedPim = {
                ...pim,
                attributes: [...pim.attributes]
            };
            updatedPim.attributes = updatedPim.attributes
                ? updatedPim.attributes.reduce((acc, item) => {
                    acc[item.key] = item.value;
                    return acc;
                }, {})
                : {};
            formData.append("pim", JSON.stringify(updatedPim));
            formData.append("video", videoFile);

            pim.pimVariants.forEach((file, index) => {
                if (file.file) {
                    formData.append(`files`, file.file);
                    formData.append(`productVarId`, file.id);
                }
            });

            const res = await B2B_API.post(`pim`, {
                body: formData,
            }).json();
            navigate(from);
        } catch (err) {
            console.error("Failed to add Pim", err);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <strong>{sliderValue}% Completed</strong>
            </div>
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
                {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} style={{ marginTop: '1px' }} />}
                {activeTab < "7" && <B2BButton name={'Next'} onClick={handleNextTab} style={{ marginTop: '1px' }} />}
                {activeTab === "7" &&
                    <B2BButton
                        style={{ backgroundColor: 'green' }}
                        name={"Save"}
                        id={"Save"}
                        onClick={(e) => handlePimSave(e)}
                    />
                }
            </div>
        </div>
    );
};

export default EnrichmentTabs;
