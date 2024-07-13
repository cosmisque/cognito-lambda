import { TextInput, Button, Modal, Flex, Select } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import ErrorMsg from '../../components/text/ErrorMsg';
import { updateUser } from '../../api/userApi';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { IconEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { USERPOOL_ROLE } from '../../config/roles';
import { UserAttributes } from '../../model/userType';

interface IEditUser {
  selectedUser: any;
  setRefetch: React.Dispatch<React.SetStateAction<any>>;
  refetch: boolean;
}

interface IEditFormValue {
  username: string;
  email: string;
  'custom:role_name': string;
  userPoolId?: string;
  userAttributes: UserAttributes;
}

function EditUser({ selectedUser, setRefetch, refetch }: IEditUser) {
  const { username, email } = selectedUser;
  const customRoleName = selectedUser['custom:role_name'];
  const params = useParams();
  const { userPoolId } = params;
  const [opened, { open, close }] = useDisclosure(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting }
  } = useForm<IEditFormValue>({
    defaultValues: {
      username,
      email,
      'custom:role_name': customRoleName
    }
  });

  const onSubmit = async (formValue: any) => {
    const { username, ...customAtt } = formValue;

    const mappedCustomAtt = Object.keys(customAtt).map((key) => ({
      Name: key,
      Value: customAtt[key]
    }));
    formValue.userPoolId = userPoolId;
    formValue.userAttributes = mappedCustomAtt;
    const res = await updateUser(formValue);
    setRefetch(!refetch);
    if (!res.error) {
      toast.success('User successfully updated');
      close();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="md"
        yOffset="10vh"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 5
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            mb={3}
            label="Username"
            placeholder="username"
            {...register('username')}
            disabled
          />
          <Controller
            name="email"
            control={control}
            rules={{
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format'
              }
            }}
            render={({ field }) => (
              <TextInput
                mb={3}
                label="Email"
                placeholder="you@email.dev"
                {...field}
                required
              />
            )}
          />

          {customRoleName && (
            <Controller
              name="custom:role_name"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={'Role Name'}
                  data={USERPOOL_ROLE[sessionStorage.getItem('userPoolName')]}
                />
              )}
            />
          )}
          {errors && <ErrorMsg errors={errors} />}
          <Flex justify="center" align="center">
            <Button
              mt="xl"
              type="submit"
              w={250}
              bg="#565a97"
              disabled={isSubmitting}
            >
              Update
            </Button>
          </Flex>
        </form>
      </Modal>
      <IconEdit style={{ cursor: 'pointer' }} onClick={open} color="#565a97" />
    </>
  );
}

export default EditUser;
