import React, { useState } from 'react'

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
  
  return (
    <div>OtherSettings</div>
  )
}

export default OtherSettings