import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';
import B2BSelect from '../../../common/B2BSelect';

const EnrichmentProduct = () => {

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
          <label className='form-label'>Brand</label>
          <B2BInput
            value={product.brand?.name}
            className='form-input'
            // onChange={(event) => handleChange(event, "brand.name")}
            placeholder={"Brand Name"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>UOM-Roll</label>
          <B2BInput
            value={product?.otherInformation?.unitOfMeasures?.isRoll}
            className='form-input'
            onChange={(event) => handleChange(event, "otherInformation.unitOfMeasures.isRoll")}
            placeholder={"UOM"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>UOM-KG</label>
          <B2BInput
            value={product?.otherInformation?.unitOfMeasures?.isKg}
            className='form-input'
            // onChange={(event) => handleChange(event,"otherInformation.unitOfMeasures.isKg")}
            placeholder={"UOM"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Sample MOQ</label>
          <B2BInput
            value={product?.otherInformation?.sampleMOQ || ''}
            className='form-input'
            onChange={(event) => handleChange(event, "otherInformation.sampleMOQ")}
            placeholder={"sampleMOQ"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Wholesale MOQ </label>
          <B2BInput
            value={product?.otherInformation?.purchaseMOQ || ''}
            className='form-input'
            onChange={(event) => handleChange(event, "otherInformation.purchaseMOQ")}
            placeholder={"purchaseMOQ"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Min Margin</label>
          <B2BInput
            value={product?.otherInformation?.minMargin || ''}
            className='form-input'
            onChange={(event) => handleChange(event, 'otherInformation.minMargin')}
            placeholder={"Min Margin"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Allow Loyalty</label>
          <B2BInput
            value={product?.otherInformation?.allowLoyalty || ''}
            className='form-input'
            onChange={(event) => handleChange(event, 'otherInformation.allowLoyalty')}
            placeholder={"Allow Loyalty"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Design Number</label>
          <B2BInput
            value={product?.designNumber}
            className='form-input'
            onChange={(event) => handleChange(event, "designNumber")}
            placeholder={"Design Number"}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentProduct