// import axios from "axios";
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';
import { store } from '../redux/store/store';

export const serverRequest = (token?: any) => {
  const headers: any = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  //   headers['DOMAIN-ORIGIN-NAME'] = `${process.env.DOMAIN_NAME}`;
  //   headers['country'] = `${process.env.COUNTRY?.toLowerCase()}`;

  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const axiosInst = axios.create({
    headers,
  });

  axiosInst.interceptors.request.use(
    async function (config: any) {
      return config;
    },
    function (error: any) {
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  axiosInst.interceptors.response.use(
    async function (response: any) {
      return response;
    },
    function (error: {
      response: { status: number; data: { message: string } };
    }) {
      if (
        error.response &&
        (error.response?.status === 403 ||
          error.response?.status === 401 ||
          error.response.data?.message === 'Access denied. No token provided.')
      ) {
        //logout user
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          store.dispatch(logout());
          window.location.pathname = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInst;
};

export const serverRequestFormData = (token?: any) => {
  const headers: any = {
    'Content-Type': 'multipart/form-data',
    // Accept: "application/json",
  };

  //   headers['DOMAIN-ORIGIN-NAME'] = `${process.env.DOMAIN_NAME}`;
  //   headers['country'] = `${process.env.COUNTRY?.toLowerCase()}`;

  if (token) {
    headers['authorization'] = `Bearer ${token}`;
  }

  const axiosInst = axios.create({
    headers,
  });

  axiosInst.interceptors.request.use(
    async function (config: any) {
      return config;
    },
    function (error: any) {
      return Promise.reject(error);
    },
  );

  // Add a response interceptor
  axiosInst.interceptors.response.use(
    async function (response: any) {
      return response;
    },
    function (error: {
      response: { status: number; data: { message: string } };
    }) {
      if (
        error.response?.status === 403 ||
        error.response?.status === 401 ||
        error.response?.data?.message === 'Access denied. No token provided.'
      ) {
        //logout user
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          window.location.pathname = '/login';
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInst;
};
