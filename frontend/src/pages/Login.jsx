import 'react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import login from '../assets/login.webp';
import { loginUser } from '../../redux/Slice/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const location=useLocation();
  const {user,guestId}=useSelector((state)=>state.auth);
  const{cart}=useSelector((state)=>state.cart);

  //Get redirect parameter & check if it's checkout or something
  const redirect=new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect=redirect.includes("checkout");

  useEffect(()=>{
    
  })
  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(loginUser(email,password));
  }
  return (
    <>
    <div className='flex'>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
      <form onSubmit={handleSubmit} action="" className='w-full max-w-md bg-white p-8 rounded-lg border shadow-sm'>
          <div className='flex justify-center mb-6'>
             <h2 className='text-xl font-medium'>Rabbit</h2>
          </div>
          <h2 className='text-2xl font-bold text-center mb-6'>Hey there!</h2>
          <p className='text-center mb-6'>
            Enter Your Username & Password to Login
          </p>
          <div className="mb-4">
            <label htmlFor="" className='block text-sm font-semibold mb-2'>Email</label>
           <input type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className='w-full p-2 border rounded'
            placeholder='Enter Your Email Address' />
          </div>
          <div className='mb-4'>
             <label htmlFor="" className="block text-sm font-semibold mb-2">Password</label>
             <input type="password" 
             value={password}
             onChange={(e)=>setPassword(e.target.value)}
             className='w-full p-2 border rounded' 
             placeholder='Enter Your Password'/>
          </div>
          <button
           type="submit"
           className='w-full bg-black text-white p-2 rounded-lg font-semibold 
           hover:bg-gray-800 transition'
           >Sign In</button>
           <p className='mt-6 text-center text-sm'>
            Dont Have an account?{" "}
            <Link to="/register" className='text-blue-500'>
            Register
            </Link>
           </p>
      </form>
      </div>

      <div className='hidden md:block w-1/2 bg-gray-800'>
         <div className="h-full flex flex-col justify-center items-center">
          <img src={login} alt="Login to Account" 
          className='h-[750px] w-full object-cover'
          />
         </div>
      </div>
    </div>
    </>
  )
}

export default Login