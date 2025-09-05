import { httpClient } from './client'

export const getPatientById = async (id) => {
  try {
    const response = await httpClient.get(`/api/user/patient/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getDoctorById = async (id) => {
  try {
    const response = await httpClient.get(`/api/user/doctor/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getAllPatients = async () => {
  try {
    const response = await httpClient.get(`/api/user/patient`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getAllDoctors = async () => {
  try {
    const response = await httpClient.get(`/api/user/doctor`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getAdminById = async (id) => {
  try {
    const response = await httpClient.get(`/api/user/admin/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
