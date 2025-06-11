import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Header from './pages/Component/Header';
import HomePage from './pages/Home';
import ComplaintForm from './pages/ComplaintForm';
import Dashboard from './pages/Dashboard';
 import Admin from './pages/Admin';
import ComplaintsList from './pages/ComplaintList';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
          <Route path='/' element={<HomePage/>}/>
            <Route path="/submit-complaint" element={<ComplaintForm />} />
            <Route path="/dashboard" element={<Dashboard />} Navigate />
            <Route path="/complaints" element={<ComplaintsList />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;