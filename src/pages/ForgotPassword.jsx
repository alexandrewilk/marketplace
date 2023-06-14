import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {auth} from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'
export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    async function onSubmit(e){
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, email)
            toast.success('Regarde tes mails !')
        } catch (error) {
            toast.error(error.message)
        }
    }
  return (
    <section>
      <h1 className='text-2xl text-center'>Récupérer son mot de passe</h1>
      <div className='text-center'>
      <form className='m-auto max-w-xs' onSubmit={onSubmit}>
        <input type='email' id='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='email' className='rounded'/>
        <button type='submit' className='bg-blue-600 text-white rounded my-3'>Envoyer mail</button>
      </form>
      
      <p>
         <Link to="/sign-in" className='text-red-800'>Se Connecter</Link>
      </p>
      <p>
        Pas de compte ? <Link to="/sign-up" className='text-red-800'>S'inscrire</Link>
      </p>
      </div>
    </section>
  )
}
