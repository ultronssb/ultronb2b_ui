import React, { useEffect, useState } from 'react';
import B2BInput from '../../common/B2BInput';
import B2BTextarea from '../../common/B2BTextarea';
import './CreateCollection.css';
import { Button, FileButton } from '@mantine/core';

const CreateCollection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      setImage(newFiles[0]);
    }
  };

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }, [image]);

  const collectionFields = [
    { id: 1, name: 'Collection ID', type: 'textField', disabled: false },
    { id: 2, name: 'Collection Name', type: 'textField', disabled: false },
    { id: 3, name: 'Collection Description', type: 'textArea', disabled: false },
    { id: 4, name: 'Collection Image', type: 'image', disabled: false },
  ];

  return (
    <div className="collection-form">
      {collectionFields.map((field) => (
        <div key={field.id} className="collection-form-group">
          <label className='collection-label'>{field.name}</label>
          {field.type === 'textField' && (
            <B2BInput placeholder={field.name} disabled={field.disabled} />
          )}
          {field.type === 'textArea' && (
            <B2BTextarea placeholder={field.name} disabled={field.disabled} />
          )}
          {field.type === 'image' && (
            <div style={{border: '2px solid silver', padding:'10px 50px', display:'flex', flexDirection:'column', borderRadius:'10px'}}>
              <FileButton onChange={handleFileChange} accept="image/png,image/jpeg" multiple>
                {(props) => <Button {...props} bg='gray'>Add image</Button>}
              </FileButton>
              <label htmlFor="" style={{fontSize:'14px', textAlign:'center'}}>Or drop an image here</label>
              {preview && (
                <div>
                  <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', marginTop: '1rem' }} />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreateCollection;



// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, { useState } from 'react';

// const CategoryInput = ({ level, value, onChange, onAdd, onRemove }) => {
//   return (
//     <div style={{ marginLeft: `${level * 40}px`, padding: '10px', display: 'flex', flexDirection: 'column' }}>
//       <div>
//         <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={`Level ${level} Category`} style={{ padding: '8px', outline: 'none', width: '500px' }} />
//         {level > 1 && <FontAwesomeIcon icon={faTrashCan} onClick={onRemove}  style={{ marginLeft: '1rem', fontSize:'18px', color: '#FF6E61', }}/>}
//       </div>
//       {level < 4 && (
//         <div>
//           {onAdd && <span onClick={onAdd}>+ Add Level {level + 1}</span>}
//         </div>
//       )}
//     </div>
//   );
// };

// const CategoryTree = ({ level = 1, categories, onCategoryChange }) => {
//   const handleCategoryChange = (index, newValue) => {
//     const newCategories = [...categories];
//     newCategories[index].value = newValue;
//     onCategoryChange(newCategories);
//   };

//   const handleAddSubCategory = (index) => {
//     const newCategories = [...categories];
//     newCategories[index].child.push([{ name: '', parentId: null, child: [] }]);
//     onCategoryChange(newCategories);
//   };

//   const handleRemoveCategory = (index) => {
//     const newCategories = categories.filter((_, i) => i !== index);
//     onCategoryChange(newCategories);
//   };

//   return (
//     <>
//       {categories.map((category, index) => (
//         <div key={index} style={{display:'flex', flexDirection:'column'}}>
//           <CategoryInput
//             level={level}
//             value={category.name}
//             onChange={(newValue) => handleCategoryChange(index, newValue)}
//             onAdd={() => handleAddSubCategory(index)}
//             onRemove={() => handleRemoveCategory(index)}
//           />
//           {level < 4 && (
//             <>
//               <CategoryTree
//                 level={level + 1}
//                 categories={category.child}
//                 onCategoryChange={(child) => {
//                   const newCategories = [...categories];
//                   newCategories[index].child = child;
//                   onCategoryChange(newCategories);
//                 }}
//               />
//             </>
//           )}
//         </div>
//       ))}
//     </>
//   );
// };

// const CreateCollection = () => {
//   const [categoryTree, setCategoryTree] = useState([{ name: '', parentId: null, child: [] }]);

//   return (
//     <div>
//       <h3>Category Levels</h3>
//       <CategoryTree
//         level={1}
//         categories={categoryTree}
//         onCategoryChange={(newTree) => setCategoryTree(newTree)}
//       />
//       <pre>{JSON.stringify(categoryTree, null, 2)}</pre>
//     </div>
//   );
// };

// export default CreateCollection;