import { getCoreRowModel, getExpandedRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'


const B2BTableGrid = ({data, columns, sorting}) => {

    const table = useReactTable({
        data: data,
        columns : columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

  return (
    <table>
        <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id}>{row.name}</tr>
            ))}
        </tbody>
    </table>
  )
}

export default B2BTableGrid