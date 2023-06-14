import React, { useState, useEffect }from 'react'
import "react-activity/dist/library.css";
import { Dots } from "react-activity";
const logements = ['Villa', 'Appart', 'Maison'];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export default function CreateListing() {
    
    const [logement, setLogement] = useState('');
    const [nbRooms, setNbRooms] = useState(null);
    const [adresse, setAdresse] = useState('');
    const [loyer, setLoyer] = useState(0);
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false)
    function handleAddListing(e){
        if(logement==''){
            return
        }
        if(!nbRooms){
            return
        }
        if(adresse==''){
            return
        }
        if(loyer==0){
            return
        }
        if(!images){
            return
        }


    }
  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-center'>CREATELISTING</h1>
        <label >Choisis un type de logement:</label>
        <select onChange={(e) => {setLogement(e.target.value)}} id='logement'>
        <option value="">--Type de logement--</option>
        {logements.map((option) => (
              <option value={option} key={option}>{option}</option>
            ))}
        </select>
        <label >Combien de pièces brother</label>
        <select onChange={(e) => {setNbRooms(e.target.value)}} id='room'>
        <option value="">--Nombre de pièces--</option>
        {rooms.map((option, index) => (
              <option value={option} key={option}>{index ===9 ? option+'+': option}</option>
            ))}
        </select>
        <label>C quoi ladresse</label>
        <input type='text' onChange={(e)=>{setAdresse(e.target.value)}} placeholder='adresse'/>
        <label>Prix du loyer potow</label>
        <input type='number' onChange={(e)=>{setLoyer(e.target.value)}} placeholder='Loyer'/>
        <label>Image du délire stp</label>
        <input type='file' id='images' accept='.jpg, .png, .jpeg' multiple onChange={(e)=>setImages(e.target.files)}></input>
        {loading ?  <Dots /> :<button onClick={handleAddListing}>Lister mon Annonce</button>}
    </div>
  )
}
