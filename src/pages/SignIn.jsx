import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../style.css/SignIn.css'

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Mauvaise combinaison user.pwd');
    }
  }

  return (
  <section className="container">
      <div className="signin-form">
        <h1 className="title">Se connecter</h1>
        <form onSubmit={onSubmit} className="form">
          <input type="email" id="email" value={email} onChange={onChange} placeholder="Email" className="input-field" />
          <input type="password" id="password" value={password} onChange={onChange} placeholder="Mot de passe" className="input-field" />
          <button type="submit" className="submit-button">Se connecter</button>
        </form>
        <div className="links">
          <p>
            Pas de compte ? <Link to="/sign-up" className="link">Creer un compte</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="link">Mot de passe oublié ? </Link>
          </p>
        </div>
      </div>
      <div className="image">
        <img src={require('../assets/images/SignIn.jpg')} alt="Image description" />
      </div>
    </section>
  );
}
