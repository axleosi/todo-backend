'use client'
import React from 'react'
import { useRouter } from "next/navigation"
import styles from './register.module.css'


const Register = () => {
    const router=useRouter()
  return (
    <div className={styles.container}>
      <div className={styles.con}>
        <h1>TO-DO MAKER</h1>
        <p>CREATE AND FOLLOW YOUR DAILY PLANS.</p>
      </div>
      <button onClick={()=>{router.push('/signup')}}>Register Now</button>
    </div>
  )
}

export default Register