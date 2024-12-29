import React from 'react'

const ErrorHandler = (props) => {
    return (
        <div className='flex flex-col flex-wrap w-full h-screen fixed top-0 left-0 bg-black bg-opacity-75 z-10 justify-center content-center'>
            <div className='bg-blue-50 p-10 rounded-xl shadow-md shadow-blue-300 m-10'>
                <h1 className='text-2xl border-b-2 border-blue-500 font-semibold '>An Error Occurred</h1>
            <p className='text-xl py-10 text-red-600'>{props.message}</p>
            <button className='bg-blue-600 w-24 text-white text-xl px-2 rounded-md m-1 font-bold' onClick={props.cancelError} >Ok</button>
            </div>
        </div>
    )
}

export default ErrorHandler