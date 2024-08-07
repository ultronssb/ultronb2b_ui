import ky from 'ky';
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useEffect, useMemo, useState } from "react";
import { B2B_API } from '../../api/Interceptor';
import B2BTableGrid from "../../common/B2BTableGrid";

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  //table state
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    fetchUsers();
    getAllUsers();
  }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters,])


  const getAllUsers = async () => {
    const response = await B2B_API.get('user/get-all');
    console.log(response, "response")
  }

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await ky.get(`https://api.escuelajs.co/api/v1/products?offset=${pagination.pageIndex}&limit=${pagination.pageSize}`).json()
      setData(response);
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
    }
    setIsError(false);
    setIsLoading(false);
  }


  const columns = useMemo(() => [
    {
      header: "Id",
      accessorKey: "id",
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center',
        flex: 1
      },
      mantineTableBodyCellProps: {
        align: 'center',
        flex: 1
      }
    },
    {
      header: "Title",
      accessorKey: "title",
      mantineTableHeadCellProps: {
        align: 'center',
        flex: 1
      },
      mantineTableBodyCellProps: {
        align: 'left',
        flex: 1
      }
    },
    {
      header: "Description",
      accessorKey: "description",
      size: 500,
      mantineTableHeadCellProps: {
        align: 'center',
        flex: 1
      },
      mantineTableBodyCellProps: {
        align: 'left',
        flex: 1
      }
    },
    {
      header: "Price",
      accessorKey: "price",
      mantineTableHeadCellProps: {
        align: 'center',
        flex: 1
      },
      mantineTableBodyCellProps: {
        align: 'center',
        flex: 1
      }
    },
    {
      header: "Category",
      accessorKey: 'categoryName',
      accessorFn : (row) => row.category?.name,
      mantineTableHeadCellProps: {
        align: 'left',
        flex: 1
      },
      mantineTableBodyCellProps: {
        align: 'left',
        flex: 1
      }
    }
  ], [])

  const onGlobalFilterChange = (data) => {

  }

  const onColumnFiltersChange = (filters) => {
    setColumnFilters(filters);
    console.log(columnFilters);
  };

  const onColumnFilterFnsChange = (data) => {

  }

  return (
    <>
      <B2BTableGrid
        data={data}
        pagination={pagination}
        columns={columns}
        manualFiltering={true}
        manualPagination={true}
        enableTopToolbar={true}
        isLoading={isLoading}
        isError={isError}
        pageCount={5}
        rowCount={100}
        onPaginationChange={setPagination}
        onColumnFiltersChange={onColumnFiltersChange}
        onColumnFilterFnsChange={onColumnFilterFnsChange}
        onGlobalFilterChange={onGlobalFilterChange}
        columnFilters={columnFilters}
        enableResizing={true}
        enableColumnActions={false}
      />
    </>
  )
}

export default Dashboard;