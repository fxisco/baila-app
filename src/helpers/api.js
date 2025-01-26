import axios from 'axios';

const BASE_URL = 'https://ditglcfd5xquiwzrhat7r3b4p40dglnu.lambda-url.us-east-1.on.aws/'

export const createStudent = async (data) => {
  return axios.put(BASE_URL + 'estudiantes', data);
}

export const createServicePayment = async (id, data) => {
  return axios.put(BASE_URL + `servicios/${id}/pago`, data);
}

export const createGroup = async (grupo) => {
  return axios.put(BASE_URL + `grupos`, grupo);
}

export const createService = async (grupo) => {
  return axios.put(BASE_URL + `servicios`, grupo);
}

export const createTeacher = async (teacher) => {
  return axios.put(BASE_URL + `profesores`, teacher);
}

export const searchStudent = async (search) => {
  return axios.post(BASE_URL + `estudiantes/search`, { q: search });
}

export const fetchStudent = async (id) => {
  return axios.get(BASE_URL + `estudiantes/${id}`);
}

export const fetchPayment = async (id) => {
  return axios.get(BASE_URL + `servicios/pagos/${id}`);
}

export const updateStudent = async (id, update) => {
  return axios.put(BASE_URL + `estudiantes/${id}`, update);
}

export const updateGroup = async (id, update) => {
  return axios.put(BASE_URL + `grupos/${id}`, update);
}

export const updateService = async (id, update) => {
  return axios.put(BASE_URL + `servicios/${id}`, update);
}

export const updatePayment = async (id, update) => {
  return axios.put(BASE_URL + `servicios/pagos/${id}`, update);
}

export const getGroups = async (payload) => {
  return axios.post(BASE_URL + `grupos`, payload);
}

export const fetchGroup = async (id) => {
  return axios.get(BASE_URL + `grupos/${id}`);
}

export const fetchService = async (id, data) => {
  return axios.post(BASE_URL + `servicios/${id}`, data);
}

export const getServices = async () => {
  return axios.post(BASE_URL + `servicios`);
}

export const fetchTeacher = async (id) => {
  return axios.get(BASE_URL + `profesores/${id}`);
}

export const getTeachers = async (payload) => {
  return axios.post(BASE_URL + `profesores`, payload);
}

export const updateTeacher = async (id, update) => {
  return axios.put(BASE_URL + `profesores/${id}`, update);
}

export const deleteServicePayment = async (id) => {
  return axios.delete(BASE_URL + `servicios/pagos/${id}`);
}

export const login = async (data) => {
  return axios.post(BASE_URL + `login`, data);
}
