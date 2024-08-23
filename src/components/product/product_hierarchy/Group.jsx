import React, { useEffect, useMemo, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import notify from '../../../utils/Notification';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import B2BModal from '../../../common/B2BModal';

const Group = () => {

    const initialData = {
        name: "",
        status: "ACTIVE"

    }

    const [group, setGroup] = useState(initialData);
    const[groups,setGroups]= useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
    const [deleteContent, setDeleteContent] = useState({});

    const [opened, { open, close }] = useDisclosure(false);


    const columns = useMemo(() => [
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
        },
        
        {
          header: 'Group Name',
          accessorKey: 'name',
          size: 120
        },
     
        {
          header: 'Status',
          accessorKey: 'status',
          size: 100,
        },
        {
          header: 'Actions',
          mantineTableHeadCellProps: {
            align: 'center'
          },
          mantineTableBodyCellProps: {
            align: 'center'
          },
          size: 100,
          Cell: ({ row }) => {
            const { original } = row;
            return (
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <IconPencil onClick={() => editGroup(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
                <IconTrash onClick={() => handleDeleteModal(original)} style={{ cursor: 'pointer', color: 'red' }} stroke={2} />
              </div>
            )
          }
        }
      ])

      const editGroup = (roleObj) => {
        setGroup((prev => ({ ...prev, ...roleObj })))
      }
    
      const handleDeleteModal = (roleObj) => {
        setDeleteContent(roleObj);
        open(true);
      }

    useEffect(() => {
        fetchGroups();
    }, [pagination.pageIndex, pagination.pageSize]);

    const addGroup = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post(`group/save`, { json: group }).json();
            setGroup(initialData);
            fetchGroups()
            notify({
                id: 'create_group',
                message: response.message,
                success: true,
                error: false
            })

        } catch (error) {
            notify({
                id: "add_group_error",
                message: error.message,
                success: false,
                error: true
            });
        }
    }


    const fetchGroups = async () => {
        try {
            const response = await B2B_API.get(`group/get-all-group?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
            console.log(response);
            
            setGroups(response?.response?.content);
            console.log(group);
            
            setRowCount(response?.response?.totalElements)
        } catch (error) {
            console.error('Failed to fetch groups:', error);
        }
    };



    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setGroup(prev => ({
          ...prev, [key]: key === 'name' ? value.toUpperCase() : value
        }));
      };

      const handleDelete = (name) => {
        console.log(name);
      }


      const DeleteModalContent = ({ body }) => {
        const { name, roleId } = body;
        return (
          <>
            <h4>Delete this Group {name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
              <B2BButton onClick={close} name={"No"} />
              <B2BButton color={'red'} onClick={() => handleDelete(name)} name={"Yes"} />
            </div>
          </>
        )
      }

   


    return (
        <>
        <div className='grid-container'>
        <form onSubmit={(event)=>addGroup(event)} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={group.name||''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Group Name"
            />
          </div>

          <div className="form-group status-container">
            <label className='form-label'>Status</label>
            <div className='radio-group'>
              <div className='status-block'>
                <input
                  type="radio"
                  value="ACTIVE"
                  onChange={(event) => handleChange(event, 'status')}
                  checked={group.status === "ACTIVE"}
                  name="status"
                  id="status-active"
                />
                <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
              </div>
              <div className='status-block'>
                <input
                  type="radio"
                  value="INACTIVE"
                  onChange={(event) => handleChange(event, 'status')}
                  checked={group.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setGroup(initialState)} name="Cancel" />
            <B2BButton type='submit' name={ "Save"} />
          </div>
        </form>
      </div>
      <B2BTableGrid
        columns={columns}
        data={groups}
        isLoading={isLoading}
        isError={isError}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        pagination={pagination}
        rowCount={rowCount}
        onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
      <B2BModal opened={opened} title={"Are You Sure ?"} children={<DeleteModalContent body={deleteContent} />} open={open} close={close} />
      </>
    )
}

export default Group