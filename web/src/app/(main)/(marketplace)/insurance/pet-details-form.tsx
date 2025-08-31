'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface PetDetails {
  name: string
  type: 'dog' | 'cat' | ''
  age: string
  isInsured: boolean
}

interface PetDetailsFormProps {
  data: PetDetails
  onChange: (data: PetDetails) => void
}

export function PetDetailsForm({ data, onChange }: PetDetailsFormProps) {
  return (
    <div className="px-4 md:px-0">
      <Card className="max-w-2xl mx-auto dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="font-fredoka text-xl md:text-2xl text-center dark:text-white">
            Tell us about your pet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4 md:p-6">
          {/* Pet Name */}
          <div>
            <Label
              htmlFor="petName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Pet Name
            </Label>
            <Input
              id="petName"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              placeholder="Enter your pet's name"
              className="mt-1"
            />
          </div>

          {/* Pet Type */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pet Type</Label>
            <Select
              value={data.type}
              onValueChange={(value: 'dog' | 'cat') => onChange({ ...data, type: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select pet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pet Age */}
          <div>
            <Label
              htmlFor="petAge"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Age (years)
            </Label>
            <Input
              id="petAge"
              type="number"
              min="0"
              max="30"
              value={data.age}
              onChange={(e) => onChange({ ...data, age: e.target.value })}
              placeholder="Enter age"
              className="mt-1"
            />
          </div>

          {/* Is Currently Insured */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isInsured"
              checked={data.isInsured}
              onCheckedChange={(checked) => onChange({ ...data, isInsured: checked as boolean })}
            />
            <Label htmlFor="isInsured" className="text-sm text-gray-700 dark:text-gray-300">
              My pet is currently insured with another provider
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
