import React, { useEffect, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor'
import B2BButton from '../../../common/B2BButton'
import B2BInput from '../../../common/B2BInput'
import B2BSelect from '../../../common/B2BSelect'
import notify from '../../../utils/Notification'

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
    variantSKU: '',
    wholesaleMOQ: '',
    sampleMOQ: '',
  }

  const [otherSettings, setOtherSettings] = useState(initialState)


  useEffect(() => {
    // fetchCompanies();
    getSettings()
  }, [])

  const fetchCompanies = async () => {
    const response = await B2B_API.get('company/get-all').json();
    const company = response?.response[0]
    if (company) {
      setOtherSettings((prev) => ({ ...prev, companyId: company.companyId }))
    }
  }

  const getSettings = async () => {
    const response = await B2B_API.get('settings').json();
    if (response.response)
      setOtherSettings(response.response)
  }


  // const checkEventValue = (key) => {
  //   if (key === 'dateDisplay' || key === "displayPrice" || key === "timeDisplay" || key === "weight" || key === "size" || key === "timeZone" || key === "dateDisplay" || key === "symbol") {
  //     return true
  //   }
  // }

  const handleChange = (event, key) => {
    setOtherSettings((prev) => ({ ...prev, [key]: event?.target?.value }))
  }

  const handleCreateSettings = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post('settings/save', { json: otherSettings }).json()
      notify({
        title: 'Success!!',
        message: response?.message || 'Setting Update Successfully.',
        error: false,
        success: true,
      })
    } catch (err) {
      notify({
        title: 'Error!!',
        message: err?.response?.message || 'Failed to update Setting.',
        error: true,
        success: false,
      })
      console.error(err);
    }
  }

  const otherSettingsJson = [
    {
      label: 'Company',
      disabled: true,
      value: otherSettings.companyId,
      placeholder: "Company",
      inputType: 'text',
      required: true,
    },
    {
      label: 'Currency',
      disabled: false,
      value: otherSettings.currency,
      placeholder: "Currency",
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "currency")
    },
    {
      label: 'Time Zone',
      disabled: false,
      required: true,
      value: otherSettings.timeZone,
      placeholder: "Time Zone",
      inputType: 'text',
      onChange: (event) => handleChange(event, "timeZone")
    },
    {
      label: 'Symbol',
      disabled: false,
      value: otherSettings.symbol,
      placeholder: "Symbol",
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "symbol")
    },
    {
      label: 'Time Display',
      disabled: false,
      value: otherSettings.timeDisplay,
      placeholder: "Time Display",
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "timeDisplay")
    },
    {
      label: 'Weight',
      disabled: false,
      value: otherSettings.weight,
      placeholder: "Weight",
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "weight")
    },
    {
      label: 'Date Display',
      disabled: false,
      value: otherSettings.dateDisplay,
      required: true,
      placeholder: "Date Display",
      inputType: 'text',
      onChange: (event) => handleChange(event, "dateDisplay")
    },
    {
      label: 'Size',
      disabled: false,
      value: otherSettings.size,
      placeholder: "Size",
      required: true,
      inputType: 'text',
      onChange: (event) => handleChange(event, "size")
    },
    {
      label: 'Region Name',
      disabled: false,
      required: true,
      value: otherSettings.regionName,
      placeholder: "Region Name",
      inputType: 'text',
      onChange: (event) => handleChange(event, "regionName")
    },
    {
      label: 'Display Price',
      disabled: false,
      required: true,
      value: otherSettings.displayPrice,
      placeholder: "Display Price",
      data: ["Inclusive of Tax", "Exclusive of Tax"],
      inputType: 'select',
      onChange: (event) => handleChange(event, "displayPrice")
    },
    {
      label: 'SKU Code Seq.',
      disabled: false,
      required: true,
      value: otherSettings.skuCodeSeq,
      placeholder: "SKU Code Seq",
      inputType: 'text',
      onChange: (event) => handleChange(event, "skuCodeSeq")
    },
    {
      label: 'Varinat SKU',
      disabled: false,
      required: true,
      value: otherSettings.variantSKU,
      placeholder: "Variant",
      inputType: 'text',
      onChange: (event) => handleChange(event, "variantSKU")
    },
    {
      label: 'Sample MOQ',
      disabled: false,
      required: true,
      value: otherSettings.sampleMOQ,
      placeholder: "MOQ",
      inputType: 'text',
      onChange: (event) => handleChange(event, "sampleMOQ")
    },
    {
      label: 'Wholesale MOQ',
      disabled: false,
      required: true,
      value: otherSettings.wholesaleMOQ,
      placeholder: "MOQ",
      inputType: 'text',
      onChange: (event) => handleChange(event, "wholesaleMOQ")
    },
  ]

  return (
    <form onSubmit={handleCreateSettings} className='form-container'>
      {otherSettingsJson.map((settings, index) => (
        <div className="form-group" key={index}>
          <label className='form-label'>{settings.label}</label>
          {
            settings.inputType === 'text' && (
              <B2BInput
                value={settings.value}
                className='form-input'
                required={settings.required}
                disabled={settings.disabled}
                type={settings.inputType}
                placeholder={settings.placeholder}
                onChange={settings.onChange}
              />
            )
          }
          {
            settings.inputType === 'select' && (
              <B2BSelect
                value={settings.value}
                onChange={settings.onChange}
                data={settings.data}
                placeholder={settings.placeholder}
              />
            )
          }
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