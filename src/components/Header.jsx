import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Header() {
  const [pageState, setPageState] = useState('Se connecter');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setPageState(user ? 'Profile' : 'Se connecter');
    });
  }, [auth]);

  const location = useLocation();
  const navigate = useNavigate();

  function routeMatchPath(route) {
    return route === location.pathname;
  }

  return (
    <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center">
          <img src="https://coloc.fr/wp-content/uploads/2023/01/Coloc.fr_-1.png" className="h-8 mr-3" alt="Flowbite Logo"/>
        </a>
        <div className="flex md:order-2">
        <button 
          type="button" 
          onClick={() => navigate(pageState === 'Profile' ? '/profile' : '/sign-in')}
          className={`text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 ${routeMatchPath('/sign-in') || routeMatchPath('/profile') ? 'active' : ''}`}>
          {pageState}
        </button>
          <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Ouvrir le menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:border-gray-700">
            <li className={`cursor-pointer ${routeMatchPath('/') ? 'active' : ''}`} onClick={() => navigate("/")}>
              Accueil
            </li>
            <li className={`cursor-pointer ${routeMatchPath('/offers') ? 'active' : ''}`} onClick={() => navigate("/offers")}>
              Offres
            </li>
            <li className={`cursor-pointer ${routeMatchPath('/offers') ? 'active' : ''}`} onClick={() => navigate("/Annonce")}>
              Annonces
            </li>
            <li className={`cursor-pointer ${routeMatchPath('/offers') ? 'active' : ''}`} onClick={() => navigate("/offers")}>
              Contact
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
