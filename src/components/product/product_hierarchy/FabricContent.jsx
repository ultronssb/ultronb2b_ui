import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@mantine/core';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import './FabricContent.css';

const FabricContent = () => {
  const initialData = {
    value: "",
    composition: {},
    status: "ACTIVE",
    totalProductPercent: ''
  };

  const [fabricCode, setFabricCode] = useState(initialData);
  const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [], value: null }]);
  const [isFabricCode, setIsFabricCode] = useState(false);
  const [fabricCodeList, setFabricCodeList] = useState([]);
  const [fabricCategory, setFabricCategory] = useState([]);
  const [lastChild, setLastChild] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [inputError, setInputError] = useState({
    fabricContentError: false,
    fabricContentErrorMessage: '',
    fabricCompositionError: false,
    fabricCompositionErrorMessage: '',
  });
  const [totalPercent, setTotalPercent] = useState(fabricCode?.totalProductPercent || 0);
  const [fCCValue, setFCCValue] = useState('');

  useEffect(() => {
    fetchAllFabricCodes();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchAllFabricCodes = async () => {
    try {
      setIsLoading(true);
      const res = await B2B_API.get(`fabric/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = res?.response?.content || [];
      setRowCount(res?.response?.totalElements || 0);
      setFabricCodeList(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_varients",
        error: true,
        success: false,
        title: error?.message || 'Error fetching variants',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fabricCategory) {
      const emptyNodes = findEmptyChildNodes(fabricCategory);
      setLastChild(emptyNodes);
    }
  }, [fabricCategory]);

  useEffect(() => {
    fetchFabricCodeCategory();
  }, []);

  const fetchFabricCodeCategory = async () => {
    try {
      const res = await B2B_API.get('product-category').json();
      const categories = res.response;
      const category = categories.find(cat => cat.name === 'Fabric Content');
      setFabricCategory(category);
      setSelectedPairsFromProduct();
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const setSelectedPairsFromProduct = () => {
    const keys = Object.keys(fabricCode?.composition);
    if (_.size(keys) > 0) {
      setSelectedPairs(_.map(keys, key => ({
        key,
        value: fabricCode?.composition[key]
      })));
    }
  };

  const findEmptyChildNodes = (node) => {
    const result = [];
    const traverse = (node) => {
      if (node && node.child && node.child.length === 0) {
        result.push(node);
      }
      if (node && node.child) {
        node.child.forEach(traverse);
      }
    };
    traverse(node);
    return result;
  };

  const fabricContentCode = async (newPairs) => {
    try {
      const results = await Promise.all(
        Object.entries(newPairs).map(async ([key, value]) => {
          const res = await B2B_API.get(`product-category/category/${key}`).json();
          const name = res.response.name;
          const fcc = name.substring(0, 3).toUpperCase();
          return `${fcc}-${value}%`;
        })
      );
      const formattedFCC = results.join(' ');
      setFabricCode(prevState => ({
        ...prevState,
        composition: {
          ...prevState.composition,
        }
      }));
      setFCCValue(formattedFCC);
    } catch (error) {
      console.error("Error fetching category data: ", error);
    }
  };


  const validateInput = () => {
    let isValid = true;
    const errors = {
      fabricContentError: false,
      fabricContentErrorMessage: '',
      fabricCompositionError: false,
      fabricCompositionErrorMessage: '',
    };
    const isFabricContentValid = fabricCode?.composition &&
      Object.keys(fabricCode.composition).length > 0 &&
      Object.values(fabricCode.composition).every(value => value > 0);
    if (!isFabricContentValid) {
      errors.fabricContentError = true;
      errors.fabricContentErrorMessage = "Fabric Composition must be selected!";
      isValid = false;
    }
    if (totalPercent !== 100) {
      errors.fabricCompositionError = true;
      errors.fabricCompositionErrorMessage = "Overall composition percentage must be 100.";
      isValid = false;
    }
    setInputError(errors);
    return isValid;
  };

  const handleSelectChange = (index, selectedValue) => {
    const newPairs = [...selectedPairs];
    const oldKey = newPairs[index].key;
    const oldValue = parseInt(newPairs[index].value, 10) || 0;
    if (!selectedValue) {
      newPairs[index].value = 0;
      setInputError({
        fabricContentError: false,
        fabricContentErrorMessage: '',
      });
    }
    newPairs[index].key = selectedValue || '';
    const newValue = selectedValue ? newPairs[index].value : 0;
    const updatedTotal = totalPercent - oldValue + newValue;
    setTotalPercent(updatedTotal);
    setSelectedPairs(newPairs);
    setFabricCode(prevState => {
      const updatedComposition = { ...prevState.composition };
      if (oldKey && oldKey !== selectedValue) {
        delete updatedComposition[oldKey];
      }
      if (selectedValue) {
        updatedComposition[selectedValue] = newValue || 0;
      }
      return {
        ...prevState,
        totalProductPercent: updatedTotal,
        composition: updatedComposition
      };
    });
    const pairsObject = newPairs.reduce((acc, pair) => {
      if (pair.key && pair.value) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {});
    fabricContentCode(pairsObject);
  };

  const handleMultiSelectChange = (index, event) => {
    const value = event.target.value;
    const newPairs = [...selectedPairs];
    const key = newPairs[index].key;
    const previousValue = parseInt(newPairs[index].value, 10) || 0;
    if (key) {
      newPairs[index].value = value;
      setSelectedPairs(newPairs);
      let updatedTotal = totalPercent;
      if (value) {
        updatedTotal = totalPercent - previousValue + parseInt(value, 10);
      } else {
        updatedTotal = totalPercent - previousValue;
      }
      if (updatedTotal > 100 && value) {
        setInputError({
          fabricContentError: true,
          fabricContentErrorMessage: 'Total product percentage cannot exceed 100%',
        });
      } else {
        setInputError({
          fabricContentError: false,
          fabricContentErrorMessage: '',
        });
      }
      setTotalPercent(updatedTotal);
      setFabricCode(prevState => ({
        ...prevState,
        totalProductPercent: updatedTotal,
        composition: {
          ...prevState.composition,
          [key]: value || '',
        }
      }));
      const pairsObject = newPairs.reduce((acc, pair) => {
        if (pair.key && pair.value) {
          acc[pair.key] = pair.value;
        }
        return acc;
      }, {});
      fabricContentCode(pairsObject);
    }
  };

  const keyToNameMap = lastChild.reduce((map, item) => {
    map[item.categoryId] = item.name;
    return map;
  }, {});

  const getAvailableKeys = (currentIndex) => {
    const selectedKeys = selectedPairs.map(pair => pair.key);
    return Object.keys(keyToNameMap).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
  };

  const addGroup = () => {
    const totalSum = _.sumBy(selectedPairs, (item) => parseInt(item.value) || 0);
    if (totalSum < 100) {
      setSelectedPairs([...selectedPairs, { key: '', value: '' }]);
      setInputError({ fabricContentError: false, fabricCompositionError: false });
    }
  };

  const removeGroup = (index) => {
    const newPairs = [...selectedPairs];
    const removedKey = newPairs[index].key;
    const updatedTotal = totalPercent - newPairs[index].value;
    newPairs.splice(index, 1);
    setSelectedPairs(newPairs);
    const pairsObject = newPairs.reduce((acc, pair) => {
      if (pair.key && pair.value) {
        acc[pair.key] = pair.value;
      }
      return acc;
    }, {});
    fabricContentCode(pairsObject);
    setFabricCode(prevState => {
      const { [removedKey]: _, ...newComposition } = prevState.composition;
      return {
        ...prevState,
        totalProductPercent: updatedTotal,
        composition: newComposition,
      };
    });
    setFCCValue(fCCValue)
    setTotalPercent(updatedTotal);
  };

  const handleSave = async () => {
    if (!validateInput()) {
      return;
    }
    else {
      try {
        const res = await B2B_API.post('fabric', { json: fabricCode }).json();
        notify({
          error: false,
          success: true,
          title: res?.message || 'Generate Fabric Successfully',
        });
        setIsFabricCode(false)
      } catch (error) {
        notify({
          error: true,
          success: false,
          title: error?.message || 'Something went wrong',
        });
      }
    }
  };

  const handleCancel = () => {
    setIsFabricCode(false);
  };

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: { align: 'center' },
      mantineTableBodyCellProps: { align: 'center' },
    },
    {
      header: 'Fabric Code',
      accessorKey: 'value',
      size: 120
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 100,
    },
    {
      header: 'Actions',
      mantineTableHeadCellProps: { align: 'center' },
      mantineTableBodyCellProps: { align: 'center' },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <IconPencil
              onClick={() => editFabricCode(original)}
              style={{ cursor: 'pointer', color: 'teal' }}
              stroke={2}
            />
          </div>
        );
      }
    }
  ], []);

  const editFabricCode = (roleObj) => {
    setFabricCode(prev => ({ ...prev, ...roleObj }));
  };

  console.log('fab : ', fabricCode);


  return (
    <div>
      {!isFabricCode && (
        <div>
          <div className='user--container'>
            <Text size='lg'>Fabric Code Details</Text>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Fabric Code"}
                onClick={() => setIsFabricCode(true)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={fabricCodeList}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
          />
        </div>
      )}
      {isFabricCode && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <h2>Create Fabric Code Combination</h2>
            <B2BButton
              style={{ color: '#000' }}
              name="Back"
              onClick={handleCancel}
              leftSection={<IconArrowLeft size={15} />}
              color={"rgb(207, 239, 253)"}
            />
          </div>
          <div className='fabric-container'>
            <div className='fabric-content-inner-top'>
              <div>
                <label className='fabric-label'>Fabric Code Combination</label>
                <B2BInput value={fCCValue} type='text' disabled='true' />
              </div>
            </div>
            <div className="fabric-container-row">
              <div className="fabric-container-col">
                <label>
                  <span className="fabric-label">Fabric</span>
                  <span className='asterisk'>*</span>
                </label>
              </div>
              <div className="fabric-container-col">
                <label>
                  <span className="fabric-label">Composition(%)</span>
                  <span className='asterisk'>*</span>
                </label>
              </div>
            </div>
            {selectedPairs.map((pair, index) => (
              <div key={index} className='fabric-container-row'>
                <div className="fabric-container-col">
                  <B2BSelect
                    value={pair.key || ''}
                    data={getAvailableKeys(index).map(key => ({ value: key, label: keyToNameMap[key] }))}
                    clearable={true}
                    onChange={(e) => handleSelectChange(index, e)}
                  />
                </div>
                <div className="fabric-container-col" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <B2BInput
                    type="number"
                    value={pair.value || 0}
                    required={true}
                    disabled={!pair.key}
                    clearable={true}
                    styles={{ input: { fontSize: '14px' } }}
                    onChange={(e) => handleMultiSelectChange(index, e)}
                    error={inputError.fabricContentError && !pair.key && inputError.fabricContentErrorMessage}
                  />
                  {index > 0 && (
                    <button className='removeFabric' onClick={() => removeGroup(index)}>
                      <FontAwesomeIcon icon={faTrash} title='Remove' />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div>
              {totalPercent < 100 && (
                <button type="button" className="addFabric" onClick={addGroup} title='Add'>
                  <FontAwesomeIcon className="fa" icon={faPlus} />
                  Add another attribute
                </button>
              )}
            </div>
            <div>
              <p className='fabric-label'>Overal Composition Percentage:  {totalPercent}</p>
              {inputError?.fabricCompositionError && (
                <p className='error-message'>
                  {inputError.fabricCompositionErrorMessage}
                </p>
              )}
            </div>
          </div>
          <div className='saveFabric'>
            <B2BButton onClick={handleSave} name='Save' color='green' />
          </div>
        </div>
      )}
    </div>
  );
};

export default FabricContent;
