import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context'
import Inputs from '../../shared/components/Inputs'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const EditBooking = () => {
    const [booking, setbooking] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)

    const bookingId = useParams().bookingId
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                 setisLoading(true)
                 seterror(null)
                setbooking(null)
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings/${bookingId}`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${auth.token}` }
                })
                const responseData = await res.json()

                if (!res.ok) {
                    throw new Error(responseData.message)
                }
                setbooking(responseData.booking)
                console.log(responseData.booking)
                setisLoading(false)

            }
            catch (err) {
                 setisLoading(false)
                 seterror(err.message || 'Some problem occured!!!')
            }
        }
        fetchHotelData()
        console.log(booking)
    }, [bookingId, auth.token]);

    const inputHandler = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setbooking({
            ...booking,
            [name]: value
        })
    }

    const updateChanges = async(e) => {
        e.preventDefault()
        setisLoading(true)
        seterror(null)
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    name: booking.name,
                    mobile: booking.mobile,
                    address: booking.address,
                    purposeOfVisit: booking.purposeOfVisit,
                    stayDateTo: booking.to,
                    stayDateFrom: booking.from,
                    email: booking.email,
                    aadhar: booking.aadhar
                })
            })
            const responseData = await res.json()
            setisLoading(false)
            if (!res.ok) {
                throw Error(responseData.message)
            }
            navigate('/guestadmin')
        }
        catch (err) {
            setisLoading(false)
            seterror(err.message || 'Some problem occured')
        }
    }
    const discardChanges = (e) => {
        e.preventDefault()
        const confirmed = confirm('Are you sure ?')
        if (!confirmed) return
        navigate('/guestadmin')
    }
    const cancelError=(e)=>{
        e.preventDefault()
        seterror(null)
    }
    return (
        <>
            {isLoading && <Loading />}
            {error && <ErrorHandler message={error} cancelError={cancelError} />}
            {booking && <section className='w-full flex justify-center p-5'>
                <form className='bg-white p-5 rounded-3xl shadow-xl sm:w-9/12'
                    onSubmit={updateChanges}>
                    <Inputs field="name" inputHandler={inputHandler} formData={booking} type="text" />
                    <Inputs field="email" inputHandler={inputHandler} formData={booking} type="email" />
                    <Inputs field="mobile" inputHandler={inputHandler} formData={booking} type="number" />
                    <Inputs field="address" inputHandler={inputHandler} formData={booking} type="text" />

                    <label for="purposeOfVisit" className='m-2'><div className="text-red-600 font-bold inline">* </div>Purpose Of Visit
                        <select name='purposeOfVisit'
                            className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                            value={booking.purposeOfVisit}
                            onChange={inputHandler}>
                            <option value="business">Business</option>
                            <option value="personal">Personal</option>
                            <option value="tourist">Tourist</option>
                        </select>
                    </label>

                    <Inputs field="from" inputHandler={inputHandler} formData={booking} type="date" />

                    <Inputs field="to" inputHandler={inputHandler} formData={booking} type="date" />

                    <Inputs field="aadhar" inputHandler={inputHandler} formData={booking} type="number" />
                    <button
                        className="w-full bg-red-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-red-700 active:bg-red-500"
                        onClick={discardChanges}
                    >Discard Changes</button>
                    <button className="w-full bg-blue-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500" >Update Changes</button>
                </form>
            </section>}
        </>
    )
}

export default EditBooking