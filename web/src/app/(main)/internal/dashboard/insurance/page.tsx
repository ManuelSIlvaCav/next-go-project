'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Plus, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Mock data - replace with actual API call
const mockInsurancePlans = [
  {
    id: '1',
    policyNumber: 'POL-12345678',
    displayName: 'Essential Pet Care',
    variantsCount: 3,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    policyNumber: 'POL-87654321',
    displayName: 'Premium Pet Protection',
    variantsCount: 5,
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    policyNumber: 'POL-11223344',
    displayName: 'Basic Coverage Plan',
    variantsCount: 2,
    status: 'inactive',
    createdAt: '2024-03-10',
  },
]

export default function InsurancePlansPage() {
  const router = useRouter()
  const [insurancePlans, setInsurancePlans] = useState(mockInsurancePlans)
  const [loading, setLoading] = useState(false)

  // TODO: Replace with actual API call
  useEffect(() => {
    // fetchInsurancePlans()
  }, [])

  const handleRowClick = (planId: string) => {
    router.push(`/internal/dashboard/insurance/${planId}`)
  }

  const handleCreatePlan = () => {
    router.push('/internal/dashboard/insurance/create')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between items-start gap-4 md:flex-row ">
        <div className="space-y-2">
          <h1 className="font-fredoka text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3 text-gray-900 dark:text-white">
            <Shield className="h-8 w-8 md:h-10 md:w-10" />
            Insurance Plans Management
          </h1>
          <p className="font-latto text-muted-foreground text-base md:text-lg">
            Manage your insurance policies and plan variants
          </p>
        </div>
        <Button onClick={handleCreatePlan} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Plans
            </CardTitle>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-fredoka text-3xl font-bold text-gray-900 dark:text-white">
              {insurancePlans.length}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Active Plans
            </CardTitle>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Active
            </Badge>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-fredoka text-3xl font-bold text-gray-900 dark:text-white">
              {insurancePlans.filter((plan) => plan.status === 'active').length}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">Currently available</p>
          </CardContent>
        </Card>
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="font-latto text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Variants
            </CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="font-fredoka text-3xl font-bold text-gray-900 dark:text-white">
              {insurancePlans.reduce((sum, plan) => sum + plan.variantsCount, 0)}
            </div>
            <p className="font-latto text-sm text-muted-foreground mt-1">Across all plans</p>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Plans Table */}
      <Card className="p-6">
        <CardHeader className="pb-6">
          <CardTitle className="font-fredoka text-2xl font-bold text-gray-900 dark:text-white">
            Insurance Plans
          </CardTitle>
          <CardDescription className="font-latto text-base text-muted-foreground">
            Click on any row to view plan details and manage variants
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-latto font-medium">Policy Number</TableHead>
                <TableHead className="font-latto font-medium">Plan Name</TableHead>
                <TableHead className="font-latto font-medium">Variants</TableHead>
                <TableHead className="font-latto font-medium">Status</TableHead>
                <TableHead className="font-latto font-medium">Created</TableHead>
                <TableHead className="font-latto font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insurancePlans.map((plan) => (
                <TableRow
                  key={plan.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(plan.id)}
                >
                  <TableCell className="font-latto font-medium">{plan.policyNumber}</TableCell>
                  <TableCell className="font-latto">{plan.displayName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-latto">
                      {plan.variantsCount} variant{plan.variantsCount !== 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={plan.status === 'active' ? 'default' : 'secondary'}
                      className={`font-latto ${
                        plan.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : ''
                      }`}
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-latto">{plan.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRowClick(plan.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
