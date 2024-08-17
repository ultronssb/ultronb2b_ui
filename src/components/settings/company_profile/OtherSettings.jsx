import React, { useMemo, useState } from 'react'
import B2BInput from '../../../common/B2BInput'
import B2BButton from '../../../common/B2BButton'

const OtherSettings = () => {

  const initialState = {
    otherSettingId: '',
    currency: '',
    symbol: '',
    weight: '',
    size: '',
    timeZone: '',
    timeDisplay: '',
    dateDisplay: '',
    regionName: '',
    displayPrice: '',
    skuCodeSeq: '',
    companyId: '',
  }

  const [otherSettings, setOtherSettings] = useState(initialState)

  const handleChange = (event, key) => {
    setOtherSettings((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleCreateSettings = (event) => {
    event.preventDefault();

  }

  const otherSettingsJson = [
    {
      type: 'input',
      label: 'Currency',
      disabled: false,
      value: otherSettings.currency,
      placeholder: "Currency",
      inputType: 'text',
      onChange: (event) => handleChange(event, "currency")
    },
    {
      type: 'input',
      label: 'Time Zone',
      disabled: false,
      value: otherSettings.timeZone,
      placeholder: "Time Zone",
      inputType: 'text',
      onChange: (event) => handleChange(event, "timeZone")
    },
    {
      type: 'input',
      label: 'Symbol',
      disabled: false,
      value: otherSettings.symbol,
      placeholder: "Symbol",
      inputType: 'text',
      onChange: (event) => handleChange(event, "symbol")
    },
    {
      type: 'input',
      label: 'Time Display',
      disabled: false,
      value: otherSettings.timeDisplay,
      placeholder: "Time Display",
      inputType: 'text',
      onChange: (event) => handleChange(event, "timeDisplay")
    },
    {
      type: 'input',
      label: 'Weight',
      disabled: false,
      value: otherSettings.weight,
      placeholder: "Weight",
      inputType: 'text',
      onChange: (event) => handleChange(event, "weight")
    },
    {
      type: 'input',
      label: 'Date Display',
      disabled: false,
      value: otherSettings.dateDisplay,
      placeholder: "Date Display",
      inputType: 'date',
      onChange: (event) => handleChange(event, "dateDisplay")
    },
    {
      type: 'input',
      label: 'Size',
      disabled: false,
      value: otherSettings.size,
      placeholder: "Size",
      inputType: 'text',
      onChange: (event) => handleChange(event, "size")
    }
  ]

  const regionsJson = [
    {
      type: 'input',
      label: 'Region Name',
      disabled: false,
      value: otherSettings.regionName,
      placeholder: "Region Name",
      inputType: 'text',
      onChange: (event) => handleChange(event, "regionName")
    },
    {
      type: 'input',
      label: 'Display Price',
      disabled: false,
      value: otherSettings.displayPrice,
      placeholder: "Display Price",
      inputType: 'text',
      onChange: (event) => handleChange(event, "displayPrice")
    },
    {
      type: 'input',
      label: 'SKU Code Seq.',
      disabled: false,
      value: otherSettings.skuCodeSeq,
      placeholder: "SKU Code Seq",
      inputType: 'text',
      onChange: (event) => handleChange(event, "skuCodeSeq")
    }
  ]
  
  return (
    <form onSubmit={handleCreateSettings} className='form-container'>
      {otherSettingsJson.map(settings => (
        <div className="form-group">
          <label className='form-label'>{settings.label}</label>
          <B2BInput
            value={settings.value}
            className='form-input'
            required={settings.required}
            disabled={settings.disabled}
            type={settings.type}
            placeholder={settings.placeholder}
            onChange={settings.onChange}
          />
        </div>
      ))}
      {regionsJson.map(region => (
        <div className="form-group">
          <label className='form-label'>{region.label}</label>
          <B2BInput
            value={region.value}
            className='form-input'
            required={region.required}
            disabled={region.disabled}
            type={region.type}
            placeholder={region.placeholder}
            onChange={region.onChange}
          />
        </div>
      ))}
      <div className='save-button-container' style={{ paddingBlock: '2rem', paddingInline: 0, justifyContent: 'center', alignItems: 'center' }}>
        <B2BButton type='button' name={"Cancel"} color={"red"} />
        <B2BButton type='submit' name={otherSettings.otherSettingId ? "Update" : "Save"} />
      </div>
    </form>
  )
}

export default OtherSettings