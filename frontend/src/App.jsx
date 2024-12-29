import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AddHotel from './mainadmin/pages/AddHotel'
import HotelDetails from './mainadmin/pages/HotelDetails'
import { AuthContext } from './context/auth-context';
import Loginpage from './login/pages/Loginpage';
import GuestLanding from './guests/pages/GuestLanding';
import HotelBooking from './guests/pages/HotelBooking';
import ThankYou from './guests/pages/ThankYou';
import Bookings from './guestAdmin/pages/Bookings';
import ViewBooking from './guestAdmin/pages/ViewBooking';
import EditBooking from './guestAdmin/pages/EditBooking';
import Error from './shared/components/ErrorHandler';

function App() {
  const [userIdGiven, setuserIdGiven] = useState(null)
  const [userId, setuserId] = useState(null)
  const [token, settoken] = useState(null)
  const [adminType, setadminType] = useState(null)

  const logging = useCallback((uid, uidgiven, atype, token) => {
    settoken(token)
    setuserId(uid)
    setuserIdGiven(uidgiven)
    setadminType(atype)
    // setting token in the localStorage
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        userIdGiven: uidgiven,
        adminType: atype,
        token: token
      })
    )
  }, [])

  const logout = useCallback(() => {
    setuserId(null)
    setuserIdGiven(null)
    setadminType(null)
    settoken(null)
    localStorage.removeItem('userData')
  }, [])

  // using localStorage data so that when the page reloads the data isn't lost
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token) {
      logging(storedData.userId, storedData.userIdGiven, storedData.adminType, storedData.token)
    }
  }, [logging])

  let routes;

  if (token) {
    if (adminType === 'mainAdmin') {
      routes = (
        <Routes>
          <Route path="/admin" element={<HotelDetails />} />
          <Route path="/admin/add" element={<AddHotel />} />
          <Route path="/hotels/:hotelId" element={<HotelBooking />} />
          <Route path="/" element={<Navigate to="/admin" />} /> {/* Default route for mainAdmin */}
        </Routes>
      );
    }
    else{
      routes=(
        <Routes>
          <Route path="/guestadmin" element={<Bookings />} />
          <Route path="/guestadmin/view/:bookingId" element={<ViewBooking />} />
          <Route path="/guestadmin/edit/:bookingId" element={<EditBooking />} />
          <Route path="/hotels/:hotelId" element={<HotelBooking />} />
          <Route path="/" element={<Navigate to="/guestadmin" />} /> {/* Default route for guestAdmin */}
        </Routes>
      )
    }

  }
  else {
    routes=(
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/hotels/:hotelId" element={<HotelBooking />} />
        <Route path="/guests" element={<GuestLanding />} />
        <Route path="/guests/thankyou" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unauthenticated users to login page */}
      </Routes>
    )
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      logging: logging,
      logout: logout,
      userId: userId,
      userIdGiven: userIdGiven,
      adminType: adminType
    }} >
      <div className='bg-blue-50 min-h-screen'>
        <Router>
          {routes}
        </Router>
      </div>
    </AuthContext.Provider>
  )
}

export default App
