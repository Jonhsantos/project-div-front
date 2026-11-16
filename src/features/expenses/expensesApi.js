import { apiRequest } from '../../services/api'

export function listExpenses(token, tripId) {
  return apiRequest(`/trips/${tripId}/expenses`, { token })
}

export function getExpenseSummary(token, tripId) {
  return apiRequest(`/trips/${tripId}/expense-summary`, { token })
}

export function createExpense(token, tripId, formData) {
  return apiRequest(`/trips/${tripId}/expenses`, { token, method: 'POST', body: formData })
}

export function updateExpense(token, expenseId, formData) {
  return apiRequest(`/expenses/${expenseId}`, { token, method: 'PUT', body: formData })
}

export function getReceipt(token, expenseId) {
  return apiRequest(`/expenses/${expenseId}/receipt`, { token, responseType: 'blob' })
}

export function reviewExpense(token, expenseId, decisao, motivo_correcao = null) {
  return apiRequest(`/expenses/${expenseId}/review`, { token, method: 'POST', body: JSON.stringify({ decisao, motivo_correcao }) })
}

export function deleteExpense(token, expenseId) {
  return apiRequest(`/expenses/${expenseId}`, { token, method: 'DELETE' })
}
