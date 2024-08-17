import React, { useEffect, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import { every } from 'lodash';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect';

const Department = () => {
  const initialData = {
    departmentId: "",
    name: "",
    description: "",
    createdDate: "",
    status: "ACTIVE",
    divisionId: ""
  }
  const [department, setDepartment] = useState(initialData);
  const [departments, setDepartments] = useState([]);
  const [division, setDivision] = useState([]);

  useEffect(() => {
    fetchDepartment();
    getAllDivision();
  }, [])

  const fetchDepartment = async () => {
    try {
      const response = await B2B_API.get(`department`).json();
      setDepartments(response);
    } catch (err) {
      console.error("Failed to fetch Department", err);
    }
  }

  const addDepartment = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`department`, { json: department }).json();
      fetchDepartment();
      setDepartment(initialData);
    } catch (err) {
      console.error("Failed to add Department", err);
    }
  }
  const handleChange = (event, key) => {
    setDepartment((prev) => ({
      ...prev, [key]: key === "divisionId" ? event : event.target.value
    }))
  }

  const getAllDivision = async () => {
    try {
      const res = await B2B_API.get(`division`).json();
      setDivision(res.response);
    } catch (err) {
      console.error("Failed to Fetch Division");
    }
  }

  const json = [
    {
      label: "Department Id",
      value: department.departmentId,
      onChange: (event) => handleChange(event, "departmentId"),
      style: { cursor: 'not-allowed' },
      disabled: true,
      type: "text",
      placeholder: "Department ID"
    },
    {
      label: "Department Name",
      value: department.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Department Name"
    },
    {
      label: "Description",
      value: department.description,
      onChange: (event) => handleChange(event, "description"),
      type: "text",
      placeholder: "Description"
    },
    {
      label: "Status",
      value: department.status,
      onChange: (event) => handleChange(event, "status"),
      type: "radio",
      className: "form-group status-container",
      placeholder: "Status",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" }
      ]
    },
    {
      label: "Division",
      value: department.divisionId,
      onChange: (event) => handleChange(event, "divisionId"),
      type: "select",
      placeholder: "Division"
    }
  ]

  const renderContent = (e) => {
    switch (e.type) {
      case 'radio':
        return <div className='radio-label-block'>
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

      case 'text':
        return <input
          value={e.value}
          className='form-input'
          style={e.style}
          disabled={e.disabled}
          onChange={e.onChange}
          type={e.type}
          data={division.map(d => ({ label: d.name, value: d.divisionId }))}
          required={e.required}
          placeholder={e.placeholder}
        />

      case 'select':
        return <B2BSelect
          styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
          value={department.divisionId}
          data={division.map(r => ({ label: r.name, value: r.divisionId }))}
          required={true}
          clearable={division.length > 0 ? true : false}
          onChange={(value) => handleChange(value, "divisionId")}
          placeholder={"Select Division"}
        />
    }
  }



  return (
    <div className='grid-container'>
      <form onSubmit={(event) => addDepartment(event)} className='form-container'>
        {json.map(e => (
          <div className={e.className ? e.className : "form-group"}>
            <label className='form-label'>{e.label}</label>
            {renderContent(e)}
          </div>
        ))}
        <div className='save-button-container'>
          <B2BButton type='submit' name="Save & New" />
          <B2BButton type='submit' name="Save" />
        </div>
      </form>
    </div>
  )
}

export default Department