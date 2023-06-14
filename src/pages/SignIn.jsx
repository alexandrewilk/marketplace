import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {auth} from '../firebase'
import {toast} from 'react-toastify'
import {signInWithEmailAndPassword} from 'firebase/auth'
export default function SignIn() {
  const [formData, setFormData] = useState({
    email : "",
    password: "",
  })
  const {email, password} = formData
  const navigate = useNavigate()
  function onChange(e){
    setFormData((prev) =>({
      ...prev,
      [e.target.id] : e.target.value
    }))
  }
  async function onSubmit(e){
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      if(userCredential.user){
        navigate('/')
      }
    } catch (error) {
      toast.error('Mauvaise combinaison user.pwd')
    }
  }
  return (
    <section>
      <h1 className='text-2xl text-center'>Sign IN</h1>
      <div className='text-center'>
      <form className='m-auto max-w-xs' onSubmit={onSubmit}>
        <input type='email' id='email' value={email} onChange={onChange} placeholder='email' className='rounded'/>
        <input type='password' id='password' value={password} onChange={onChange} placeholder='password' className='rounded'/>
        <button type='submit' className='bg-blue-600 text-white rounded my-3'>Se connecter</button>
      </form>
      <div>
        <p>
          Pas de compte ? <Link to="/sign-up" className='text-red-800'>Creer un compte</Link>
        </p>
        <p>
          <Link to="/forgot-password" className='text-blue-800'>Mot de passe oublié ? </Link>
        </p>
      </div>
      </div>
    </section>
  )
}
