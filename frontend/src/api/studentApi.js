import axios from "axios";

const API = "http://localhost:5000";

export const getStudents = () => axios.get(`${API}/students`);
export const createStudent = (data) => axios.post(`${API}/students`, data);
export const updateStudent = (id, data) => axios.put(`${API}/students/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API}/students/${id}`);
