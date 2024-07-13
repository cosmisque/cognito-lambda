import { useEffect } from 'react';
import { useAuth } from './context/auth';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/Login';
import { Flex } from '@mantine/core';
import { ToastContainer } from 'react-toastify';
import DashBoard from './pages/board/DashBoard';
import { Header } from './components/header/Header';
import UserBoard from './pages/board/UserBoard';
import PrivateRoute from './route/PrivateRoute';

import './App.css';
import '@mantine/core/styles.css';

function App() {
  return (
    <>
      <Header />
      <Flex direction="row">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="" element={<DashBoard />} />
            <Route path="/dashboard/:userPoolId" element={<UserBoard />} />
          </Route>
        </Routes>
        <ToastContainer
          hideProgressBar={true}
          position="bottom-right"
          autoClose={3000}
        />
      </Flex>
    </>
  );
}

export default App;
