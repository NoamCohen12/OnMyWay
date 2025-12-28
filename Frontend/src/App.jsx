import './App.css'
import Header from './components/Header'
import Map from './components/Map'
import Footer from './components/Footer'
import Login from './pages/Login'
import AttendantSignIn from './pages/AttendantSignIn'
import ParentDashboard from './pages/ParentDashboard'
import { useState } from 'react'

function App() {
  const [userRole, setUserRole] = useState(null)
  const [currentPage, setCurrentPage] = useState('login');


  if (currentPage === 'login') {
    return (
      <Login
        onLogin={(role) => {
          setUserRole(role);
          setCurrentPage(
            role === 'attendant' ? 'attendantSignIn' : 'parentDashboard'
          );
        }}
      />
    );
  }

  if (currentPage === 'attendantSignIn')
    return <AttendantSignIn
      onLogin={() => setCurrentPage('app')}
      onBack={() => setCurrentPage('login')}
    />

  if (currentPage === 'parentDashboard')
    return <ParentDashboard />

  if (currentPage === 'app')
    return (
      <div className="App">
        <Header />
        <Map />
        <Footer />
      </div>
    )
}
export default App
