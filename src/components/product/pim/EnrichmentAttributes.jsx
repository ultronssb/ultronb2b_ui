import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentAttributes = () => {
  const { handleChange, product } = useContext(EnrichProductContext);

  return (
    <div>
      <form className='form-container'>
        <div className={"form-group"}>
          <label className='form-label'>Weight</label>
          <B2BInput
            value={product?.metrics?.weight || ''}
            className='form-input'
            // onChange={(event) => handleChange(event,"metrics.weight")}
            placeholder={"weight"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Width</label>
          <B2BInput
            value={product?.metrics?.width || ''}
            className='form-input'
            // onChange={(event) => handleChange(event,"metrics.width")}
            placeholder={"width"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Garment Types</label>
          <B2BInput
            value={""}
            className='form-input'
            onChange={(event) => handleChange(event,"garmenType")}
            placeholder={"Garment Type"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Solid / Pattern</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleChange(event,"solidOrPattern")}
            placeholder={"Solid"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Performance</label>
          <B2BInput
            value={product?.performance}
            className='form-input'
            onChange={(event) => handleChange(event,"performance")}
            placeholder={"Performance"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Fabric Type</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleChange(event,"fabricType")}
            placeholder={"Fabric Type"}
          />
        </div>
      </form>
    </div>
  );
};

export default EnrichmentAttributes;
