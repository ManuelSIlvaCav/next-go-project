'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Review() {
  return (
    <div className="px-4 md:px-0">
      <Card className="max-w-2xl mx-auto dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="font-fredoka text-xl md:text-2xl text-center dark:text-white">
            Review Your Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">This step will be implemented soon</p>
            <p className="text-sm mt-2">
              Here you&apos;ll review your pet details and selected plan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
