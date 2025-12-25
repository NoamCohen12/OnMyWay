import './App.css'
import Header from './components/Header'
import Map from './components/Map'
import Footer from './components/Footer'
import Login from './pages/Login'
import ParentDashboard from './pages/ParentDashboard'
import { useState } from 'react'

function App() {
  const [userRole, setUserRole] = useState(null)

  if (!userRole) {

    return <Login onLogin={(role) => setUserRole(role)} />

  }

  if (userRole === 'parent') {
    return <ParentDashboard />
  }

  return (
    <>
      <div className="App">
        <Header />
        <Map />
        <Footer />
      </div>
    </>
  )
}

export default App
