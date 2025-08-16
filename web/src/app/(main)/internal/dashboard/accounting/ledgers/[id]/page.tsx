'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  Hash,
  Plus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

// Mock data for individual ledger
const mockLedger = {
  id: 1,
  ledger_name: 'Fair Market Value (FMV) Ledger',
  account_type_code: 'AA',
  account_type_name: 'Asset',
  balance: 125750.5,
  transaction_count: 45,
  created_at: '2024-01-15T09:00:00Z',
}

// Mock data for transactions
const mockTransactions = [
  {
    id: 'txn_001',
    created_at: '2024-08-14T10:30:00Z',
    amount: 2500.0,
    is_debit: true,
    description: 'Customer payment received - Order #12345',
    order_id: 'ORDER-12345',
    account_name: 'Customer Account - John Doe',
  },
  {
    id: 'txn_002',
    created_at: '2024-08-14T09:15:00Z',
    amount: 1750.25,
    is_debit: true,
    description: 'Marketplace transaction fee',
    order_id: 'ORDER-12344',
    account_name: 'Platform Revenue',
  },
  {
    id: 'txn_003',
    created_at: '2024-08-13T16:20:00Z',
    amount: 500.0,
    is_debit: false,
    description: 'Refund processed - Order #12300',
    order_id: 'ORDER-12300',
    account_name: 'Customer Account - Jane Smith',
  },
  {
    id: 'txn_004',
    created_at: '2024-08-13T14:45:00Z',
    amount: 3200.75,
    is_debit: true,
    description: 'Bulk order payment',
    order_id: 'ORDER-12299',
    account_name: 'Business Account - Pet Store Co.',
  },
  {
    id: 'txn_005',
    created_at: '2024-08-12T11:30:00Z',
    amount: 850.5,
    is_debit: false,
    description: 'Merchant payout adjustment',
    order_id: null,
    account_name: 'Merchant Account - ABC Pets',
  },
]

// Mock data for available ledgers for transaction creation
const availableLedgers = [
  { id: 2, name: 'Merchant Payable Ledger' },
  { id: 3, name: 'Platform Revenue Ledger' },
  { id: 4, name: 'Operating Expenses' },
  { id: 5, name: 'Customer Deposits' },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
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

export default function LedgerDetailsPage() {
  const params = useParams()
  const ledgerId = params.id as string

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedLedger, setSelectedLedger] = useState('')
  const [transactionAmount, setTransactionAmount] = useState('')

  const handleCreateTransaction = () => {
    if (selectedLedger && transactionAmount) {
      console.log('Creating transaction:', {
        fromLedger: ledgerId,
        toLedger: selectedLedger,
        amount: parseFloat(transactionAmount),
      })
      // Here you would make an API call to create the transaction
      setIsCreateModalOpen(false)
      setSelectedLedger('')
      setTransactionAmount('')
    }
  }

  const totalDebits = mockTransactions
    .filter((t) => t.is_debit)
    .reduce((sum, t) => sum + t.amount, 0)

  const totalCredits = mockTransactions
    .filter((t) => !t.is_debit)
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/internal/dashboard/accounting">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Ledgers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {mockLedger.ledger_name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ledger ID: {ledgerId} • {mockLedger.account_type_name} Account
            </p>
          </div>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
              <DialogDescription>
                Create a new ledger transaction between {mockLedger.ledger_name} and another ledger.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-ledger">Target Ledger</Label>
                <Select value={selectedLedger} onValueChange={setSelectedLedger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ledger" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLedgers.map((ledger) => (
                      <SelectItem key={ledger.id} value={ledger.id.toString()}>
                        {ledger.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTransaction}
                  disabled={!selectedLedger || !transactionAmount}
                >
                  Create Transaction
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'text-2xl font-bold',
                mockLedger.balance >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400',
              )}
            >
              {mockLedger.balance >= 0 ? '+' : '-'}
              {formatCurrency(mockLedger.balance)}
            </div>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span>Debits: {formatCurrency(totalDebits)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span>Credits: {formatCurrency(totalCredits)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Hash className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {mockLedger.transaction_count}
            </div>
            <div className="flex items-center space-x-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>Since {formatDate(mockLedger.created_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All transactions for this ledger</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        transaction.is_debit
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                      )}
                    >
                      {transaction.is_debit ? 'Debit' : 'Credit'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-medium',
                        transaction.is_debit
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400',
                      )}
                    >
                      {transaction.is_debit ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="h-3 w-3 text-gray-500" />
                      <span className="font-medium text-sm">{transaction.account_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {transaction.description}
                      </div>
                      {transaction.order_id && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Order: {transaction.order_id}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(transaction.created_at)}
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
