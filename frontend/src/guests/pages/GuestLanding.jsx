import React , {useState, useEffect, useContext} from 'react'
import { NavLink } from 'react-router-dom'

import MainAdminNav from '../../shared/components/MainAdminNav'
import { AuthContext } from '../../context/auth-context'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const GuestLanding = () => {
    const [hotelData, sethotelData] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)
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

    const cancelError=(e)=>{
        e.preventDefault()
        seterror(null)
    }
    
    return (
        <>
        {isLoading && <Loading /> }
        { error && <ErrorHandler message={error} cancelError={cancelError} /> }
            <MainAdminNav />
            <div className='mt-16 flex flex-col flex-wrap content-center justify-start sm:px-10'>
                {hotelData &&
                    hotelData.map((hotel) => {
                        return (
                            <NavLink to={`http://localhost:5173/hotels/${hotel._id}`}>
                            <div className='w-72 my-5 p-5 flex flex-col flex-wrap content-center justify-center sm:w-full sm:max-w-[900px] sm:flex-row  sm:justify-evenly sm:p-4 bg-white rounded-xl shadow-md sm:text-lg'>
                                <img src={`${import.meta.env.VITE_APP_BACKEND_IMG_URL}${hotel.image}`} alt="Comapany Logo" className='w-20 h-20 rounded-full' />
                                <ul className='flex flex-col sm:w-96'>
                                    <li className='font-bold'>{hotel.name} </li>
                                    <li className='font-light'>{hotel.address} </li>
                                </ul>
                            </div>
                            </NavLink>
                        )
                    })
                }

            </div>
        </>
    )
}

export default GuestLanding