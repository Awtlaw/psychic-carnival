import { httpClient } from './client'

export const checkSymptoms = async (data) => {
  try {
    const response = await httpClient.post('/api/report/diagnosis', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
