import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhotosPage } from './PhotosPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotosPage />} />
      </Routes>
    </Router>
  );
}

export default App;
