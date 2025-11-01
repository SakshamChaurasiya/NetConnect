import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Loader from './components/Loader';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return currentView === 'login' ? (
      <Login onSwitchToRegister={() => setCurrentView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setCurrentView('login')} />
    );
  }

  return <Feed />;
};

export default App;
