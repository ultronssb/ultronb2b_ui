import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentSeo = () => {

  const { handleChange, product } = useContext(EnrichProductContext);

  return (
    <div>
      <form className='form-container'>
        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Product URL</label>
          <B2BInput
            value={product?.otherInformation?.url || ''}
            className='form-input'
            onChange={(event) => handleChange(event,'otherInformation.url')}
            placeholder={"Product URL"}
          />
        </div>

        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Product Slug</label>
          <B2BInput
            value={product?.otherInformation?.productSlug || ''}
            className='form-input'
            onChange={(event) => handleChange(event,'otherInformation.productSlug')}
            placeholder={"Product Slug"}
          />
        </div>

        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Page Title</label>
          <B2BInput
            value={product?.pageTitle}
            className='form-input'
            onChange={(event) => handleChange(event,"pageTitle")}
            placeholder={"Page Title"}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <label className='form-label'>Meta Description</label>
          <textarea
            value={product.otherInformation?.metaDesc}
            className='form-input-textarea'
            onChange={(event) => handleChange(event, 'otherInformation.metaDesc')}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentSeo