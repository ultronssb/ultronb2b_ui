import { ActionIcon, Button, Modal, TextInput } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import React, { useContext, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentAttributes = () => {
  const { handleChange, product, pim, setPim } = useContext(EnrichProductContext);
  const [opened, setOpened] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [variantValue, setVariantValue] = useState('');

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const addVariant = () => {
    const updatedVariants = [
      ...(pim.variants || []), // Use empty array if variants is undefined
      { name: variantName, value: variantValue },
    ];

    setPim((prevPim) => ({
      ...prevPim,
      variants: updatedVariants,
    }));

    setVariantName('');
    setVariantValue('');
    close();
  };

  const removeVariant = (indexToRemove) => {
    const updatedVariants = (pim.variants || []).filter((_, index) => index !== indexToRemove);
    setPim((prevPim) => ({
      ...prevPim,
      variants: updatedVariants,
    }));
  };

  const handleVariantChange = (index, value) => {
    const updatedVariants = [...(pim.variants || [])];
    updatedVariants[index].value = value;

    setPim((prevPim) => ({
      ...prevPim,
      variants: updatedVariants,
    }));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={open}>Add Variant</Button>
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
            value={pim?.performance}
            className="form-input"
            onChange={(event) => handleChange(event, "performance")}
            placeholder={"Performance"}
          />
        </div>

        {(pim.variants || []).map((variant, index) => ( // Use empty array if variants is undefined
          <div className="form-group" key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <label className="form-label">{variant.name}</label>
            <B2BInput
              value={variant.value}
              className="form-input"
              onChange={(e) => handleVariantChange(index, e.target.value)}
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
