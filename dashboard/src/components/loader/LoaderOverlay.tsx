import { Center, LoadingOverlay } from '@mantine/core';

export function LoaderOverlay({ loading }: { loading: boolean }) {
  console.log(loading);
  return (
    <Center>
      <LoadingOverlay visible={!loading} />
    </Center>
  );
}
