import axios from 'axios';

const BASE_URL = 'https://ditglcfd5xquiwzrhat7r3b4p40dglnu.lambda-url.us-east-1.on.aws/'

export const createStudent = async (data) => {
  return axios.put(BASE_URL + 'estudiantes', data);
}

export const searchStudent = async (search) => {
  return axios.post(BASE_URL + `estudiantes/search`, { q: search });
}

export const fetchStudent = async (id) => {
  return axios.get(BASE_URL + `estudiantes/${id}`);
}

export const updateStudent = async (id, update) => {
  return axios.put(BASE_URL + `estudiantes/${id}`, update);
}

export const createGroup = async (grupo) => {
  return axios.put(BASE_URL + `grupos`, grupo);
}

export const updateGroup = async (id, update) => {
  return axios.put(BASE_URL + `grupos/${id}`, update);
}

export const getGroups = async () => {
  return axios.get(BASE_URL + `grupos`);
}

export const fetchGroup = async (id) => {
  return axios.get(BASE_URL + `grupos/${id}`);
}