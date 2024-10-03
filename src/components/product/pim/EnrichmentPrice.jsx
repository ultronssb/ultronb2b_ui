import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentPrice = () => {
  const { handleChange, product, pim } = useContext(EnrichProductContext);

  return (
    <div>
      <form className='form-container'>
        <div className={"form-group"}>
          <label className='form-label'>Tax</label>
          <B2BInput
            value={product?.gst?.name || ''}
            className='form-input'
            // onChange={(event) => handleChange(event,"gst.name")}
            placeholder={"Tax"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Cost Price</label>
          <B2BInput
            value={product?.priceSetting?.costPrice || ''}
            className='form-input'
            // onChange={(event) => handleChange(event,"priceSetting.costPrice")}
            placeholder={"Cost Price"}
            edit={true}
          />
        </div>

        <div className={"form-group"}>
          <label className='form-label'>MRP</label>
          <B2BInput
            value={product?.priceSetting?.mrp || ''}
            className='form-input'
            // onChange={(event) => handleChange(event,"priceSetting.mrp")}
            placeholder={"MRP"}
            edit={true}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>WSP</label>
          <B2BInput
            value={pim?.wsp}
            className='form-input'
            onChange={(event) => handleChange(event, "wsp")}
            placeholder={"WSP"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Channel Price</label>
          <B2BInput
            value={pim?.channelPrice}
            className='form-input'
            onChange={(event) => handleChange(event, "channelPrice")}
            placeholder={"Channel Price"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Discount</label>
          <B2BInput
            value={pim?.discount}
            className='form-input'
            onChange={(event) => handleChange(event, "discount")}
            placeholder={"Discount"}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentPrice