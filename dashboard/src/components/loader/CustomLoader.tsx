import React from 'react';
import { Center,Loader } from '@mantine/core';

const CustomLoader: React.FC = () => {
  return (
    <Center h={100}>
      <Loader />
    </Center>
  );
}

export default CustomLoader;
