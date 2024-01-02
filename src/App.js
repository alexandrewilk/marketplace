import { BrowserRouter as Router, Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import SignIn from "./pages/Auth/SignIn"
import SignUp from "./pages/Auth/SignUp"
import Profile from "./pages/User/Profile"
import Header from "./components/Reusable/Header";
import Footer from './components/Reusable/Footer'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/Reusable/PrivateRoute";
import CreateListing from "./pages/Listing/CreateListing";
import Listing from "./pages/Listing/Listing";
import MesAnnonces from './pages/User/MesAnnonces';
import MesLikes from './pages/User/MesLikes';
import MesAlertes from './pages/User/MesAlertes';
import Settings from './pages/User/Settings';
import Recherche from "./pages/Recherche";
import Messagerie from './pages/User/Messagerie';

function Layout() {
  const location = useLocation();
  const hideFooterFor = ["/sign-in", "/sign-up", "/mot-de-passe-oublie", "/Messagerie"];
  const isRecherchePage = location.pathname.startsWith("/recherche");

  return (
    <>
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
        <Route path='/MesAlertes' element={<PrivateRoute/>}>
          <Route path='/MesAlertes' element={<MesAlertes/>}/>
          </Route>
        <Route path='/Messagerie' element={<PrivateRoute/>}>
          <Route path='/Messagerie' element={<Messagerie/>}/>
        </Route>
        <Route path='/Settings' element={<PrivateRoute/>}>
          <Route path='/Settings' element={<Settings/>}/>
        </Route>
        <Route path='/mot-de-passe-oublie' element={<ForgotPassword/>}/>
        <Route path='/listings/:listingID' element={<Listing/>}/>
        <Route path='/recherche/:ville' element={<Recherche/>}/>
        <Route path='/Déposer-une-annonce' element={<PrivateRoute/>}>
          <Route path='/Déposer-une-annonce' element={<CreateListing/>}/>
        </Route>

      </Routes>
      {!hideFooterFor.includes(location.pathname) && !isRecherchePage && <Footer/>}
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
    </>
  )
}

export default function App() {

  return (
  <Router>
    <Layout/>
  </Router>
  )
}