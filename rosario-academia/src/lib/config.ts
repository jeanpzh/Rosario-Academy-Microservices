export const { BASE_URL, MP_ACCESS_TOKEN } = process.env
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const AUTH_URL = `${API_BASE_URL}/auth`
export const PAYMENT_URL = `${API_BASE_URL}/payment`
export const USER_URL = `${API_BASE_URL}/users`
