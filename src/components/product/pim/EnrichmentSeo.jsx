import React, { useContext } from 'react';
import B2BInput from '../../../common/B2BInput';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentSeo = () => {

  const { handleChange, product, pim} = useContext(EnrichProductContext);

  return (
    <div>
      <form className='form-container'>
        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Product URL</label>
          <B2BInput
            value={pim?.pimOtherInformation?.url || ''}
            className='form-input'
            onChange={(event) => handleChange(event,'url')}
            placeholder={"Product URL"}
          />
        </div>

        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Product Slug</label>
          <B2BInput
            value={pim?.pimOtherInformation?.productSlug || ''}
            className='form-input'
            onChange={(event) => handleChange(event,'productSlug')}
            placeholder={"Product Slug"}
          />
        </div>

        <div style={{display:'flex',textAlign:'left',alignItems:'baseline'}}>
          <label className='form-label'>Page Title</label>
          <B2BInput
            value={pim?.pageTitle}
            className='form-input'
            onChange={(event) => handleChange(event,"pageTitle")}
            placeholder={"Page Title"}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <label className='form-label'>Meta Description</label>
          <textarea
            value={pim?.pimOtherInformation?.metaDescription}
            className='form-input-textarea'
            onChange={(event) => handleChange(event, 'metaDescription')}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentSeo