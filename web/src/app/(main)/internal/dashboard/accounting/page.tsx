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
import { cn } from '@/lib/utils'
import { Building, DollarSign, Eye, TrendingDown, TrendingUp } from 'lucide-react'
import Link from 'next/link'

// Mock data for ledgers
const mockLedgers = [
  {
    id: 1,
    ledger_name: 'Fair Market Value (FMV) Ledger',
    account_type_code: 'AA',
    account_type_name: 'Asset',
    balance: 125750.5,
    transaction_count: 45,
    last_transaction: '2024-08-14T10:30:00Z',
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 2,
    ledger_name: 'Merchant Payable Ledger',
    account_type_code: 'AL',
    account_type_name: 'Liability',
    balance: -89320.25,
    transaction_count: 38,
    last_transaction: '2024-08-14T09:15:00Z',
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 3,
    ledger_name: 'Platform Revenue Ledger',
    account_type_code: 'RR',
    account_type_name: 'Revenue',
    balance: 36430.25,
    transaction_count: 42,
    last_transaction: '2024-08-14T08:45:00Z',
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 4,
    ledger_name: 'Operating Expenses',
    account_type_code: 'EE',
    account_type_name: 'Expense',
    balance: 15240.75,
    transaction_count: 28,
    last_transaction: '2024-08-13T16:20:00Z',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 5,
    ledger_name: 'Customer Deposits',
    account_type_code: 'AL',
    account_type_name: 'Liability',
    balance: -12450.0,
    transaction_count: 15,
    last_transaction: '2024-08-12T14:30:00Z',
    created_at: '2024-03-01T11:00:00Z',
  },
]

function getAccountTypeIcon(accountType: string) {
  switch (accountType) {
    case 'AA':
      return <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
    case 'AL':
      return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
    case 'RR':
      return <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    case 'EE':
      return <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
    default:
      return <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
  }
}

function getAccountTypeBadgeColor(accountType: string) {
  switch (accountType) {
    case 'AA':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'AL':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'RR':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'EE':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount))
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export default function AccountingPage() {
  const totalAssets = mockLedgers
    .filter((l) => l.account_type_code === 'AA')
    .reduce((sum, l) => sum + l.balance, 0)

  const totalLiabilities = Math.abs(
    mockLedgers.filter((l) => l.account_type_code === 'AL').reduce((sum, l) => sum + l.balance, 0),
  )

  const totalRevenue = mockLedgers
    .filter((l) => l.account_type_code === 'RR')
    .reduce((sum, l) => sum + l.balance, 0)

  const totalExpenses = mockLedgers
    .filter((l) => l.account_type_code === 'EE')
    .reduce((sum, l) => sum + l.balance, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Accounting</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your ledgers and financial transactions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Building className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalAssets)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalLiabilities)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ledgers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledgers Overview</CardTitle>
          <CardDescription>All accounting ledgers and their current balances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ledger Name</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead>Last Transaction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLedgers.map((ledger) => (
                <TableRow
                  key={ledger.id}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getAccountTypeIcon(ledger.account_type_code)}
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {ledger.ledger_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {ledger.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(getAccountTypeBadgeColor(ledger.account_type_code))}
                    >
                      {ledger.account_type_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-medium',
                        ledger.balance >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {ledger.balance >= 0 ? '+' : '-'}
                      {formatCurrency(ledger.balance)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {ledger.transaction_count}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(ledger.last_transaction)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/internal/dashboard/accounting/ledgers/${ledger.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
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
