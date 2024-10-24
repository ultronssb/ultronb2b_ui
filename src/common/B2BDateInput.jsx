import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import React from 'react';

const B2BDateInput = ({value, placeholder,onChange, required }) => {
    const dateParser = (input) => {
        if (input === 'WW2') {
            return new Date(1939, 8, 1);
        }
        return dayjs(input, 'DD/MM/YYYY').toDate();
    };

    return (

        <DateInput
            className="input-textField"
            dateParser={dateParser}
            value={value}
            required={required}
            rightSection={<FontAwesomeIcon icon={faCalendar} />}
            rightSectionPointerEvents="none"
            valueFormat="DD/MM/YYYY"
            onChange={onChange}
            placeholder={placeholder}
            clearable
            radius="sm"
            size='md'
        />
    );
};

export default B2BDateInput;
