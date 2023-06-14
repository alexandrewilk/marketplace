import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn"
import Offers from "./pages/Offers";
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Header from "./components/Header";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/offers' element={<Offers/>}/>
      </Routes>
      <ToastContainer
position="bottom-left"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
    </Router>
  )
}