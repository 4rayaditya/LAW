import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'HIGH':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'CLOSED':
      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'PENDING':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getRoleColor(role: string) {
  switch (role) {
    case 'JUDGE':
      return 'text-purple-600 bg-purple-50 border-purple-200'
    case 'LAWYER':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'CLIENT':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
