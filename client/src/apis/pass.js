import { httpClient } from './client'
// Forgot password (send reset link)
export const forgotPassword = async (email) => {
  try {
    const response = await httpClient.post('/api/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    return error.response?.data || { success: false, message: 'Server error' }
  }
}

// Reset password (with token + new password)
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await httpClient.post(`/api/auth/reset-password/${token}`, { password: newPassword })
    return response.data
  } catch (error) {
    return error.response?.data || { success: false, message: 'Server error' }
  }
}
