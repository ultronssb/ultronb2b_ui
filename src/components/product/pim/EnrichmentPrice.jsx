import React, { useContext } from 'react'
import B2BInput from '../../../common/B2BInput'
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentPrice = () => {
  const { handleChange,product } = useContext(EnrichProductContext);
  const json = [
    {
      label: "HSN Code",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter HSN",
      onChange: (event) => handleChange(event, "hsn")
    },
    {
      label: "Tax",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Tax",
      onChange: (event) => handleChange(event, "Tax")
    },
    {
      label: "Cost Price",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Cost Price",
      onChange: (event) => handleChange(event, "Cost Price")
    },
    {
      label: "MRP",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter MRP",
      onChange: (event) => handleChange(event, "MRP")
    },
    {
      label: "WSP",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter WSP",
      onChange: (event) => handleChange(event, "WSP")
    },
    {
      label: "Channel Price",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Channel Price",
      onChange: (event) => handleChange(event, "Channel Price")
    },
    {
      label: "Discount",
      value: "",
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Discount",
      onChange: (event) => handleChange(event, "Discount")
    },
  ]
  return (
    <div>
      <form className='form-container'>
        <div className={"form-group"}>
          <label className='form-label'>Tax</label>
          <B2BInput
            value={product?.gst?.name|| ''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Tax"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Cost Price</label>
          <B2BInput
            value={product?.priceSetting?.costPrice|| ''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Cost Price"}
          />
        </div>

        <div className={"form-group"}>
          <label className='form-label'>MRP</label>
          <B2BInput
            value={product?.priceSetting?.mrp||''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"MRP"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>WSP</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"WSP"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Channel Price</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Channel Price"}
          />
        </div>
        <div className={"form-group"}>
          <label className='form-label'>Discount</label>
          <B2BInput
            value={''}
            className='form-input'
            onChange={(event) => handleChange(event)}
            placeholder={"Discount"}
          />
        </div>
      </form>
    </div>
  )
}

export default EnrichmentPrice