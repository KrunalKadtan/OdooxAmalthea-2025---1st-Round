import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Calendar, DollarSign, FileText, User, Clock } from 'lucide-react';

interface ExpenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    id: string;
    employeeName: string;
    description: string;
    category: string;
    amount: number;
    currency: string;
    convertedAmount: number;
    date: string;
    status: string;
    submissionDate: string;
    rejectionReason?: string;
  } | null;
  companyDefaultCurrency?: string;
}

export default function ExpenseDetailsModal({ 
  isOpen, 
  onClose, 
  expense, 
  companyDefaultCurrency = 'USD' 
}: ExpenseDetailsModalProps) {
  if (!expense) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      case 'approved_manager':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Approved by Manager</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Expense Details
            {getStatusBadge(expense.status)}
          </DialogTitle>
          <DialogDescription>
            Review the complete expense information and submission details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Information */}
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{expense.employeeName}</p>
              <p className="text-sm text-muted-foreground">Employee</p>
            </div>
          </div>

          <Separator />

          {/* Expense Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{expense.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="outline">{expense.category}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Amount</p>
                  <div>
                    <p className="text-lg font-semibold text-green-600">
                      {companyDefaultCurrency} {expense.convertedAmount.toFixed(2)}
                    </p>
                    {expense.currency !== companyDefaultCurrency && (
                      <p className="text-sm text-muted-foreground">
                        Original: {expense.currency} {expense.amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Expense Date</p>
                <p className="text-sm text-muted-foreground">{expense.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Submitted On</p>
                <p className="text-sm text-muted-foreground">{expense.submissionDate}</p>
              </div>
            </div>
          </div>

          {/* Rejection Reason (if applicable) */}
          {expense.rejectionReason && (
            <>
              <Separator />
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-medium text-red-800 dark:text-red-200 mb-2">Rejection Reason</p>
                <p className="text-sm text-red-700 dark:text-red-300">{expense.rejectionReason}</p>
              </div>
            </>
          )}

          {/* Receipt Section (Mock) */}
          <Separator />
          <div>
            <p className="font-medium mb-3">Attachments</p>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Receipt_001.pdf</p>
              <p className="text-xs text-muted-foreground mt-1">84 KB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}