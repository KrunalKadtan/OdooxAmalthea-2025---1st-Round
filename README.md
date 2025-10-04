# Intelligent Expense Management System

An offline-capable expense management system with OCR-powered receipt scanning.

## Features
- Multi-user authentication (Admin, Manager, Employee roles)
- OCR receipt scanning with auto-populated expense forms
- Multi-currency support with automatic conversion
- Manager approval workflow
- Offline capability (IndexedDB queue)

## Tech Stack
- **Frontend**: React + Material-UI
- **Backend**: Django + Django Rest Framework
- **Database**: Supabase (PostgreSQL)
- **OCR**: Tesseract.js / Cloud Vision API

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SECRET_KEY=your_django_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## User Roles
- **Admin**: Create company, manage users, set roles
- **Manager**: Approve/reject team expenses
- **Employee**: Submit expenses, view history
