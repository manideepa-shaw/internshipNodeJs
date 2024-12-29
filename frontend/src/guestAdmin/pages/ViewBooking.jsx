import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const ViewBooking = () => {
    const bookingId = useParams().bookingId
    const [bookingDetails, setbookingDetails] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)
    const auth = useContext(AuthContext)

    useEffect(() => {
        const fetchBookingData = async () => {
            console.log(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings/${bookingId}`)
            try {
                 setisLoading(true)
                 seterror(null)
                setbookingDetails([])
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings/${bookingId}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                const responseData = await res.json()

                if (!res.ok) {
                    throw new Error(responseData.message)
                }
                setbookingDetails(responseData.booking)
                 setisLoading(false)
            }
            catch (err) {
                 setisLoading(false)
                 seterror(err.message || 'Some problem occured!!!')
            }
        }
        console.log(auth.token)
        fetchBookingData()
    }, [bookingId, auth.token]);

    const printDetails =()=>{
        window.print()
    }

    const cancelError =(e)=>{
        e.preventDefault()
        seterror(null)
    }

    return (
        <>
        {isLoading && <Loading /> }
        {error && <ErrorHandler message={error} cancelError={cancelError} /> }
            {bookingDetails &&
                <table className="table-auto w-full">
                    <tbody>
                        <tr className='border-b'>
                            <td className='p-2 '> Name </td>
                            <td className='p-2'> {bookingDetails.name} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Mobile Number </td>
                            <td className='p-2'> {bookingDetails.mobile} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Address </td>
                            <td className='p-2'> {bookingDetails.address} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Purpose Of Visit</td>
                            <td className='p-2'> {bookingDetails.purposeOfVisit} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Check in </td>
                            <td className='p-2'>{bookingDetails?.stayDates?.from.slice(0,10) || 'N/A'} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Check Out </td>
                            <td className='p-2'>{bookingDetails?.stayDates?.to.slice(0,10) || 'N/A'} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Email </td>
                            <td className='p-2'>{bookingDetails.email || 'N/A'} </td>
                        </tr>
                        <tr className='border-b'>
                            <td className='p-2 '> Aadhar No. </td>
                            <td className='p-2'>{bookingDetails.aadhar || 'N/A'} </td>
                        </tr>
                    </tbody>
                    <button 
                    className='w-32 bg-blue-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500'
                    onClick={printDetails}>
                        Print Details</button>
                </table>
                
                }
        </>
    )
}

export default ViewBooking