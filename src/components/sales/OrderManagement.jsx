import React, { useState, useEffect } from 'react';
import { B2B_API } from '../../api/Interceptor';
import { data } from '../../moduleData/Json';

const OrderManagement = () => {
  const [categoryTree, setCategoryTree] = useState(null);
  const [hierarchyLabel, setHierarchyLabel] = useState('');
  const initialParentId = 'CAT-0004';
  

  const fetchCategoryHierarchy = async (parentId) => {
    let hierarchy = [];
    let currentId = parentId;

    while (currentId) {
      try {
        const response = await B2B_API.get(`product-category/category/${currentId}`).json();
        const category = response.response;

        if (category) {
          hierarchy.push(category.name);
          currentId = category.parentId;
        } else {
          currentId = null;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        currentId = null;
      }
    }
    console.log('Hierarchy:', hierarchy);
    return hierarchy.reverse();
  };

  useEffect(() => {
    const fetchAndSetCategoryTree = async () => {
      const hierarchy = await fetchCategoryHierarchy(initialParentId);

      const filteredHierarchy = hierarchy.slice(1);
      const hierarchyLabel = filteredHierarchy.join(' / ');

      setHierarchyLabel(hierarchyLabel);
      setCategoryTree({ hierarchyLabel });
    };

    fetchAndSetCategoryTree();
  }, [initialParentId]);

  return (
    <div>
      <h1>Category Hierarchy</h1>
      <p>Hierarchy Label: {hierarchyLabel}</p>
    </div>
  );
};

export default OrderManagement;


// import React, { useState, useEffect } from 'react';
// import { B2B_API } from '../../api/Interceptor';
// import { data } from '../../moduleData/Json';

// const OrderManagement = () => {
//   const [categoryTree, setCategoryTree] = useState(null);
//   const [hierarchyLabel, setHierarchyLabel] = useState('');
//   const initialParentId = 'CAT-0004';
  

//   const fetchCategoryHierarchy = async (parentId) => {
//     let hierarchy = [];
//     let currentId = parentId;
//     while (currentId) {
//       try {
//         const response = await B2B_API.get(`product-category/category/${currentId}`).json();
//         const category = response.response;
//         if (category) {
//           hierarchy.push(category.name);
//           currentId = category.parentId;
//         } else {
//           currentId = null;
//         }
//       } catch (error) {
//         console.error('Error fetching category:', error);
//         currentId = null;
//       }
//     }
//     console.log('Hierarchy:', hierarchy);
//     return hierarchy.reverse();
//   };
  

//   useEffect(() => {
//     const fetchAndSetCategoryTree = async () => {
//       try {
//         const hierarchy = await fetchCategoryHierarchy(initialParentId);
//         if (Array.isArray(hierarchy)) {
//           const filteredHierarchy = hierarchy.slice(1);
//           const hierarchyLabel = filteredHierarchy.join(' / ');
//           setHierarchyLabel(hierarchyLabel);
//           setCategoryTree({ hierarchyLabel });
//         } else {
//           console.error('Expected hierarchy to be an array but got:', hierarchy);
//         }
//       } catch (error) {
//         console.error('Error in fetchAndSetCategoryTree:', error);
//       }
//     };
//     fetchAndSetCategoryTree();
//   }, [initialParentId]);
  

//   return (
//     <div>
//       <h1>Category Hierarchy</h1>
//       <p>Hierarchy Label: {hierarchyLabel}</p>
//     </div>
//   );
// };

// export default OrderManagement;
