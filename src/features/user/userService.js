import axios from '../../api/axios';

export const loginApi = (credentials) => {
  return axios.post(
    'api/authservice/user/login',
    credentials,
    { headers: { 'Content-Type': 'application/json' } }
  );
};

export const signupApi = (payload) => {
  return axios.post(
    'api/authservice/user/signup',
    payload,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
