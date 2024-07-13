import {
  TextInput,
  PasswordInput,
  Paper,
  Container,
  Button
} from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/auth';
import accountImage from '../../assets/account.png';
import classes from './Login.module.css';
import ErrorMsg from '../../components/text/ErrorMsg';
import { useEffect } from 'react';

interface ILoginFormValue {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ILoginFormValue>();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, []);

  const onSubmit = async ({ username, password }: ILoginFormValue) => {
    const res = await login(username, password);
    if (res) {
      toast.success('Successfully login user');
      navigate('/dashboard');
    }
  };

  return (
    <div className={classes.loginBackground}>
      <Container size="md" my={40}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper
            withBorder
            shadow="md"
            p={30}
            mt={30}
            radius="md"
            h={380}
            w={300}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img src={accountImage} width={100} height={100} />
            </div>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: 'Username is required' }}
              // rules={{
              //   pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
              // }}
              render={({ field }) => (
                <TextInput
                  mb={6}
                  label="Username"
                  placeholder="Your username"
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              defaultValue=""
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  {...field}
                />
              )}
            />
            {errors && <ErrorMsg errors={errors} />}
            <Button fullWidth mt="xl" type="submit" color="#565a97">
              Login
            </Button>
          </Paper>
        </form>
      </Container>
    </div>
  );
};

export default Login;
