import React from 'react'
import { useNavigate } from 'react-router-dom'

const ThankYou = () => {
    const navigate = useNavigate()
    return (
        <section className='w-full flex justify-center p-5'>
            <div className='bg-white p-5 rounded-3xl shadow-xl sm:w-9/12 text-center text-md sm:text-xl font-bold'>
                Thank You. We have taken your booking. <br />
                We Will contact you soon. <br />
                <button 
                className=" bg-blue-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500" 
                type="submit" 
                name="goback"
                onClick={()=>{navigate('../guests')}}>Go Back</button>
            </div>
            
        </section>
    )
}

export default ThankYou