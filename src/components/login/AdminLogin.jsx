import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../api/Interceptor';
import notify from '../../utils/Notification';
import GoogleButton from './Google';
import TwitterButton from './Twitter';

export function AdminLogin(props) {
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },


    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handleLogin = async () => {
    const { email, password } = form.values
    const loginRequestBody = { emailId: email, password: password }
    try {
      const response = await B2B_API.post('user/login', { json: loginRequestBody }).json();
      const { token } = response?.response
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response?.response))
      notify({ 
        id: "success", 
        title: response.response.message, 
        success: true,
        error: false,
        message: `Logged in User: ${response.response.userId}`, 
      })
      navigate('/dashboard')
    } catch (error) {
      if (error.name === 'HTTPError') {
        const errorJson = await error.response.json();
        const { message } = errorJson;
        notify({
          id: "login failure",
          success: false,
          error: true,
          color: 'red',
          title: error.name,
          message: `Oops: ${message}`
        })
      }
    }
  }

  return (
    <div style={{ maxWidth: 'calc(26.25rem* var(--mantine-scale))', marginLeft: 'auto', marginRight: 'auto' }}>
      <Paper radius="md" mt={'6rem'} p="xl" withBorder {...props}>
        <Text size="lg" fw={700}>
          Welcome to UltronB2B,
        </Text>

        {/* <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group> */}

        <Divider
        //  label="Or continue with email" 
         labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => handleLogin())}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="ex: ultronuser@gmail.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}