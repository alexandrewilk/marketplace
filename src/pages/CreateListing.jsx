import React, { useState, useEffect }from 'react'
import "react-activity/dist/library.css";
import { Dots } from "react-activity";
import {storage, auth, db} from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {v4 as uuid} from 'uuid'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
const logements = ['Villa', 'Appart', 'Maison'];
const rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export default function CreateListing() {
    const navigate = useNavigate();
    const [logement, setLogement] = useState('');
    const [nbRooms, setNbRooms] = useState(null);
    const [adresse, setAdresse] = useState('');
    const [loyer, setLoyer] = useState(0);
    const [images, setImages] = useState(null);
    const [loading, setLoading] = useState(false);
    async function storeImage(image){
        return new Promise((resolve, reject)=>{
            const filename = `${auth.currentUser.uid}-${image.name}-${uuid()}`;
            const storageRef = ref(storage, filename);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    reject(error)
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve(downloadURL);
    });
  }
);
        })
    }
    async function handleAddListing(e){
        e.preventDefault();
        if(logement==''){
            alert('type de log')
            return
        }
        if(!nbRooms){
            alert('nb de rooms')
            return
        }
        if(adresse==''){
            alert('adresse?')
            return
        }
        if(loyer==0){
            alert('loyer')
            return
        }
        if(!images){
            alert('uploaduneimage')
            return
        }
        if(images.length > 6){
            alert('max 6 img')
            return
        }
        try{
            setLoading(true)
            const imgUrls = await Promise.all([...images].map((image) => storeImage(image)))
            const entry = {
                type: logement,
                nbPieces: nbRooms,
                adresse: adresse,
                loyer: Number(loyer),
                imgUrls: imgUrls,
                timestamp: serverTimestamp(),
                userRef: auth.currentUser.uid
            }
            const collectionRef = collection(db, 'Listings');
            const docRef = await addDoc(collectionRef, entry)
            navigate(`/listings/${docRef.id}`)
        }catch(error){
            alert(error.message)
        }finally{
            setLoading(false);
          
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
        {loading ?  <Dots /> :<button onClick={handleAddListing} className='bg-blue-800 text-white'>Lister mon Annonce</button>}
    </div>
  )
}
