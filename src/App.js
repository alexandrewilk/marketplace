import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn"
import Offers from "./pages/Offers";
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Header from "./components/Header";
import Footer from './components/Footer'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Annonce from './pages/Annonce';
import MesAnnonces from './pages/MesAnnonces';
import MesLikes from './pages/MesLikes';
import MesAlertes from './pages/MesAlertes';
import Settings from './pages/Settings';


export default function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/MesAnnonces' element={<MesAnnonces/>}/>
        <Route path='/MesLikes' element={<MesLikes/>}/>
        <Route path='/MesAlertes' element={<MesAlertes/>}/>
        <Route path='/Settings' element={<Settings/>}/>
        <Route path='/Annonce' element={<Annonce/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/offers' element={<Offers/>}/>
        <Route path='/listings/:listingID' element={<Listing/>}/>
        <Route path='/create-listing' element={<PrivateRoute/>}>
          <Route path='/create-listing' element={<CreateListing/>}/>
        </Route>
      </Routes>
      <Footer/>
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