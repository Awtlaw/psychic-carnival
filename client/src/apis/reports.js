import { httpClient } from './client'

export const listReports = async () => {
  try {
    const response = await httpClient.get('/api/report')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getOneReport = async (id) => {
  try {
    const response = await httpClient.get(`/api/report/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const writeReport = async (data) => {
  try {
    const response = await httpClient.post('/api/report', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
