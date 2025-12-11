
import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, DollarSign, Heart, Sparkles } from "lucide-react"
import { cn } from "../../lib/utils"

interface QuickGiveProps {
  workerId: string;
  className?: string;
}

export function QuickGive({ workerId, className }: QuickGiveProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [rawValue, setRawValue] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const formatCurrencyInput = (value: string) => {
    let clean = value.replace(/[^0-9.]/g, '')
    const parts = clean.split('.')
    if (parts.length > 2) clean = parts[0] + '.' + parts.slice(1).join('')
    if (parts[0].length > 6) parts[0] = parts[0].substring(0, 6)
    if (parts.length > 1) clean = parts.length > 1 ? parts.join('.') : parts[0]
    if (parts[1] && parts[1].length > 2) clean = parts[0] + '.' + parts[1].substring(0, 2)
    const [integer, decimal] = clean.split('.')
    const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      setDisplayValue('')
      setRawValue(0)
      return
    }
    const formatted = formatCurrencyInput(val)
    setDisplayValue(formatted)
    setRawValue(parseFloat(formatted.replace(/,/g, '')) || 0)
  }

  const handleGive = () => {
    if (!rawValue || rawValue <= 0) {
      inputRef.current?.focus()
      return
    }
    navigate(`/checkout?workerId=${workerId}&amount=${rawValue}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGive()
  }

  const hasValue = rawValue > 0

  return (
    <div className={cn("w-full max-w-sm mx-auto font-sans isolate", className)}>
      <div className="flex items-center gap-2 mb-2 ml-1">
        <div className="bg-rose-100 p-1 rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Give Support</span>
      </div>

      <motion.div 
        layout
        onClick={() => inputRef.current?.focus()}
        className={cn(
            "relative flex items-center w-full h-16 bg-white rounded-full transition-colors duration-200 overflow-hidden cursor-text border-2",
            isFocused 
              ? "border-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)]" 
              : "border-slate-200 shadow-sm hover:border-slate-300"
        )}
      >
        <div className="pl-6 flex items-center justify-center pointer-events-none z-10">
            <DollarSign className={cn("w-6 h-6 stroke-[2.5px] transition-colors", (isFocused || hasValue) ? "text-slate-900" : "text-slate-300")} />
        </div>

        <div className="flex-1 relative h-full flex items-center">
            <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="w-full h-full bg-transparent border-none focus:ring-0 text-2xl font-bold text-slate-900 placeholder:text-slate-200 pl-2 pr-2 tracking-tight outline-none"
            />
            <AnimatePresence>
                {!hasValue && !isFocused && (
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-6 text-sm font-bold text-slate-300 pointer-events-none select-none"
                    >
                        USD
                    </motion.span>
                )}
            </AnimatePresence>
        </div>

        <AnimatePresence mode="popLayout">
            {hasValue && (
                <motion.div
                    initial={{ width: 0, opacity: 0, paddingRight: 0 }}
                    animate={{ width: "auto", opacity: 1, paddingRight: 6 }}
                    exit={{ width: 0, opacity: 0, paddingRight: 0 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="flex items-center justify-end overflow-hidden h-full"
                >
                    <motion.button
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleGive()
                        }}
                        className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-lg shadow-md flex items-center gap-2 whitespace-nowrap ml-2"
                    >
                        Give
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {hasValue && (
            <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
            >
                <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                    <Sparkles className="w-3.5 h-3.5 fill-emerald-600" />
                    <span className="text-xs font-bold uppercase tracking-wide">Your gift changes lives</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
