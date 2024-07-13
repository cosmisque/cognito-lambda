import React, { useEffect } from 'react';
import { Table as MantineTable } from '@mantine/core';
import { format } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './Table.module.css';
import { toast } from 'react-toastify';
import EditUser from '../../pages/user/EditUser';
import Modal from '../../components/modal/Modal';
import { deleteUser } from '../../api/userApi';

interface ITable {
  columns: string[];
  rowKeys: any;
  data: any[];
  setData?: any;
  setRefetch?: (refetch: boolean) => void;
  refetch?: boolean;
  selectedClickableId?: string;
  extraKey?: string;
  action?: boolean;
  clickable?: boolean;
}

interface IRowKeys {
  type?: string;
  key: string;
}

export const Table = ({
  columns,
  rowKeys,
  data,
  setData,
  setRefetch,
  refetch,
  selectedClickableId,
  extraKey,
  action = false
}: ITable) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paths = pathname.split('/');
  const userPoolId = paths[paths.length - 1];

  useEffect(() => {
    if (!data) {
      return;
    }
  }, [data]);

  const rows = data?.map((d) => (
    <MantineTable.Tr
      className={selectedClickableId && classes.tableRowHover}
      key={d[rowKeys[0].key]}
      onClick={() => {
        !action &&
          extraKey &&
          sessionStorage.setItem('userPoolName', d[extraKey]);
        selectedClickableId && navigate(d[selectedClickableId]);
      }}
    >
      {rowKeys.map((rowKey: IRowKeys, index: number) => (
        <MantineTable.Td key={index}>
          {rowKey.type === 'date'
            ? format(new Date(d[rowKey.key]), 'yyyy-MM-dd HH:mm:ss')
            : d[rowKey.key]}
        </MantineTable.Td>
      ))}
      {/* For additional column to edit & delete */}
      {action && (
        <React.Fragment>
          <MantineTable.Td>
            <EditUser
              selectedUser={d}
              setRefetch={setRefetch}
              refetch={refetch}
            />
            {/* mantine  bug */}
            {/* <IconEdit
              style={{ cursor: 'pointer' }}
              onClick={() => {
                console.log(pathname);
                setSelectedUser(d);
                navigate(`${pathname}/edit`);
              }}
            /> */}
          </MantineTable.Td>
          <MantineTable.Td>
            <Modal
              content="Are you sure you want to delete this user?"
              footerLabel="Confirm"
              callback={async () => {
                const res = await deleteUser(d?.username, userPoolId);
                if (!res.error) {
                  setData &&
                    setData(
                      data.filter((prev) => prev.username !== d.username)
                    );
                  toast.success('User successfully deleted');
                } else {
                  toast.error(res.error);
                }
              }}
            />
          </MantineTable.Td>
        </React.Fragment>
      )}
    </MantineTable.Tr>
  ));

  return (
    <>
      <MantineTable verticalSpacing="lg">
        <MantineTable.Thead>
          <MantineTable.Tr>
            {columns?.map((columnName) => (
              <MantineTable.Th key={columnName}>{columnName}</MantineTable.Th>
            ))}
          </MantineTable.Tr>
        </MantineTable.Thead>
        {data?.length > 0 ? (
          <MantineTable.Tbody>{rows}</MantineTable.Tbody>
        ) : null}
      </MantineTable>
    </>
  );
};
