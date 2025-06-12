'use client'
import React from 'react'
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from 'next/navigation';
import styles from './signup.module.css'


const SignUp = () => {
  const [formData, setFormData]=useState({
        username:'',
        first_name:'',
        last_name:'',
        password:''
    });
  const [accessToken, setAccessToken]=useState(null);
  const [loading, setLoading]=useState(false);
  const [error, setError]=useState(null)
  const router=useRouter()

  const handleChange=(e)=>{
    setFormData(prev=>({
        ...prev,
        [e.target.name]:e.target.value
    }))
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true)
    if (!formData.username.trim() || !formData.password.trim()) return;

    try{
        const response=await axios.post('http://127.0.0.1:8000/api/names/',formData);
        const token =response.data.token.access;
        const refresh=response.data.token.refresh
        localStorage.setItem('access_token', token)
        localStorage.setItem('refresh_token', refresh)
        setAccessToken(token)
        fetchUserDetails(token)
        router.push('/profile');
        console.log('User created')
    }catch (error) {
      if (error.response?.data) {
          if (error.response.data.username) {
              setError(error.response.data.username[0]);
          } else {
              setError('An unexpected error occurred. Please try again.');
          }
      }
      console.error('Failure to signup:', error);
  }finally{
        setLoading(false)
        
      }
  }

  const fetchUserDetails=async(token)=>{
    try{
      const res=await axios.get('http://127.0.0.1:8000/api/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          setAccessToken(newToken);
          localStorage.setItem('access_token', newToken);
          fetchUserDetails(newToken);
        }
      } else {
        console.error('Fetch user error:', err.response?.data || err.message);
      }
    }
  }

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token available.');
      return null;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/token/refresh/', {
            refresh: refreshToken
          });
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          setAccessToken(newAccessToken);
          console.log('Access token refreshed in background');
        } catch (err) {
          console.error('Background token refresh failed:', err);
        }
      }
    }, 2 * 60 * 1000); 

    return () => clearInterval(interval); // cleanup
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.signupCon}>
        <div className={styles.signupText}>
          <h1>SIGN UP</h1>
          <p>Sign up to continue</p>
        </div>
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <div className={styles.signups}>
            <div className={styles.signupDiv}><input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleChange}/><hr/></div>
            <div className={styles.signupDiv}><input type='text' name='first_name' placeholder='First Name' value={formData.first_name} onChange={handleChange}/><hr/></div>
            <div className={styles.signupDiv}><input type='text' name='last_name' placeholder='Last Name' value={formData.last_name} onChange={handleChange}/><hr/></div>
            <div className={styles.signupDiv}><input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange}/><hr/></div>
          </div>
            
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit">Sign Up</button>
        </form>
        
      </div>
        <p>Already have an account? <button onClick={()=>{router.push('/login')}} className={styles.signin}>Log in</button></p>
    </div>
  )
}

export default SignUp