import { httpClient } from './client'

export const listPendingApts = async () => {
  try {
    const response = await httpClient.get('/appointment/pending')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const listFulfilledApts = async () => {
  try {
    const response = await httpClient.get('/appointment/fulfilled')
    return response.data
  } catch (error) {
    return error.response.data
  }
}

export const bookApt = async (data) => {
  try {
    const response = await httpClient.post('/appointment', data)
    return response.data
  } catch (error) {
    return error.response.data
  }
}
