import React, { useEffect, useState } from 'react'
import B2BButton from '../../../common/B2BButton'
import B2BDateInput from '../../../common/B2BDateInput'
import B2BInput from '../../../common/B2BInput'
import B2BSelect from '../../../common/B2BSelect'
import { currencies, TimeFormats } from '../../../utils/SettingsInput'
import { B2B_API } from '../../../api/Interceptor'
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
    console.log(otherSettings)
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
      type: 'input',
      label: 'Company',
      disabled: true,
      value: otherSettings.companyId,
      placeholder: "Company",
      inputType: 'text',
      required: true,
      // onChange: (event) => handleChange(event, "companyId")
    },
    {
      type: 'input',
      label: 'Currency',
      disabled: false,
      value: otherSettings.currency,
      placeholder: "Currency",
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "currency")
    },
    {
      type: 'input',
      label: 'Time Zone',
      disabled: false,
      required: true,
      value: otherSettings.timeZone,
      placeholder: "Time Zone",
      // data: TimeZones.map(timeZone => timeZone?.value),
      // inputType: 'select',
      inputType: 'text',
      onChange: (event) => handleChange(event, "timeZone")
    },
    {
      type: 'input',
      label: 'Symbol',
      disabled: false,
      value: otherSettings.symbol,
      placeholder: "Symbol",
      // data: currencies.map(currency => currency.value),
      // inputType: 'select',
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "symbol")
    },
    {
      type: 'input',
      label: 'Time Display',
      disabled: false,
      value: otherSettings.timeDisplay,
      placeholder: "Time Display",
      // data: TimeFormats,
      // inputType: 'select',
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "timeDisplay")
    },
    {
      type: 'input',
      label: 'Weight',
      disabled: false,
      value: otherSettings.weight,
      placeholder: "Weight",
      // data: ["Kilogram", "Gram", "Milligram"],
      // inputType: 'select',
      inputType: 'text',
      required: true,
      onChange: (event) => handleChange(event, "weight")
    },
    {
      type: 'input',
      label: 'Date Display',
      disabled: false,
      value: otherSettings.dateDisplay,
      required: true,
      placeholder: "Date Display",
      // data: dateFormats.map(date => date?.value),
      // inputType: 'select',
      inputType: 'text',
      onChange: (event) => handleChange(event, "dateDisplay")
    },
    {
      type: 'input',
      label: 'Size',
      disabled: false,
      value: otherSettings.size,
      placeholder: "Size",
      required: true,
      // data: clothMeasurementUnits,
      // inputType: 'select',
      inputType: 'text',
      onChange: (event) => handleChange(event, "size")
    }
  ]

  const regionsJson = [
    {
      type: 'input',
      label: 'Region Name',
      disabled: false,
      required: true,
      value: otherSettings.regionName,
      placeholder: "Region Name",
      inputType: 'text',
      onChange: (event) => handleChange(event, "regionName")
    },
    {
      type: 'input',
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
      type: 'input',
      label: 'SKU Code Seq.',
      disabled: false,
      required: true,
      value: otherSettings.skuCodeSeq,
      placeholder: "SKU Code Seq",
      inputType: 'text',
      onChange: (event) => handleChange(event, "skuCodeSeq")
    },
    {
      type: 'input',
      label: 'Varinat SKU',
      disabled: false,
      required: true,
      value: otherSettings.variantSKU,
      placeholder: "Variant",
      inputType: 'text',
      onChange: (event) => handleChange(event, "variantSKU")
    },
    {
      type: 'input',
      label: 'Sample MOQ',
      disabled: false,
      required: true,
      value: otherSettings.sampleMOQ,
      placeholder: "MOQ",
      inputType: 'text',
      onChange: (event) => handleChange(event, "sampleMOQ")
    },
    {
      type: 'input',
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
            (() => {
              switch (settings.inputType) {
                case 'date':
                  return <B2BDateInput
                    placeholder={settings.placeholder}
                    required={settings.required}
                    value={settings.value}
                    onChange={settings.onChange}
                  />
                case 'text':
                  return (
                    <B2BInput
                      value={settings.value}
                      className='form-input'
                      required={settings.required}
                      disabled={settings.disabled}
                      type={settings.type}
                      placeholder={settings.placeholder}
                      onChange={settings.onChange}
                    />
                  )
                case 'select':
                  return (
                    <B2BSelect
                      value={settings.value}
                      onChange={settings.onChange}
                      data={settings.data}
                      placeholder={settings.placeholder}
                    />
                  )
              }
            })()
          }
        </div>
      ))}
      {regionsJson.map((region, index) => (
        <div className="form-group" key={index}>
          <label className='form-label'>{region.label}</label>
          {
            (() => {
              switch (region.inputType) {
                case 'date':
                  return <B2BDateInput

                  />
                case 'text':
                  return (
                    <B2BInput
                      value={region.value}
                      className='form-input'
                      required={region.required}
                      disabled={region.disabled}
                      type={region.type}
                      placeholder={region.placeholder}
                      onChange={region.onChange}
                    />
                  )
                case 'select':
                  return (
                    <B2BSelect
                      value={region.value}
                      onChange={region.onChange}
                      data={region.data}
                      placeholder={region.placeholder}
                    />
                  )
              }
            })()
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