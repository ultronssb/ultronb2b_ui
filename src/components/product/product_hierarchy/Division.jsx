import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import '../../../css/formstyles/Formstyles.css';
import B2BButton from '../../../common/B2BButton';
import { Link, useNavigate } from 'react-router-dom';

const Division = () => {
  const initialState = {
    divisionId: "",
    name: "",
    image: "",
    description: "",
    createdDate: "",
    status: "ACTIVE"
  }

  const [division, setDivision] = useState(initialState);
  const [divisions, setDivisions] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetchDivision();
  }, [])

  const fetchDivision = async () => {
    try {
      const res = await B2B_API.get(`division`).json();
      setDivisions(res);
      console.log(res, "div");

    }
    catch (error) {
      console.error("Failed to Fetch  Division", error)
    }
  }
  const addDivision = async (event) => {
    try {
      event?.preventDefault();
      const value = await B2B_API.post(`division`, { json: division }).json();
      fetchDivision();
      setDivision(initialState);
    }
    catch (error) {
      console.error("Failed to Add Division")
    }
  }

  const handleChange = (event, key) => {
    setDivision((prev) => (
      { ...prev, [key]: event.target.value }
    ))
  }


  const json = [
    {
      label: "Division Id",
      value: division.divisionId,
      onChange: (event) => handleChange(event, "divisionId"),
      style: { cursor: 'not-allowed' },
      disabled: true,
      type: "text",
      placeholder: "Division ID"
    },
    {
      label: "Division Name",
      value: division.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Division Name"
    },
    {
      label: "Description",
      value: division.description,
      onChange: (event) => handleChange(event, "description"),
      type: "text",
      placeholder: "Description"
    },
    {
      label: "Status",
      value: division.status,
      onChange: (event) => handleChange(event, "status"),
      type: "radio",
      className: "form-group status-container",
      placeholder: "Status",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" }
      ]
    }
  ]

  return (
    <div className='grid-container'>
      <form onSubmit={(event) => addDivision(event)} className='form-container'>
        {json.map(e => (
          <div className={e.className ? e.className : "form-group"}>
            <label className='form-label'>{e.label}</label>
            {e.type == "radio" ? (
              <div className='radio-label-block'>
                {e.options.map((option, idx) => (
                  <div className='radio-group'>
                    <div className='status-block'>
                      <input
                        id={`${e.name}-${option.value.toLowerCase()}`}
                        value={option.value}
                        style={e.style && e.style}
                        onChange={(event) => e.onChange(event, e.name)}
                        checked={e.value === option.value}
                        type={e.type}
                        placeholder={e.placeholder}
                      />
                      <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`}>{option.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            )
              : <input
                value={e.value}
                className='form-input'
                style={e.style}
                disabled={e.disabled}
                onChange={e.onChange}
                type={e.type}
                required={e.required}
                placeholder={e.placeholder}
              />
            }

          </div>
        ))}
        <div className='save-button-container'>
          <B2BButton type='submit' name="Save & New" />
          <B2BButton type='submit' name="Save"/>
        </div>
      </form>
    </div>
  )
}

export default Division