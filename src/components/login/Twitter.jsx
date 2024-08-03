import { Button } from '@mantine/core';
import { TwitterIcon } from '@mantinex/dev-icons';

const TwitterButton =(props) => {
  return (
    <Button
      leftSection={<TwitterIcon style={{ width: '1rem', height: '1rem' }} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
}

export default TwitterButton;