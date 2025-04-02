import axios from 'axios';

const BASE_URL = 'https://ditglcfd5xquiwzrhat7r3b4p40dglnu.lambda-url.us-east-1.on.aws/'

const getAuthorizationHeader = () => {
  const token = JSON.parse(localStorage.getItem('user') || {})?.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const createStudent = async (data) => {
  return axios.put(BASE_URL + 'estudiantes', data);
}

export const createServicePayment = async (id, data) => {
  return axios.put(BASE_URL + `servicios/${id}/pago`, data);
}

export const createStudentPayment = async (id, data) => {
  return axios.put(BASE_URL + `estudiantes/${id}/pago`, data);
}

export const updateConfig = async (data) => {
  return axios.put(BASE_URL + `configuraciones`, data);
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

export const fetchConfig = async () => {
  return axios.get(BASE_URL + `configuraciones`);
}

export const fetchRecents = async () => {
  return axios.get(BASE_URL + `estudiantes/recientes`);
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

export const updateStudentPayment = async (studentId, paymentId, update) => {
  return axios.put(BASE_URL + `estudiantes/${studentId}/pagos/${paymentId}`, update);
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

export const fetchStudentPayment = async (id, data) => {
  return axios.post(BASE_URL + `estudiantes/${id}/pago`, data, getAuthorizationHeader());
}

export const getServices = async () => {
  return axios.post(BASE_URL + `servicios`);
}

export const getStudentPayments = async (id) => {
  return axios.post(BASE_URL + `estudiantes/${id}/pagos`);
}

export const fetchTeacher = async (id) => {
  return axios.get(BASE_URL + `profesores/${id}`);
}

export const getTeachers = async (payload = {}) => {
  return axios.post(BASE_URL + `profesores`, payload);
}

export const updateTeacher = async (id, update) => {
  return axios.put(BASE_URL + `profesores/${id}`, update);
}

export const updateAttendance = async (id, update) => {
  return axios.put(BASE_URL + `grupos/${id}/asistencia`, update);
}

export const fetchGroupAttendance = async (id, data) => {
  return axios.post(BASE_URL + `grupos/${id}/asistencia`, data);
}

export const deleteServicePayment = async (id) => {
  return axios.delete(BASE_URL + `servicios/pagos/${id}`);
}

export const deleteStudent = async (id) => {
  return axios.delete(BASE_URL + `estudiantes/${id}`);
}

export const deleteStudentPayment = async (id) => {
  return axios.delete(BASE_URL + `estudiantes/pagos/${id}`);
}

export const login = async (data) => {
  return axios.post(BASE_URL + `login`, data);
}

export const changePassword = async (data) => {
  return axios.post(BASE_URL + `profesores/change-password`, data, getAuthorizationHeader());
}

export const resetTempPassword = async (id) => {
  return axios.post(BASE_URL + `profesores/${id}/reset-password`, null, getAuthorizationHeader());
}

export const createTeacherPayment = async (id, data) => {
  return axios.put(BASE_URL + `profesores/${id}/pagos`, data, getAuthorizationHeader());
}

export const getTeacherPayments = async (id) => {
  return axios.get(BASE_URL + `profesores/${id}/pagos`, getAuthorizationHeader());
}

export const getTeacherPayment = async (id, data) => {
  return axios.post(BASE_URL + `profesores/${id}/pago`, data, getAuthorizationHeader());
}

export const updateTeacherPayment = async (id, update) => {
  return axios.put(BASE_URL + `profesores/pagos/${id}`, update, getAuthorizationHeader());
}


export const deleteTeacherPayment = async (id) => {
  return axios.delete(BASE_URL + `profesores/pagos/${id}`, getAuthorizationHeader());
}