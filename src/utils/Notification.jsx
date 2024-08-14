import { rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

const notify = ({
  title,
  message,
  id,
  success,
  error,
  color = 'teal',
  icon,
  onClose
}) => {

  notifications.show({
    id,
    color: success ? 'teal' : error ? 'red' : 'blue',
    title,
    message,
    autoClose: 3000,
    withBorder: true,
    icon: success ? <IconCheck style={{ width: rem(20), height: rem(20) }} /> : <IconX style={{ width: rem(20), height: rem(20) }} />
  })
};

export default notify;
