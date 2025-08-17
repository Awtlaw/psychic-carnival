import { httpClient } from './client'

export const signupDoctor = async (data) => {
  try {
    const response = await httpClient.post('/user/register/doctor', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const signupPatient = async (data) => {
  try {
    const response = await httpClient.post('/user/register/patient', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const signupAdmin = async (data) => {
  try {
    const response = await httpClient.post('/user/register/admin', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const loginUser = async (data) => {
  try {
    const response = await httpClient.post('/user/login', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
