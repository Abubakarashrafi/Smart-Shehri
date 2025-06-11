# 🏙️ Smart Shehri

Smart Shehri is a modern web-based complaint and task management system for municipal governance. It empowers citizens to report city issues and enables administrators to manage departments, workers, and complaint resolution efficiently.

## 🚀 Features

### 🧑‍💼 Admin Panel
- Manage Departments, Workers, Cities
- Assign complaints to relevant departments and workers
- Visual dashboards for:
  - Department performance & efficiency
  - Active workers overview
  - Complaint statistics (charts & graphs)
- Add/edit entities through dynamic modals
- Track resolution status and ratings

### 🧑‍💻 Citizen Interface
- Multi-step complaint submission form:
  - Personal Information
  - Location & Category
  - Detailed Complaint
- Intuitive category icons and priority level selection
- Mobile-responsive design

### 📊 Dashboards & Charts
- Department performance with efficiency bars
- Complaint category breakdown via pie chart
- Department ratings using bar charts

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React (with Tailwind CSS) | Express.js |
| Recharts (for data visualization) | PostgreSQL |
| Lucide Icons | Zod (for validation) |

### Libraries & Tools
- `axios` (API requests)
- `lucide-react` (icon system)
- `recharts` (charts and graphs)

## 📁 Folder Structure
smart-shehri/
│
├── client/ 
│ ├── src/
|    ├── hooks/
│    ├── pages/
│    ├── service/ 
│ └── App.jsx 
| └── Main.jsx
| └── index.css
│
├── server/ # Express Backend
│ ├── routes/ # API endpoints (departments, complaints, etc.)
│ ├── controllers/ # Request handlers
│ ├── db/ # PostgreSQL connection and queries
│ └── index.js # Server entry point



## 🧪 Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-shehri.git
cd smart-shehri
```
2. **Start the Backend**
```bash 
cd server
npm install
npm run dev
```

3. **Start the frontend**

```bash 
cd client
npm install
npm run dev

```

4. **Configure environment variables**
Set up the .env files in both client and server with appropriate values like:

for server
/server/.env
```bash
DB_URL=postgres://username:password@localhost:port/db_name
PORT = 3000
CLIENT_URL = 'http://localhost:5173'
```
for client
/client/.env.local
```bash
VITE_API_BASE_URL = 'http://localhost:3000'

```
# 📄 License
MIT License © 2025 Smart Shehri Team