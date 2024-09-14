import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentAttributes = () => {
  const { handleChange, product } = useContext(EnrichProductContext);

  const fields = [
    {
      label: "Garment Type",
      key: "GarmentType",
      placeholder: "Enter Garment",
    },
    {
      label: "Weight",
      key: "Weight",
      placeholder: "Enter Weights",
    },
    {
      label: "Width",
      key: "Width",
      placeholder: "Enter Width",
    },
    {
      label: "Fabric Type",
      key: "FabricType",
      placeholder: "Enter Fabric",
    },
    {
      label: "Solid/Pattern",
      key: "Solid",
      placeholder: "Enter Solid/pattern",
    },
    {
      label: "Performance",
      key: "Performance",
      placeholder: "Enter Performance",
    },
  ];

  const handleSelectChange = (event, key) => {
    const { value } = event.target;
    handleChange(key, value);
  };

  return (
    <div>
      <form className='form-container'>
        <div className={"form-group"}>
          <label className='form-label'>Garment Types</label>
          <B2BInput
            value={""}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"Garment Type"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Weight</label>
          <B2BInput
            value={product?.metrics?.weight || ''}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"weight"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Width</label>
          <B2BInput
            value={product?.metrics?.width || ''}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"width"}
          />
        </div>

        <div className={"form-group"}>
          <label className='form-label'>Solid / Pattern</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"Solid"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Performance</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"Performance"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Fabric Type</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleSelectChange(event)}
            placeholder={"Fabric Type"}
          />
        </div>
      </form>
    </div>
  );
};

export default EnrichmentAttributes;
