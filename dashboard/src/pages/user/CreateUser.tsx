import { TextInput, Button, Checkbox, Modal, Flex } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import ErrorMsg from '../../components/text/ErrorMsg';
import { createUserInPool } from '../../api/userApi';
import { toast } from 'react-toastify';
import { Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { USERPOOL_ROLE } from '../../config/roles';
import { ICreateUser } from '../../model/userType';

function CreateUser({
  setRefetch,
  refetch
}: {
  setRefetch: React.Dispatch<React.SetStateAction<any>>;
  refetch: boolean;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<ICreateUser>();
  const { userPoolId } = useParams();
  const [opened, { open, close }] = useDisclosure(false);
  const userPoolName: string | null = sessionStorage.getItem('userPoolName');
  const onSubmit = async (formValue: ICreateUser) => {
    formValue.userPoolId = userPoolId;
    formValue.customAttributes = [
      {
        Name: 'custom:role_name',
        Value: formValue['custom:role_name']
      }
    ];

    const res = await createUserInPool(formValue);
    if (!res.error) {
      close();
      setRefetch(!refetch);
      toast.success('User successfully created');
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
          <Controller
            name="email"
            control={control}
            defaultValue=""
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
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <TextInput
                mb={20}
                label="Username"
                placeholder="username"
                {...field}
                required
              />
            )}
          />
          <Controller
            name="sendEmail"
            control={control}
            defaultValue={import.meta.env.VITE_ENV === 'dev' ? false : true}
            render={({ field }) => (
              <Checkbox
                mb={3}
                label="Send email to user"
                defaultChecked={field.value}
              />
            )}
          />
          <Controller
            name="custom:role_name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                label={'Role Name'}
                data={userPoolName ? USERPOOL_ROLE[userPoolName] : []}
              />
            )}
          />

          {errors && <ErrorMsg errors={errors} />}
          <Flex justify="center" align="center">
            <Button
              mt="xl"
              type="submit"
              w={250}
              bg="#565a97"
              disabled={isSubmitting}
            >
              Create
            </Button>
          </Flex>
        </form>
      </Modal>
      <Button onClick={open} w={100} bg="#565a97">
        Create
      </Button>
    </>
  );
}

export default CreateUser;
