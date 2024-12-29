import React, { useContext, useState,useEffect } from 'react'
import MainAdminNav from '../../shared/components/MainAdminNav'
import { AuthContext } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'
import.meta.env.VITE_APP_BACKEND_URL

const AddHotel = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [showGuestDetails, setshowGuestDetails] = useState(null)
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [formDetails, setformDetails] = useState({ hotelName: "", logo: null, address: "" })

  const handleForm = async (e) => {
    e.preventDefault()
    console.log(formDetails)
    try {
      setisLoading(true)
      seterror(null)
      const formData = new FormData()
      formData.append('hotelName', formDetails.hotelName)
      formData.append('address', formDetails.address)
      formData.append('image', formDetails.logo) //we have used 'image' in fileUpload.single('image') in users-route.js
      
      const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/hotels`, {
        method: 'POST',
        headers : { 'Authorization': 'Bearer '+auth.token },
        body: formData
      })

      const responsedata = await res.json()
      if (!res.ok) {
        throw new Error(responsedata.message)
      }
      console.log(responsedata)
      setshowGuestDetails(responsedata.guestAdminDetails)
      setisLoading(false)
    }
    catch (err) {
      console.log(err)
      setisLoading(false)
      seterror(err.message || 'Something went wrong. Please try later')
    }
  }

  const inputHandler = (e) => {
    const { name, value, files } = e.target;

    setformDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === "logo" ? files[0] : value, // Use `files[0]` for file input
    }));
  };

  const cancelShowGuestDetails = () =>{
    setshowGuestDetails(null)
    navigate('../admin')
  }

  const cancelError =(e)=>{
    e.preventDefault()
    seterror(null)
  }

  return (
    <>
    {isLoading && <Loading />}
    {error && <ErrorHandler cancelError={cancelError} message={error} /> }
      {showGuestDetails &&
        <div className='flex flex-col flex-wrap w-full h-screen fixed top-0 left-0 bg-black bg-opacity-75 z-10 justify-center content-center'>
            <div className='m-4 sm:w-[600px] bg-white p-5  rounded-3xl shadow-md shadow-white'>
              <h1 className='font-bold text-2xl'>Guest Admin Details</h1>
              <p className='text-xl'> Guest User Id :  {showGuestDetails.userIdGiven} </p>
              <p className='text-xl'> Guest Password :  Abcd@1234 </p> 
              <p className='font-bold'> Kindly save these details and give it to the respective authorities for further use. Ask them to change password on their first login. </p>
            {/* password will br taken from backend when in production. This is for my simplicity to test all the test cases */}
            <button className='bg-red-600 text-white text-xl px-2 rounded-md m-1 hover:bg-red-700 active:bg-red-500' onClick={cancelShowGuestDetails} >Cancel</button>
            </div>
        </div>}
        
      <MainAdminNav />
      <form className='w-full flex min-h-full flex-wrap justify-center content-center mt-16 sm:text-lg'
        onSubmit={handleForm}
      >
        <div className="flex min-h-72 w-full m-4 justify-evenly p-1 sm:w-fit flex-col sm:p-5 border border-indigo-700 bg-white rounded-lg shadow-md shadow-slate-500">
          <input type="text"
            placeholder='Hotel Name'
            className=' border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600'
            name='hotelName'
            onChange={inputHandler}
            value={formDetails.hotelName}
            required />

          <label htmlFor="logo" className='font-bold'>Company Logo</label>
          <input type="file" name="logo" id="logo"
            onChange={inputHandler}
            required />

          <input type="text"
            placeholder='Address'
            className='border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600'
            name='address'
            onChange={inputHandler}
            value={formDetails.address}
            required />

          <button type="submit" className='bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500'>Add Hotel</button>
        </div>
      </form>
    </>
  )
}

export default AddHotel