import requests
from typing import Dict, Optional
from decimal import Decimal
import re

class OCRService:
    """OCR service for receipt processing"""
    
    def __init__(self):
        self.api_endpoint = "https://ocr.asprise.com/api/v1/receipt"
    
    def process_receipt(self, image_path: str) -> Dict:
        """Process receipt image and extract data"""
        try:
            with open(image_path, 'rb') as image_file:
                response = requests.post(
                    self.api_endpoint,
                    data={
                        'api_key': 'TEST',  # Replace with actual API key
                        'recognizer': 'auto',
                    },
                    files={'file': image_file}
                )
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_ocr_response(data)
            else:
                return {}
        
        except Exception as e:
            print(f"OCR Error: {str(e)}")
            return {}
    
    def _parse_ocr_response(self, data: Dict) -> Dict:
        """Parse OCR API response"""
        parsed_data = {
            'merchant_name': '',
            'total_amount': None,
            'date': None,
            'currency': 'USD',
            'line_items': [],
            'raw_data': data
        }
        
        if 'receipts' in data and len(data['receipts']) > 0:
            receipt = data['receipts'][0]
            
            # Extract merchant name
            parsed_data['merchant_name'] = receipt.get('merchant_name', '')
            
            # Extract total
            total = receipt.get('total', 0)
            parsed_data['total_amount'] = Decimal(str(total)) if total else None
            
            # Extract date
            parsed_data['date'] = receipt.get('date', '')
            
            # Extract currency
            parsed_data['currency'] = receipt.get('currency', 'USD')
            
            # Extract line items
            items = receipt.get('items', [])
            for item in items:
                parsed_data['line_items'].append({
                    'description': item.get('description', ''),
                    'amount': Decimal(str(item.get('amount', 0))),
                    'quantity': item.get('qty', 1)
                })
        
        return parsed_data
    
    @staticmethod
    def auto_fill_expense(expense, ocr_data: Dict):
        """Auto-fill expense from OCR data"""
        if ocr_data.get('total_amount'):
            expense.amount = ocr_data['total_amount']
        
        if ocr_data.get('currency'):
            expense.currency = ocr_data['currency']
        
        if ocr_data.get('date'):
            from django.utils.dateparse import parse_date
            expense.expense_date = parse_date(ocr_data['date'])
        
        if ocr_data.get('merchant_name') and not expense.description:
            expense.description = f"Expense at {ocr_data['merchant_name']}"
        
        expense.ocr_data = ocr_data
        return expense
