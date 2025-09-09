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

export const getUserPfp = async (id) => {
  try {
    const response = await httpClient.get(`/api/upload/image/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const uploadPfp = async (data) => {
  try {
    const response = await httpClient.post(`/api/upload/image`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const changePatientInfo = async (data) => {
  try {
    const response = await httpClient.put(`/api/user/patient/contact`, data)
    return response.data
  } catch (error) {
    return error.response?.data || { success: false, message: 'Server error' }
  }
}

export const changeDocInfo = async (data) => {
  try {
    const response = await httpClient.put(`/api/user/doctor/contact`, data)
    return response.data
  } catch (error) {
    return error.response?.data || { success: false, message: 'Server error' }
  }
}
