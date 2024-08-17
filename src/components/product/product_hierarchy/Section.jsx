import React, { useEffect, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import B2BButton from '../../../common/B2BButton';

const Section = () => {

  const initialData = {
    sectionId: "",
    name: "",
    description: "",
    createdDate: "",
    status: "ACTIVE",
    departmentId: ""
  }

  const [section, setSection] = useState(initialData);
  const [sections, setSections] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getAllSection();
    getAllDepartment();
  }, [])

  const getAllSection = async () => {
    try {
      const res = await B2B_API.get(`section`).json();
      setSections(res);
    } catch (err) {
      console.error("Failed to Fetch Section", err)
    }
  }

  const addSection = async (event) => {
    event.preventDefault();
    try {
      const res = await B2B_API.post(`section`, { json: section }).json();
      getAllSection();
      setSection(initialData);
    } catch (err) {
      console.error("Failed to add Section", err)
    }
  }

  const handleChange = (event, key) => {
    setSection((prev) => ({
      ...prev, [key]: key === "departmentId" ? event : event.target?.value
    }))
  }

  const getAllDepartment = async () => {
    try {
      const res = await B2B_API.get(`department`).json();
      setDepartments(res.response);
    } catch (err) {
      console.error("Failed to Fetch Department")
    }
  }

  const json = [
    {
      label: "Section Id",
      value: section.sectionId,
      onChange: (event) => handleChange(event, "SectionId"),
      style: { cursor: 'not-allowed' },
      disabled: true,
      type: "text",
      placeholder: "Section ID"
    },
    {
      label: "Section Name",
      value: section.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Section Name"
    },
    {
      label: "Description",
      value: section.description,
      onChange: (event) => handleChange(event, "description"),
      type: "text",
      placeholder: "Description"
    },
    {
      label: "Status",
      value: section.status,
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
      label: "Department",
      value: departments.departmentId,
      onChange: (event) => handleChange(event, "departmentId"),
      type: "select",
      placeholder: "Department"
    }
  ]

  const renderContent = (e) => {
    switch (e.type) {
      case "text":
        return <input
          value={e.value}
          className='form-input'
          style={e.style}
          disabled={e.disabled}
          onChange={e.onChange}
          type={e.type}
          data={departments.map(d => d?.name)}
          required={e.required}
          placeholder={e.placeholder}
        />

      case "radio":
        return <div className='radio-label-block'>
          {e.options.map((option) => (
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

      case "select":
        return <B2BSelect
          styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
          value={section.departmentId}
          data={departments.map(r => ({ label: r?.name, value: r.departmentId }))}
          required={true}
          clearable={departments.length > 0 ? true : false}
          onChange={(value) => handleChange(value, "departmentId")}
          placeholder={"Select DepartmentId"}
        />
    }
  }

  return (
    <div className='grid-container'>
      <form onSubmit={(event) => addSection(event)} className='form-container'>
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

export default Section