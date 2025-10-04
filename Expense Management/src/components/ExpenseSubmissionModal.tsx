import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/custom-select';
import { Card, CardContent } from './ui/card';
import { DatePicker } from './ui/date-picker';
import { Upload, Camera, X, Sparkles, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ExpenseSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: {
    description: string;
    category: string;
    amount: number;
    currency: string;
    date: string;
  }) => void;
}

const categories = [
  'Travel',
  'Meals',
  'Supplies',
  'Equipment',
  'Software',
  'Training',
  'Entertainment',
  'Other'
];

const currencies = [
  'USD', 'EUR', 'GBP', 'CAD', 'JPY', 'AUD', 'INR'
];

export default function ExpenseSubmissionModal({ isOpen, onClose, onSubmit }: ExpenseSubmissionModalProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrError, setOcrError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      category,
      amount: parseFloat(amount),
      currency,
      date: date ? date.toISOString().split('T')[0] : ''
    });
    // Reset form
    setAmount('');
    setCurrency('USD');
    setCategory('');
    setDate(undefined);
    setDescription('');
    setReceipt(null);
    setOcrError('');
    onClose();
  };

  const handleReceiptUpload = async (file: File) => {
    setReceipt(file);
    setOcrProcessing(true);
    setOcrError('');

    // Simulate OCR processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR results
      const mockOcrResults = {
        amount: '45.99',
        date: new Date('2024-01-28'),
        description: 'Restaurant receipt - business lunch'
      };

      setAmount(mockOcrResults.amount);
      setDate(mockOcrResults.date);
      setDescription(mockOcrResults.description);
      
    } catch (error) {
      setOcrError('Failed to process receipt. Please enter details manually.');
    } finally {
      setOcrProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleReceiptUpload(file);
    }
  };

  const removeReceipt = () => {
    setReceipt(null);
    setOcrError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            Submit New Expense
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            Fill out the form below to submit a new expense for approval. Use OCR to auto-fill from receipts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OCR Receipt Upload Section */}
          <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-200">
            <CardContent className="pt-8 pb-6">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">Smart Receipt Scanner</h3>
                <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
                  Upload a receipt image to automatically extract expense details
                </p>
                
                {!receipt && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="receipt-upload"
                    />
                    <label htmlFor="receipt-upload">
                      <Button 
                        type="button" 
                        className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200" 
                        asChild
                      >
                        <span className="flex items-center gap-3">
                          <Upload className="h-5 w-5" />
                          Upload Receipt
                        </span>
                      </Button>
                    </label>
                  </div>
                )}

                {receipt && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between bg-white/80 dark:bg-gray-700/80 p-4 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-blue-900 dark:text-blue-100">{receipt.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeReceipt}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {ocrProcessing && (
                      <div className="mt-4 flex items-center justify-center gap-3 text-blue-600 dark:text-blue-400">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600/30 border-t-blue-600"></div>
                        <span className="font-medium">Processing receipt with AI...</span>
                      </div>
                    )}
                  </div>
                )}

                {ocrError && (
                  <Alert variant="destructive" className="mt-4 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                    <AlertDescription className="text-red-800 dark:text-red-200">{ocrError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Expense Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="0.00"
                className="h-12 text-lg font-semibold bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="currency" className="text-sm font-semibold">Currency</Label>
              <Select value={currency} onValueChange={setCurrency} required>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-600" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Date of Expense
              </Label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select expense date"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter a detailed description of the expense..."
              rows={4}
              className="bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-gray-500 dark:focus:border-gray-400 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-12 px-8 font-semibold"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={ocrProcessing}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {ocrProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Submit Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}