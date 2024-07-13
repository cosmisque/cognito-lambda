import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUsersInPool } from '../../api/userApi';
import { Text, Paper, Container, Flex } from '@mantine/core';
import { Table } from '../../components/table/Table';
import { LoaderOverlay } from '../../components/loader/LoaderOverlay';
import CreateUser from '../user/CreateUser';
import { UsersApiResponse } from '../../model/userType';

const UserBoard: React.FC = () => {
  const { userPoolId } = useParams<string>();
  const [data, setData] = useState<UsersApiResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    userPoolId &&
      fetchUsersInPool(userPoolId).then((res: UsersApiResponse[]) => {
        setData(res);
      });
    setLoading(false);
  }, [userPoolId, refetch]);

  const columns = ['Username', 'Email', 'Enabled', 'Last Modified', 'Status'];
  const rowKeys = [
    { key: 'username' },
    { key: 'email' },
    { key: 'enabled' },
    { key: 'lastModifiedDate', type: 'date' },
    { key: 'status' }
  ];

  return (
    <div style={{ flex: '80%', marginTop: '80px', marginLeft: '200px' }}>
      <Container style={{ maxWidth: '90%' }}>
        {loading || !data ? (
          <LoaderOverlay loading={loading} />
        ) : (
          <>
            <Paper shadow="xs" withBorder p="xl" mb={20}>
              <div>
                <Text>
                  Pool id - <b>{userPoolId}</b>
                </Text>
                <Text>
                  Pool Name - <b>{sessionStorage.getItem('userPoolName')}</b>
                </Text>
              </div>
            </Paper>

            <Paper shadow="xs" withBorder p="xl">
              <Flex direction="column" justify="flex-end">
                <Flex direction="row" justify="flex-end" mb={20}>
                  <CreateUser setRefetch={setRefetch} refetch={refetch} />
                </Flex>
                <Table
                  columns={[...columns, ...['custom:role_name']]}
                  rowKeys={[...rowKeys, { key: 'custom:role_name' }]}
                  data={data}
                  setData={setData}
                  clickable={true}
                  action={true}
                  setRefetch={setRefetch}
                  refetch={refetch}
                />
              </Flex>
            </Paper>
          </>
        )}
      </Container>
    </div>
  );
};

export default UserBoard;
