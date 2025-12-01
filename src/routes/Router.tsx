import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from '../pages/home';
import { Login } from '../pages/login';
import { New } from '../pages/New';
import { Profile } from '../pages/profile';
import { SignUp } from '../pages/signup';

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </BrowserRouter>
  );
};
