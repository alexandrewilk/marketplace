import React, {useState} from 'react'
import { Link } from 'react-router-dom'
export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email : "",
    password: "",
  })
  const {name, email, password} = formData
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
      <input type='text' id='name' value={name} onChange={onChange} placeholder='nom' className='rounded'/>
        <input type='email' id='email' value={email} onChange={onChange} placeholder='email' className='rounded'/>
        <input type='password' id='password' value={password} onChange={onChange} placeholder='password' className='rounded'/>
      </form>
      <button type='submit' className='bg-blue-600 text-white rounded my-3'>S'inscrire</button>
      <p>
          Déjà membre ?<Link to="/sign-in" className='text-red-800'>Se Connecter</Link>
      </p>
      </div>
    </section>
  )
}
