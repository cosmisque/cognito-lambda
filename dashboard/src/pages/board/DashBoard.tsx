import  { useEffect, useState } from 'react';
import { fetchUserPools } from '../../api/userApi';
import { Table } from '../../components/table/Table';
import { Paper, Text, Flex, Container } from '@mantine/core';
import { LoaderOverlay } from '../../components/loader/LoaderOverlay';
import { IUserPool } from '../../model/userType';

function DashBoard() {
  const [data, setData] = useState<IUserPool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserPools().then((res: IUserPool[]) => {
      setLoading(true);
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = ['User Pool Id', 'User Pool Name', 'Last Modified'];
  const rowKeys = [{ key: 'Id' }, { key: 'Name' }, { key: 'LastModifiedDate', type: 'date' }];

  return (
    <div style={{ flex: '80%', marginTop: '80px', marginLeft: '200px' }}>
      <Container mt={30} style={{maxWidth: '90%'}}>
        <Paper shadow="xs" withBorder p="xl">
          <Flex direction="column">
            <Text fw={500}>User Pool DashBoard</Text>
            <div>
              {loading || !data ? (
                <LoaderOverlay loading={loading} />
              ) : (
                <Table
                  columns={columns}
                  rowKeys={rowKeys}
                  data={data}
                  selectedClickableId="Id"
                  extraKey="Name"
                />
              )}
            </div>
          </Flex>
        </Paper>
      </Container>
    </div>
  );
}

export default DashBoard;
