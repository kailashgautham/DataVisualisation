import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Plotly from './Plotly';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Data Visualization Demo</h1>
        </header>
        <main className="main-content">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/plotly">Plotly</Link>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plotly" element={<Plotly />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
