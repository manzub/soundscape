import React from 'react';
import { Icon } from '../Icons';
import { useNavigate } from 'react-router-dom'


export default function Navigation() {

  const navigate = useNavigate()

  return (
    <div>
      <button onClick={() => navigate(-1)} className='bg-brenk p-[6px] rounded-full items-center mr-3'>
        <Icon name="back" />
      </button>
      <button onClick={() => navigate(+1)} className='bg-brenk p-[6px] rounded-full items-center mr-2'>
        <Icon name="next" />
      </button>
    </div>
  )
}
