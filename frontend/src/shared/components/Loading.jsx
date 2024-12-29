import React from 'react'

const Loading = () => {
    return (
        <>
            <div className='bg-white opacity-60 flex content-center flex-wrap min-h-screen justify-center z-50'>
                <div className='block w-12 h-12 m-1 rounded-full border-[5px] border-l-transparent border-r-transparent border-t-blue-700 border-b-blue-700 animate-spin'>
                </div>
            </div>
        </>
    )
}

export default Loading