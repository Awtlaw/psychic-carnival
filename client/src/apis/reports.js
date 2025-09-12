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

// ✅ Update doctor's notes
export const updateReportNotes = async (id, notes) => {
  try {
    const response = await httpClient.patch(`/api/report/${id}/notes`, { notes })
    return response.data
  } catch (error) {
    return error.response.data
  }
}

// ✅ Fulfill report
export const fulfillReport = async (id) => {
  try {
    const response = await httpClient.patch(`/api/report/${id}/fulfill`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
