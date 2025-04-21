import { FC, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { X } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder: string
  searchPlaceholder?: string
  maxItems?: number
  className?: string
}

export const MultiSelect: FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder,
  searchPlaceholder = 'Search...',
  maxItems,
  className = '',
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else if (!maxItems || selectedValues.length < maxItems) {
      onChange([...selectedValues, value])
    }
  }

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value))
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <Command className="rounded-lg border shadow-sm">
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="mr-2"
                  />
                  {option.label}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedValues.map((value) => {
          const option = options.find((o) => o.value === value)
          return (
            <div
              key={value}
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              {option?.label}
              <button
                onClick={() => handleRemove(value)}
                className="text-purple-600 hover:text-purple-800"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
