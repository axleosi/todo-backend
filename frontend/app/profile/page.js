'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css'
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const UserProfile = () => {
  const API = process.env.REACT_APP_API_URL;
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCity, setUpdatedCity] = useState('');
  const [newTodoText, setNewTodoText] = useState('');
  const [light, setLight] = useState(false);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await axios.get(`${API}/api/profile/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserProfile(response.data);
          setUpdatedCity(response.data.city || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleCityChange = (e) => {
    setUpdatedCity(e.target.value);
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API}/api/todos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile((prev) => ({
        ...prev,
        todos: prev.todos.filter((todo) => todo.id !== id),
      }));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API}/api/todos/${todo.id}/`, {
        completed: !todo.completed,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserProfile((prev) => ({
        ...prev,
        todos: prev.todos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        ),
      }));
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await axios.patch(
          `${API}/api/profile/`,
          { city: updatedCity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setUserProfile((prev) => ({ ...prev, city: updatedCity }));
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddTodo = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token && newTodoText.trim()) {
        await axios.post(
          `${API}/api/todos/`,
          {
            text: newTodoText,
            completed: false,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const response = await axios.get(`${API}/api/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(response.data);
        setNewTodoText('');
      }
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };
  const handleClick = () => {
    router.push('/');
  };

  const logOut = () => {
    router.push('/');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userProfile) {
    return (
      <div>
        <p>No user profile found. Please log in.</p>
        <button onClick={handleClick}>Go to Home</button>
      </div>
    );
  }

  return (
<div className={styles.profileContainer}>
  <div className={styles.profileHeader}>
    <h1>WELCOME, {userProfile.first_name} {userProfile.last_name}</h1>
    <button onClick={logOut}>
      Log Out
    </button>
  </div>

  <div className={styles.todoHeader}>
    {!isEditing ? (
      <div className={styles.profileDetails}>
        <div className={styles.city}>
          <p><strong> Your City:</strong> {userProfile.city}</p>
          <button onClick={() => setIsEditing(true)}>Edit City</button>
        </div>

        <TodoForm
            newTodoText={newTodoText}
            setNewTodoText={setNewTodoText}
            handleAddTodo={handleAddTodo}
          />

        <TodoList
            todos={userProfile.todos || []}
            filter={filter}
            setFilter={setFilter}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
      </div>
    ) : (
      <div className={styles.profileEdit}>
        <h2>Edit City</h2>
        <form onSubmit={handleProfileUpdate} className={styles.todoForm}>
          <input
            type="text"
            name="city"
            value={updatedCity}
            onChange={handleCityChange}
            placeholder="Enter new city"
          />
          <button type="submit">Save</button>
        </form>
        <button type="button" onClick={() => setIsEditing(false)}className={styles.cancel}>Cancel</button>
      </div>
    )}
  </div>
</div>
  );
};

export default UserProfile;
