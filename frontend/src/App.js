import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/Register.js'
import Login from './pages/Login.js'
import OAuthSuccessPage from './pages/OAuthSuccess.js';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth-success" element={<OAuthSuccessPage />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
