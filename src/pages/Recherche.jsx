import { collection, getDocs, limit, query, where } from 'firebase/firestore'
import React, {useState, useEffect} from 'react'
import { Dots } from 'react-activity'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase'
import AnnonceCard from '../components/AnnonceCard'


const villes = require('../assets/data/villes2.json')
export default function Recherche() {
    const params = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [annonces, setAnnonces] = useState([])
    const villeInfo = villes.find((v)=>{return(v.city == params.ville)})
    useEffect(()=>{
        async function fetchData(){
            if(!villeInfo){setLoading(false);return}
            try {
                const q = query(collection(db, 'Listings'), where('ville', '==', villeInfo.city), limit(100))
                const querySnap = await getDocs(q)
                let annonces = []
                querySnap.forEach((doc)=>{return(annonces.push({
                    id: doc.id,
                    data : doc.data()
                }))})
                setAnnonces(annonces)
            } catch (error) {
                alert(error.message)
            }finally{
                setLoading(false)
            }
        }
        fetchData();
    }, [])
    function renderContent(){
        if(loading){return (<Dots/>)}
        if(!villeInfo){return(<h1>VILLE CLOCHARDE DSL PAS SUPPORTÉ</h1>)}
        if(annonces.length == 0){return(<h1>PAS DANNONCES DANS CETTE VILLE</h1>)}
        return(annonces.map((a)=>{
            return(
                <h1 key={a.id} onClick={(e)=>{e.preventDefault();navigate(`/listings/${a.id}`)}}>{a.data.adresse}</h1>
            )
        }))
    }
  return (
    <div>
        <h1>AHAHA</h1>
        <h1>AHAHA</h1>
        <h1>AHAHA</h1>
        <h1>AHAHA</h1>
        <h1>AHAHA</h1>
        <h1>AHAHA</h1>
        {renderContent()}
        
    </div>
    
  )
}
