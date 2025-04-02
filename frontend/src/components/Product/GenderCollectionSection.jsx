import 'react'
import mensCollection from "../../assets/mens-collection.webp"
import womenCollection from "../../assets/womens-collection.webp"
import { Link } from 'react-router-dom'

const GenderCollectionSection = () => {
  return (
    <>
    <section className='py-16 px-4 lg:px-0'>
        <div className='container mx-auto flex flex-col md:flex-row gap-8'>
             {/* Women Collection */}
             <div className='relative flex-1'>
                <img src={womenCollection} 
                alt="Women"
                className='w-full h-[700px] object-cover'
                 />
                 <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                   <h2 className='text-2xl font-bold text-gray-900'>
                    Womens Collection
                   </h2>
                   <Link to="/collections/all?gender=Women"
                   className='text-gray-900 underline'>
                    Shop Now
                   </Link>
                 </div>
             </div>
             {/* Mens Collection */}
             <div className='relative flex-1'>
                <img src={mensCollection} 
                alt="Women"
                className='w-full h-[700px] object-cover'
                 />
                 <div className='absolute bottom-8 left-8 bg-white bg-opacity-90 p-4'>
                   <h2 className='text-2xl font-bold text-gray-900'>
                    Mens Collection
                   </h2>
                   <Link to="/collections/all?gender=Men"
                   className='text-gray-900 underline'>
                    Shop Now
                   </Link>
                 </div>
             </div>
        </div>
    </section>
    </>
  )
}

export default GenderCollectionSection