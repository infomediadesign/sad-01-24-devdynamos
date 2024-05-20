import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    age: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/registration';
    try {
      setIsLoading(true); // Set loading state to true
      const response = await axios.post(`http://127.0.0.1:5000/${endpoint}`, formData);
      setMessage(response.data.message || 'Success');
      if (isLogin && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      // Navigate to home page after delay
      setTimeout(() => {
        // Replace '/home' with the path to your home page
        window.location.href = '/home';
      }, 2000); // Delay in milliseconds (2 seconds)
    } catch (error) {
      const errorMessage = error.response ? (error.response.data.error || 'Something went wrong') : 'Network error';
      setMessage(errorMessage);
    } finally {
      setIsLoading(false); // Set loading state to false after request completes
    }
  };  

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <>
           <input
                 type="email"
                 name="email"
                 placeholder="Email"
                 value={formData.email}
                 onChange={handleChange}
                 required
               />
               <input
                 type="number"
                 name="age"
                 placeholder="Age"
                 value={formData.age}
                 onChange={handleChange}
                 required
               />
             </>
           )}
           <button type="submit" disabled={isLoading}>{isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}</button>
         </form>
         <p onClick={() => setIsLogin(!isLogin)}>
           {isLogin ? 'Need an account? Sign up here.' : 'Already have an account? Log in here.'}
         </p>
         {message && <p>{message}</p>}
       </div>
     );
   };

   export default AuthForm;
