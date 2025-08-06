import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../../../../assets/assets'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import { toast, Toaster } from 'react-hot-toast'

const SeatLayout = () => {
  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)

  const navigate = useNavigate()

  const getShow = async () => {
    const show = dummyShowsData.find(show => show._id === id)
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData
      })
    }
  }

  useEffect(() => {
    getShow()
  }, [])

  const seatRows = {
    premium: {
      price: 250,
      rows: ['K', 'J', 'I', 'H', 'G', 'F', 'E'],
      seatsPerRow: 20
    },
    executive: {
      price: 230,
      rows: ['D', 'C', 'B'],
      seatsPerRow: 17
    },
    normal: {
      price: 210,
      rows: ['A'],
      seatsPerRow: 15
    }
  }

  const renderSeats = (sectionKey, section) => (
    <div className='mb-10'>
      <p className='text-center font-semibold text-sm text-gray-300 mb-2'>
        ₹{section.price} {sectionKey.toUpperCase()}
      </p>
      <div className='flex flex-col items-center gap-2'>
        {section.rows.map(row => (
          <div key={row} className='flex gap-2 items-center'>
            <span className='text-xs text-gray-400 w-4'>{row}</span>
            {[...Array(section.seatsPerRow)].map((_, idx) => {
              const seatNumber = idx + 1
              const seatId = `${row}-${seatNumber}`

              const isBestseller = seatNumber % 6 === 0
              const isSold = seatNumber % 7 === 0
              const isSelected = selectedSeats.includes(seatId)

              let className = 'w-6 h-6 rounded-sm flex items-center justify-center border text-xs cursor-pointer'
              if (isSold) {
                className += ' bg-gray-300 cursor-not-allowed'
              } else if (!selectedTime) {
                className += ' border-gray-600 text-gray-600'
              } else if (isSelected) {
                className += ' bg-green-700 text-white'
              } else if (isBestseller) {
                className += ' border-yellow-500 text-yellow-500'
              } else {
                className += ' border-green-500 text-green-500'
              }

              return (
                <div
                  key={seatId}
                  className={className}
                  onClick={() => {
                    if (isSold) return

                    if (!selectedTime) {
                      toast.custom((t) => (
                        <div
                          className={`bg-red-600 text-white px-3 py-1 rounded shadow-md text-sm transition-all duration-300 ${t.visible ? 'opacity-100' : 'opacity-0'}`}
                        >
                          Please select a time
                        </div>
                      ), { duration: 2000 })
                      return
                    }

                    const isAlreadySelected = selectedSeats.includes(seatId)

                    if (!isAlreadySelected && selectedSeats.length >= 5) {
                      toast.error("Maximum 5 seats are selected")
                      return
                    }

                    setSelectedSeats(prev =>
                      isAlreadySelected
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    )
                  }}
                >
                  {seatNumber}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-32 py-10 md:pt-16 text-white relative'>
      <Toaster position="top-center" reverseOrder={false} />

      {/* Sidebar: Timings */}
      <div className='w-full md:w-1/4 bg-[#1e0b0b] border border-[#3a1a1a] rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5'>
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
                ${selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-[#3a1a1a] text-white"}`}
            >
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Seat layout */}
      <div className='flex-1 flex flex-col items-center max-md:mt-16 relative'>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0' right='0' />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>

        {!selectedTime && (
          <p className="text-red-500 font-medium mb-4 text-sm">
            Please select a time
          </p>
        )}

        {Object.entries(seatRows).map(([key, section]) => renderSeats(key, section))}

        <div className='mt-6'>
          <img src={assets.screenImage} alt='screen' className='w-48 mx-auto' />
          <p className='text-gray-400 text-sm text-center mt-2'>SCREEN SIDE</p>
        </div>

        <div className='flex items-center gap-4 mt-8 text-sm flex-wrap justify-center'>
          <div className='flex items-center gap-1'>
            <div className='w-4 h-4 border border-yellow-500'></div>
            <span className='text-yellow-500'>Bestseller</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-4 h-4 border border-green-500'></div>
            <span className='text-green-500'>Available</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-4 h-4 bg-green-700'></div>
            <span className='text-white'>Selected</span>
          </div>
          <div className='flex items-center gap-1'>
            <div className='w-4 h-4 bg-gray-300'></div>
            <span className='text-gray-300'>Sold</span>
          </div>
        </div>

        {/* ✅ Centered Proceed to Checkout button */}
        <div className="w-full flex justify-center mt-10">
          <button 
            onClick={() => navigate('/my-bookings')} 
            className="flex items-center gap-2 px-8 py-3 bg-[#e64949] hover:bg-[#d13c3c] transition rounded-full font-semibold text-white text-sm shadow-md active:scale-95"
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='text-white px-6 py-12'>Loading...</div>
  )
}

export default SeatLayout
