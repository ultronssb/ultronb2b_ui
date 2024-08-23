import React, { useEffect, useMemo, useState } from 'react'
import B2BTableGrid from '../../../common/B2BTableGrid'
import { B2B_API } from '../../../api/Interceptor'
import GetCategory from './GetCategory'

const productHierarchy = () => {
  const [departments, setDepartments] = useState([])
  const [sections, setSections] = useState([])
  const [division, setDivision] = useState([])


  useEffect(() => {
    fetchDepartment()
    getAllDivision()
    getAllSection()

  }, [])

  const departmentColumns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    }, {
      header: 'ID',
      accessorKey: 'departmentId',
    },
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Description',
      accessorKey: 'description'
    },
    {
      header: 'Division',
      accessorKey: 'division.name'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    }
  ], [])

  const sectionColumns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    }, {
      header: 'ID',
      accessorKey: 'sectionId',
    },
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Description',
      accessorKey: 'description'
    },
    {
      header: 'Department',
      accessorKey: 'department.name'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    }
  ], [])

  const divisionColumns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    }, {
      header: 'ID',
      accessorKey: 'divisionId',
    },
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Description',
      accessorKey: 'description'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    }
  ], [])

  const fetchDepartment = async () => {
    try {
      const response = await B2B_API.get(`department`).json();
      setDepartments(response.response);
    } catch (err) {
      console.error("Failed to fetch Department", err);
    }
  }

  const getAllDivision = async () => {
    try {
      const res = await B2B_API.get(`division`).json();
      setDivision(res.response);
    } catch (err) {
      console.error("Failed to Fetch Division");
    }
  }

  const getAllSection = async () => {
    try {
      const res = await B2B_API.get(`section`).json();
      setSections(res.response);
    } catch (err) {
      console.error("Failed to Fetch Section", err)
    }
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '1rem 0.3rem' }} key={"divison"}>Category Details</h3>
      <GetCategory />

      <h3 style={{ margin: '1rem 0.3rem' }} key={"divison"}>Division</h3>
      <B2BTableGrid
        columns={divisionColumns}
        data={division}
        // isLoading={isLoading}
        // isError={isError}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        manualPagination={false}
        // pagination={pagination}
        rowCount={5}
        // onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
      <h3 style={{ margin: '1rem 0.3rem' }} key={"department"}>Department</h3>
      <B2BTableGrid
        columns={departmentColumns}
        data={departments}
        // isLoading={isLoading}
        // isError={isError}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        manualPagination={false}
        // pagination={pagination}
        rowCount={5}
        // onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
       <h3 style={{ margin: '1rem 0.3rem' }} key={"section"}>Section</h3>
      <B2BTableGrid
        columns={sectionColumns}
        data={sections}
        // isLoading={isLoading}
        // isError={isError}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        manualPagination={false}
        // pagination={pagination}
        rowCount={5}
        // onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
    </div>
  )
}

export default productHierarchy