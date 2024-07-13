import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text, Flex } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface ICustomModal{
  content: string;
  footerLabel: string;
  callback: () => void;
}


function CustomModal({ content, footerLabel, callback }: ICustomModal) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <Text>{content}</Text>
        <Flex justify="flex-end">
          <Button
            color="red"
            onClick={() => {
              callback();
              close();
            }}>
            {footerLabel}
          </Button>
        </Flex>
      </Modal>
      <IconTrash style={{ cursor: 'pointer' }} color="red" onClick={open} />
    </>
  );
}

export default CustomModal;
