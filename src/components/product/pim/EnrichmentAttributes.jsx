// import React, { useContext, useState } from 'react';
// import B2BInput from '../../../common/B2BInput';
// import { EnrichProductContext } from './EnrichProduct';
// import B2BButton from '../../../common/B2BButton';
// import { Button, Modal, Popover, TextInput } from '@mantine/core';

// const EnrichmentAttributes = () => {
//   const { handleChange, product } = useContext(EnrichProductContext);
//   const [opened, setOpened] = useState(false);
//   const open = () => setOpened(true);
//   const close = () => setOpened(false);

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <Button onClick={open}>Add Variant </Button>
//         <Modal opened={opened} onClose={close} centered>
//           <TextInput label="Variant Name" />
//           <TextInput label="Variant Value" mt="sm" />
//           <B2BButton
//            name={"ADD"}/>
//         </Modal>
//       </div>
//       <form className='form-container'>
//         <div className={"form-group"}>
//           <label className='form-label'>Garment Types</label>
//           <B2BInput
//             value={""}
//             className='form-input'
//             onChange={(event) => handleChange(event, "garmenType")}
//             placeholder={"Garment Type"}
//           />
//         </div>
//         <div className={"form-group"}>
//           <label className='form-label'>Solid / Pattern</label>
//           <B2BInput
//             value={''}
//             className='form-input'
//             onChange={(event) => handleChange(event, "solidOrPattern")}
//             placeholder={"Solid"}
//           />
//         </div>
//         <div className={"form-group"}>
//           <label className='form-label'>Performance</label>
//           <B2BInput
//             value={product?.performance}
//             className='form-input'
//             onChange={(event) => handleChange(event, "performance")}
//             placeholder={"Performance"}
//           />
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EnrichmentAttributes;

import React, { useContext, useState } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';
import B2BButton from '../../../common/B2BButton';
import { ActionIcon, Button, Modal, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

const EnrichmentAttributes = () => {
  const { handleChange, product } = useContext(EnrichProductContext);
  const [opened, setOpened] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantName, setVariantName] = useState('');
  const [variantValue, setVariantValue] = useState('');

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const addVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { name: variantName, value: variantValue },
    ]);
    setVariantName('');
    setVariantValue('');
    close();
  };

  const removeVariant = (indexToRemove) => {
    setVariants((prevVariants) =>
      prevVariants.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={open}>Add Variant </Button>
        <Modal opened={opened} onClose={close} centered>
          <TextInput
            label="Variant Name"
            value={variantName}
            onChange={(event) => setVariantName(event.currentTarget.value)}
          />
          <TextInput
            label="Variant Value"
            value={variantValue}
            onChange={(event) => setVariantValue(event.currentTarget.value)}
            mt="sm"
          />
          <B2BButton name={"ADD"} onClick={addVariant} />
        </Modal>
      </div>

      <form className="form-container">
        <div className="form-group">
          <label className="form-label">Garment Types</label>
          <B2BInput
            value={""}
            className="form-input"
            onChange={(event) => handleChange(event, "garmenType")}
            placeholder={"Garment Type"}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Solid / Pattern</label>
          <B2BInput
            value={""}
            className="form-input"
            onChange={(event) => handleChange(event, "solidOrPattern")}
            placeholder={"Solid"}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Performance</label>
          <B2BInput
            value={product?.performance}
            className="form-input"
            onChange={(event) => handleChange(event, "performance")}
            placeholder={"Performance"}
          />
        </div>

        {variants.map((variant, index) => (
          <div className="form-group" key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <label className="form-label">{variant.name}</label>
            <B2BInput
              value={variant.value}
              className="form-input"
              onChange={(e) => handleVariantChange(index, 'value', e.target.value)}
              placeholder={variant.name}
            />
            <ActionIcon
              color="red"
              onClick={() => removeVariant(index)}
              title="Remove Variant"
              style={{ marginLeft: '10px' }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </div>
        ))}
      </form>
    </div>
  );
};

export default EnrichmentAttributes;
