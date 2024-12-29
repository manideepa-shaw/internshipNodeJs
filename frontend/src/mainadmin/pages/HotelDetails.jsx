import React, { useState, useEffect, useContext } from 'react'
import MainAdminNav from '../../shared/components/MainAdminNav'
import { NavLink } from 'react-router-dom'
import QrCode from '../../shared/components/QrCode';
import { AuthContext } from '../../context/auth-context';
import ErrorHandler from '../../shared/components/ErrorHandler';


const HotelDetails = () => {
    const [showQR, setshowQR] = useState('')
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)
    const [hotelData, sethotelData] = useState(null)
    const auth = useContext(AuthContext)
    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                 setisLoading(true)
                 seterror(null)
                sethotelData([])
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/hotels`)
                const responseData = await res.json()

                if (!res.ok) {
                    throw new Error(responseData.message)
                }
                sethotelData(responseData.hotels)
                 setisLoading(false)

            }
            catch (err) {
                 setisLoading(false)
                 seterror(err.message || 'Some problem occured!!!')
            }
        }
        fetchHotelData()
    }, []);

    const generateQR = (str) => {
        setshowQR(str)
    }
    const cancelQR = () => {
        setshowQR('')
    }
    const deleteHotelHandler = async (e, hotelId) => {
        e.preventDefault()
        const confirmed = confirm('Are you sure?');
        if (!confirmed) return; // Exit if user cancels
        try {
            setisLoading(true)
            seterror(null)
            await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/hotels/${hotelId}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + auth.token }
            })
            sethotelData((prevItems) => prevItems.filter((item) => item._id !== hotelId));
            setisLoading(false)
        }
        catch (err) {
            setisLoading(false)
            seterror(err.message || 'Some error occured')
        }
    }
    return (
        <>
            <MainAdminNav />
            { error && <ErrorHandler cancelError={cancelError} message={error} /> }
            {showQR && <QrCode showQR={showQR} cancelQR={cancelQR} />}
            <div className='mt-16 flex flex-col flex-wrap content-center justify-start sm:px-10'>
                {hotelData &&
                    hotelData.map((hotel) => {
                        return (
                            <div className='w-72 my-5 p-5 flex flex-col flex-wrap content-center justify-center sm:w-full sm:max-w-[900px] sm:flex-row  sm:justify-evenly sm:p-4 bg-white rounded-xl shadow-md sm:text-lg'>
                                <img src={`${import.meta.env.VITE_APP_BACKEND_IMG_URL}${hotel.image}`} alt="wjdu" className='w-20 h-20 rounded-full' />
                                <ul className='flex flex-col sm:w-96'>
                                    <li className='font-bold'>{hotel.name} </li>
                                    <li className='font-light'>{hotel.address} </li>
                                </ul>
                                <ul className='flex content-center'>
                                    <li> <button type="submit" className='bg-green-600 text-white px-2 rounded-md mx-1'>Edit</button> </li>
                                    <li> <button type="submit" className='bg-red-600 text-white px-2 rounded-md mx-1' onClick={(e) => deleteHotelHandler(e, hotel._id)}>Delete</button> </li>
                                    <li>
                                        <button type="submit"
                                            className='bg-black text-white px-2 rounded-md mx-1'
                                            onClick={(e) => generateQR(`http://localhost:5173/hotels/${hotel._id}`)}
                                        >Generate QR</button> </li>
                                </ul>

                            </div>
                        )
                    })
                }

            </div>
        </>
    )
}

export default HotelDetails