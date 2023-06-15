import React from 'react'
import AnnonceCard from '../components/AnnonceCard'
import '../styles/home.css'
import Filtres from '../components/Filtres'


export default function Home() {
  return (
    <div className="page">
    <Filtres/>
      <div className="grid">
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
        <AnnonceCard/>
      </div>
    </div>
  )
}
