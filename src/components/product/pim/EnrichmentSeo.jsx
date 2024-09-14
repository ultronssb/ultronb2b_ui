import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentSeo = () => {

  const { handleChange, product } = useContext(EnrichProductContext);

  return (
    <div>
      <form className='form-container'>
        <div className={"form-group"}>
          <label className='form-label'>Product URL</label>
          <B2BInput
            value={product?.otherinformation?.url}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Product URL"}
          />
        </div>

        <div className={"form-group"}>
          <label className='form-label'>Product Slug</label>
          <B2BInput
            value={product?.otherinformation?.productSlug}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Product Slug"}
          />
        </div>

        <div className={"form-group"}>
          <label className='form-label'>Page Title</label>
          <B2BInput
            value={""}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Page Title"}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <label className='form-label'>Meta Description</label>
          <textarea
            value={product?.otherinformation?.metaDescription || ''}
            className='form-input-textarea'
            onChange={(event) => handleChange(event, 'metaDescription')}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentSeo