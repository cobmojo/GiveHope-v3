"use client"

import { useId } from "react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

const InputEndButtonDemo = () => {
  const id = useId()

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor={id}>Input with end button</Label>
      <div className="flex rounded-md shadow-sm">
        <Input
          id={id}
          type="email"
          placeholder="Email address"
          className="-me-px rounded-r-none shadow-none focus-visible:z-10"
        />
        <Button className="rounded-l-none">Subscribe</Button>
      </div>
    </div>
  )
}

export default InputEndButtonDemo