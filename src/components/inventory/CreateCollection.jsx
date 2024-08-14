import React from 'react';
import B2BInput from '../../common/B2BInput';
import './CreateCollection.css';
import B2BTextarea from '../../common/B2BTextarea';

const CreateCollection = () => {
  const collectionFields = [
    { id: 1, name: 'Collection ID', type: 'textField', disabled: false, },
    { id: 2, name: 'Collection Name', type: 'textField', disabled: false, },
    { id: 3, name: 'Collection Description', type: 'textArea', disabled: false, },
    { id: 4, name: 'Collection Image', type: 'textField', disabled: false, },
  ];

  return (
    <div>
      <div className="collection-form">
        {collectionFields.map((field) => (
          <div key={field.id} className="collection-form-group">
            <label className='collection-label'>{field.name}</label>
            {field.type === 'textField' && (
              <B2BInput placeholder={field.name}  disabled={field.disabled} />
            )}
            {field.type === 'textArea' && (
              <B2BTextarea placeholder={field.name}  disabled={field.disabled} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateCollection;

