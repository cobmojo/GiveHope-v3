import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with clsx to handle conditional logic
 * and tailwind-merge to resolve conflicting classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Cached Intl.NumberFormat instance to prevent performance overhead 
 * of creating a new instance on every render cycle.
 */
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0, // Cleaner UI: displays $100 instead of $100.00
  maximumFractionDigits: 2,
})

/**
 * Formats a value as USD currency. 
 * Safely handles strings, numbers, and null/undefined.
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return currencyFormatter.format(0)
  }
  
  const val = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Handle invalid parsing (NaN)
  return currencyFormatter.format(isNaN(val) ? 0 : val)
}

/**
 * Generates up to 2 character initials from a name string.
 * e.g. "John Doe" -> "JD", "Single" -> "SI"
 */
export function getInitials(name: string): string {
  if (!name) return ""
  
  const parts = name.trim().split(/\s+/)
  
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  
  // First char of first name + First char of last name
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Async helper to simulate network delay or smooth out loading states.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
