import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Plank = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/feed')
  },[]);
  return (
    <div></div>
  )
}

export default Plank