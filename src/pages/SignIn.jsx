import React, {useState} from 'react'
import { Link } from 'react-router-dom'
export default function SignIn() {
  const [formData, setFormData] = useState({
    email : "",
    password: "",
  })
  const {email, password} = formData
  function onChange(e){
    setFormData((prev) =>({
      ...prev,
      [e.target.id] : e.target.value
    }))
  }
  return (
    <section>
      <h1 className='text-2xl text-center'>Sign IN</h1>
      <div className='text-center'>
      <form className='m-auto max-w-xs'>
        <input type='email' id='email' value={email} onChange={onChange} placeholder='email' className='rounded'/>
        <input type='password' id='password' value={password} onChange={onChange} placeholder='password' className='rounded'/>
      </form>
      <button type='submit' className='bg-blue-600 text-white rounded my-3'>Se connecter</button>
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
