import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Anchor,
  Divider,
  PasswordInput,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useToggle } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../assets/ultron-logo.png';
import B2BButton from '../../common/B2BButton';
import '../../css/AdminLogin.css';
import notify from '../../utils/Notification';
import { createB2BAPI } from '../../api/Interceptor';

export function AdminLogin(props) {
  const [type, toggle] = useToggle(['login', 'register']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const B2B_API = createB2BAPI();

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
    setLoading(true);
    const { email, password } = form.values
    const loginRequestBody = { emailId: email, password: password }
    try {
      const response = await B2B_API.post('user/login', { json: loginRequestBody }).json();
      const { token } = response?.response
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(response?.response))
      navigate('/dashboard')
      notify({
        id: "success",
        title: response.message,
        success: true,
        error: false,
        message: `Logged in User: ${response?.response?.userId}`,
      })
    } catch (error) {
      const { message } = error;
      notify({
        id: "login failure",
        success: false,
        error: true,
        color: 'red',
        title: message,
        message: `Oops: ${message || "Something went wrong!!!"}`
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="login-monday-container" className="login-monday-container">
      <div className="login-monday-content-component">
        <div className="login-monday-top-header-wrapper">
          <div className="top-header-component">
            <img className="account-logo" src={LOGO} alt="Monday logo" />
          </div>
        </div>
        <div className="router-wrapper">
          <div className="email-first-component">
            <h1 className="login-header">Log in to Ultron</h1>
            <div className='email-label'>
              <label htmlFor=''></label>
            </div>
            <form className='login-form' onSubmit={form.onSubmit(() => handleLogin())}>
              <div className='email-password-field'>
                <TextInput
                  className='login-email'
                  required
                  size='md'
                  placeholder="ex: ultronuser@gmail.com"
                  value={form.values.email}
                  onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                  error={form.errors.email && 'Invalid email'}
                  radius="sm"
                />
                <PasswordInput
                  className='login-password'
                  required
                  size='md'
                  placeholder="Your password"
                  value={form.values.password}
                  onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                  error={form.errors.password && 'Password should include at least 6 characters'}
                  radius="sm"
                />
              </div>
              <div className='button-container'>
                <B2BButton type='submit' loading={loading} name={'Next'} rightSection={<FontAwesomeIcon color='white' icon={faArrowRight} />} variant={"contained"} radius={'5'} />
              </div>
            </form>
            <div className="suggest-signup-wrapper">
              <div className="suggest-signup-component">
                <Divider size={'sm'} label={<>
                  <span>Don't have an account yet?&nbsp;</span>
                  <Anchor href=''>Sign Up</Anchor>
                </>} />
              </div>
              <div className="login-support-link-component">
                <span className="login-support-link-prefix">Can't log in?{" "}</span>
                <Anchor rel="noopener noreferrer" href="" target="">Visit our help center</Anchor>
              </div>
            </div>
            <div className="signed-on-accounts-wrapper">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}