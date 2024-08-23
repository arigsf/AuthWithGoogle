import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedPage from './ProtectedPage';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

function routes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/protected" element={<ProtectedRoute element={<ProtectedPage />} />} />
      </Routes>
    </Router>
  );
}

export default routes;