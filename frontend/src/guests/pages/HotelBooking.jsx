import React, { useEffect, useState } from 'react'
import MainAdminNav from '../../shared/components/MainAdminNav'
import { useNavigate, useParams } from 'react-router-dom'
import Inputs from '../../shared/components/Inputs'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const HotelBooking = () => {
    const [hotel, sethotel] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(null)

    const hotelId = useParams().hotelId
    const navigate = useNavigate()

    const [formData, setformData] = useState({
        name: '',
        email: '',
        address: '',
        from: "",
        to: "",
        purposeOfVisit: "business",
        mobile: null,
        aadhar: null
    })

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                setisLoading(true)
                 seterror(null)
                sethotel(null)
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/hotels/${hotelId}`)
                const responseData = await res.json()

                if (!res.ok) {
                    throw new Error(responseData.message)
                }
                sethotel(responseData.hotel)
                console.log(responseData.hotel)
                setisLoading(false)

            }
            catch (err) {
                setisLoading(false)
                 seterror(err.message || 'Some problem occured!!!')
            }
        }
        fetchHotelData()
    }, []);

    const inputHandler = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setformData({
            ...formData,
            [name]: value
        })
    }

    const cancelError=(e)=>{
        e.preventDefault()
        seterror(null)
    }

    const bookHotel = async (e) => {
        e.preventDefault()
        console.log(formData)
        try {
            setisLoading(true)
            seterror(null)
            const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/bookings/${hotelId}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    mobile: formData.mobile,
                    address: formData.address,
                    purposeOfVisit: formData.purposeOfVisit,
                    stayDateTo: formData.to,
                    stayDateFrom: formData.from,
                    email: formData.email,
                    aadhar: formData.aadhar
                })
            })
            const responsedata = await res.json()
            if (!res.ok) {
                throw new Error(responsedata.message)
            }
            setisLoading(false)
            if (res.ok) {
                navigate('../guests/thankyou')
            }
        }
        catch (err) {
            setisLoading(false)
            seterror(err.message || 'Some error occurred!!!')
        }
    }

    return (
        <>
        {isLoading && <Loading />}
        { error && <ErrorHandler cancelError={cancelError} message={error} /> }
            <MainAdminNav />
            {hotel &&
                <div className='mt-16 flex flex-col flex-wrap content-center justify-start sm:px-10'>
                    <div className='sm:w-9/12 my-5 mx-10 p-5 flex flex-col flex-wrap content-center justify-center sm:w-full sm:max-w-[900px] sm:flex-row  sm:justify-evenly sm:p-4 bg-white rounded-xl shadow-md sm:text-lg'>
                        <img src={`${import.meta.env.VITE_APP_BACKEND_IMG_URL}${hotel.image}`} alt="Comapany Logo" className='w-20 h-20 rounded-full' />
                        <ul className='flex flex-col sm:w-96'>
                            <li className='font-bold'>{hotel.name} </li>
                            <li className='font-light'>{hotel.address} </li>
                        </ul>
                    </div>
                </div>}
            <section className='w-full flex justify-center p-5'>
                <form className='bg-white p-5 rounded-3xl shadow-xl sm:w-9/12'
                    onSubmit={bookHotel}>
                    <Inputs field="name" inputHandler={inputHandler} formData={formData} type="text" />
                    <Inputs field="email" inputHandler={inputHandler} formData={formData} type="email" />
                    <Inputs field="mobile" inputHandler={inputHandler} formData={formData} type="number" />
                    <Inputs field="address" inputHandler={inputHandler} formData={formData} type="text" />

                    <label for="purposeOfVisit" className='m-2'><div className="text-red-600 font-bold inline">* </div>Purpose Of Visit
                        <select name='purposeOfVisit'
                            className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                            value={formData.purposeOfVisit}
                            onChange={inputHandler}>
                            <option value="business">Business</option>
                            <option value="personal">Personal</option>
                            <option value="tourist">Tourist</option>
                        </select>
                    </label>

                    <Inputs field="from" inputHandler={inputHandler} formData={formData} type="date" />

                    <Inputs field="to" inputHandler={inputHandler} formData={formData} type="date" />

                    <Inputs field="aadhar" inputHandler={inputHandler} formData={formData} type="number" />

                    <button className="w-full bg-blue-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500" type="submit" name="login">Book Hotel</button>
                </form>
            </section>
        </>
    )
}

export default HotelBooking