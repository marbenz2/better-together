'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean
}

export function Input({ className, showPasswordToggle = false, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const isPasswordInput = props.type === 'password'

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  return (
    <div className="relative">
      <input
        {...props}
        type={isPasswordInput && showPassword ? 'text' : props.type}
        className={cn(
          'rounded-md h-10 text-sm px-4 py-2 bg-inherit border w-full',
          isPasswordInput && showPasswordToggle && 'pr-12',
          className,
        )}
      />
      {isPasswordInput && showPasswordToggle && (
        <button
          type="button"
          aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={togglePasswordVisibility}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  )
}
