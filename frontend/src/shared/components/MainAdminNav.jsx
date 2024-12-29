import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import "../../App.css"
import { AuthContext } from '../../context/auth-context'


const MainAdminNav = () => {
  const auth = useContext(AuthContext)
  return (
    <div>
      <ul className=' flex fixed top-0 left-0 w-full justify-between px-5 bg-blue-600 text-white font-semibold font-sans py-4'>
        <NavLink to="/admin"><li className={`${auth.token && 'hidden'} sm:flex sm:font-bold sm:text-2xl`}>Book Yours</li></NavLink>
        {auth.token &&
          <ul className='flex w-full justify-end sm:w-fit sm:justify-between text-xl'>
            {auth.adminType==='mainAdmin' &&
            <NavLink to="/admin/add">
              <li className='mr-5 bg-white text-black px-2 rounded-md hover:cursor-pointer content-center'>
                Add New Hotel
              </li>
            </NavLink>
            }
            <NavLink to="/" onClick={auth.logout}>
              <li className='bg-white text-black px-2 rounded-md hover:cursor-pointer content-center'>
                Logout
              </li>
            </NavLink>

          </ul>}
      </ul>
    </div>
  )
}

export default MainAdminNav