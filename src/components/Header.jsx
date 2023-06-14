import React from 'react'
import { useLocation, useNavigate} from 'react-router-dom'


export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    function routeMathPath(route){
        if(route === location.pathname){
            return true
        }
    }

  return (
    <div className='border-b bg-white'>
      <header className='flex justify-between items-center px-3'>
        <div>
            MarketPlace
        </div>
        <div>
            <ul className='flex space-x-5'>
                <li className= {`cursor-pointer border-b ${routeMathPath('/') && "border-b-red-400"}`}
                onClick={()=>navigate("/")}>Home</li>
                <li className= {`cursor-pointer border-b ${routeMathPath('/offers') && "border-b-red-400"}`}
                onClick={()=>navigate("/offers")}>Offers</li>
                <li className= {`cursor-pointer border-b ${routeMathPath('/sign-in') && "border-b-red-400"}`}
                onClick={()=>navigate("/sign-in")}>SignIn</li>
            </ul>
        </div>
      </header>
    </div>
  )
}
