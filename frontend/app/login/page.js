'use client'
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './login.module.css'

const Login=() =>{
  const API = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please provide both username and password.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API}/token/`, {
        username: formData.username,
        password: formData.password
      });
      
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Redirect to the profile or main page after successful login
      router.push('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupCon}>
        <div className={styles.signupText} >
          <h1>Login</h1>
        </div>
        {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.signups}>
        <div className={styles.signupDiv}> <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username"/><hr/></div>
        <div className={styles.signupDiv}><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password"/><hr/></div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading}>Login</button>
      </form>
      </div>
      <p>Dont have an account? <button onClick={()=>{router.push('/signup')}} className={styles.signin}>Signup</button></p>
    </div>
  );
}



export default Login