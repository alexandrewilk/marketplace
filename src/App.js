import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import Header from "./components/Header";
import Footer from './components/Footer'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import MesAnnonces from './pages/MesAnnonces';
import MesLikes from './pages/MesLikes';
import MesAlertes from './pages/MesAlertes';
import Settings from './pages/Settings';
import Recherche from "./pages/Recherche";


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
        <Route path='/MesAnnonces' element={<PrivateRoute/>}>
          <Route path='/MesAnnonces' element={<MesAnnonces/>}/>
        </Route>
        <Route path='/MesLikes' element={<PrivateRoute/>}>
        <Route path='/MesLikes' element={<MesLikes/>}/>
        </Route>
        <Route path='/MesAlertes' element={<MesAlertes/>}/>
        <Route path='/Settings' element={<PrivateRoute/>}>
          <Route path='/Settings' element={<Settings/>}/>
        </Route>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/listings/:listingID' element={<Listing/>}/>
        <Route path='/recherche/:ville' element={<Recherche/>}/>
        <Route path='/create-listing' element={<PrivateRoute/>}>
          <Route path='/create-listing' element={<CreateListing/>}/>
        </Route>
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