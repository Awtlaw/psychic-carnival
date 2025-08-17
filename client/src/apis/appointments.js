import { httpClient } from './client'

export const listPendingApts = async () => {
  try {
    const response = await httpClient.get('/api/appointment/pending')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const listFulfilledApts = async () => {
  try {
    const response = await httpClient.get('/api/appointment/fulfilled')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const bookApt = async (data) => {
  try {
    const response = await httpClient.post('/api/appointment', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
