import { httpClient } from './client'

export const signupDoctor = async (data) => {
  try {
    const response = await httpClient.post('/api/user/register/doctor', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const signupPatient = async (data) => {
  try {
    const response = await httpClient.post('/api/user/register/patient', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const signupAdmin = async (data) => {
  try {
    const response = await httpClient.post('/api/user/register/admin', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const loginUser = async (data) => {
  try {
    const response = await httpClient.post('/api/user/login', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
