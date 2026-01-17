import { loginStart, loginSuccess, loginFailure } from './userSlice';
import { loginApi } from './userService';
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from './userSlice';
import { signupApi } from './userService';

export const signupUser = (formData, navigate) => async (dispatch) => {
  dispatch(signupStart());

  try {
    await signupApi({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    dispatch(signupSuccess());

    setTimeout(() => {
      navigate('/nt/login');
    }, 1500);
  } catch (error) {
    dispatch(
      signupFailure(
        error.response?.data?.errors ||
        error.response?.data?.message ||
        'Signup failed'
      )
    );
  }
};


export const loginUser = (credentials, navigate) => async (dispatch) => {
  dispatch(loginStart());

  try {
    const response = await loginApi(credentials);
    const { jwtToken } = response.data;

    sessionStorage.setItem('jwtToken', jwtToken);
    sessionStorage.setItem('userName', credentials.username);

    dispatch(
      loginSuccess({
        username: credentials.username,
        jwtToken,
      })
    );

    navigate('/nt');
  } catch (error) {
    dispatch(
      loginFailure(
        error.response?.data?.message || 'Login failed'
      )
    );
  }
};
