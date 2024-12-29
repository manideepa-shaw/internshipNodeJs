import React, {useContext, useEffect, useState} from 'react'
import MainAdminNav from '../../shared/components/MainAdminNav'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const Bookings = () => {
    const [bookings, setbookings] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)
    const auth=useContext(AuthContext)
    useEffect(() => {
        const fetchBookingData = async () => {

            try {
                 setisLoading(true)
                 seterror(null)
                setbookings([])
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings`,{
                    method: 'GET',
                    headers : { 'Authorization': 'Bearer '+auth.token }
                })
                const responseData = await res.json()

                if (!res.ok) {
                    throw new Error(responseData.message)
                }
                setbookings(responseData.bookings)
                console.log(responseData.bookings)
                 setisLoading(false)

            }
            catch (err) {
                 setisLoading(false)
                 seterror(err.message || 'Some problem occured!!!')
            }
        }
        fetchBookingData()
    }, [auth.token]);

    const cancelError=(e)=>{
        e.preventDefault()
        seterror(null)
    }

    return (
        <>
            <MainAdminNav />
            {isLoading && <Loading /> }
            {error &&<ErrorHandler message={error} cancelError={cancelError} /> }
            <table className="table-auto mt-16 w-full">
                <thead className='text-lg'>
                    <tr className='border-b p-2'>
                        <th className='p-2'>Name</th>
                        <th className='p-2'>Mobile Number</th>
                        <th className='p-2' colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {bookings &&
                        bookings.map((booking) => {
                            return (
                                <tr className='border-b'>
                                    <td className='p-2'>{booking.name} </td>
                                    <td className='p-2'> {booking.mobile} </td>
                                    <td className='p-2'>
                                        <NavLink to={`http://localhost:5173/guestadmin/view/${booking._id}`} className='font-bold text-blue-600'>View</NavLink> </td>
                                    <td className='p-2'>
                                        <NavLink to={`http://localhost:5173/guestadmin/edit/${booking._id}`} className='font-bold text-green-600'>Edit</NavLink> </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default Bookings