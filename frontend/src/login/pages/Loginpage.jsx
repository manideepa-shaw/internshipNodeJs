import { React, useContext, useState } from 'react'
import { AuthContext } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom'
import MainAdminNav from '../../shared/components/MainAdminNav'
import Loading from '../../shared/components/Loading'
import ErrorHandler from '../../shared/components/ErrorHandler'

const Loginpage = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const [error, seterror] = useState(null)
    const [isLoading, setisLoading] = useState(false)
    const [loginDetails, setloginDetails] = useState({
        userIdGiven: "",
        adminType: "mainAdmin",
        password: ''
    })
    const login = async (e) => {
        e.preventDefault()
        try {
            setisLoading(true)
            seterror(null)
            const res = await fetch(`http://localhost:8000/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    userIdGiven: loginDetails.userIdGiven,
                    adminType: loginDetails.adminType,
                    password: loginDetails.password
                })
            })
            const responsedata = await res.json()
            if (!res.ok) {
                console.log(responsedata.message)
                throw new Error(responsedata.message)
            }
            auth.logging(responsedata.userId, responsedata.userIdGiven, responsedata.adminType, responsedata.token);
            setisLoading(false)
            if (res.ok) {
                if (responsedata.adminType === 'mainAdmin')
                    navigate('./admin')
                else
                    navigate('./guestadmin')
            }
        }
        catch (err) {
            console.log(err)
            setisLoading(false)
            seterror(err.message || 'Some error occurred!!!')
        }
    }
    const inputHandlerForLogin = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setloginDetails({
            ...loginDetails,
            [name]: value
        })
        console.log(loginDetails)
    }
    const cancelError = (e) => {
        e.preventDefault()
        seterror(null)
    }
    return (
        <>

            {isLoading && <Loading />}
            {error && <ErrorHandler message={error} cancelError={cancelError} />}
            <MainAdminNav />
            <section className="flex w-full min-h-screen p-5 content-center justify-center flex-wrap">
                {/* <div className=""> */}
                    <form className='bg-white p-5 rounded-3xl shadow-xl' 
                    onSubmit={login}>
                        <label for="userIdGiven" className='block m-2'><div className="text-red-600 font-bold inline">* </div>Given UserId
                            <input type="userIdGiven" name="userIdGiven" 
                            className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                            value={loginDetails.userIdGiven} 
                            onChange={inputHandlerForLogin} required />
                        </label>

                        <label for="password" className='block m-2'>
                            <div className="text-red-600 font-bold inline">* </div>Enter Password
                            <input type="password" name="password" 
                            className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                            value={loginDetails.password} 
                            onChange={inputHandlerForLogin} required />
                        </label>

                        <label for="adminType" className='m-2'><div className="text-red-600 font-bold inline">* </div>Admin Type
                            <select name='adminType' 
                            className='mx-2 px-2 w-full border-b-[1px] border-blue-400 focus:outline-none focus:border-b-2'
                            value={loginDetails.adminType} 
                            onChange={inputHandlerForLogin}>
                                <option value="mainAdmin">Main Admin</option>
                                <option value="guestAdmin">Guest Admin</option>
                            </select>
                        </label><br />

                        <button className="w-full bg-blue-600 m-2 text-white p-1 font-semibold rounded-md hover:bg-blue-700 active:bg-blue-500" type="submit" name="login">Login</button>
                    </form>
                {/* </div> */}
            </section>
        </>
    )
}

export default Loginpage