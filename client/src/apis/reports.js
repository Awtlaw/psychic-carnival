import { httpClient } from './client'

export const listReports = async () => {
  try {
    const response = await httpClient.get('/report')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const getOneReport = async (id) => {
  try {
    const response = await httpClient.get(`/report/${id}`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
