import React from 'react'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import Filtres from '../components/Filtres'
import Sidebar from '../components/SideBar';


export default function MesLikes() {
  return (
    <div className="page">
    <Sidebar/>
    Retrouve tes annonce liké ici 
    </div>
  )
}
