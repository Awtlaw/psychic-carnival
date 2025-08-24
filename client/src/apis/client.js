import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BASE

export const httpClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('access')}`,
    'Content-Type': 'application/json'
  }
})
