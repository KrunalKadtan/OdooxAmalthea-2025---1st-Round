import pytesseract
from PIL import Image
import re
from datetime import datetime

def extract_receipt_data(image_file):
    """Extract data from receipt image using OCR"""
    try:
        image = Image.open(image_file)
        text = pytesseract.image_to_string(image)
        
        # Extract amount (look for currency symbols and numbers)
        amount_pattern = r'[\$€£]?\s*(\d+[.,]\d{2})'
        amounts = re.findall(amount_pattern, text)
        amount = amounts[-1].replace(',', '.') if amounts else '0.00'
        
        # Extract date
        date_pattern = r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})'
        dates = re.findall(date_pattern, text)
        date = dates[0] if dates else datetime.now().strftime('%Y-%m-%d')
        
        # Extract vendor (usually first line)
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        vendor = lines[0] if lines else ''
        
        return {
            'amount': amount,
            'date': date,
            'vendor_name': vendor,
            'raw_text': text
        }
    except Exception as e:
        return {
            'error': str(e),
            'amount': '0.00',
            'date': datetime.now().strftime('%Y-%m-%d'),
            'vendor_name': ''
        }
