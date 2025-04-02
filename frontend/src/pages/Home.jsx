import 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Product/GenderCollectionSection'
import NewArrivals from '../components/Product/NewArrivals'
import ProductDetails from '../components/Product/ProductDetails'
import ProductGrid from '../components/Product/ProductGrid'
import FeaturedCollection from '../components/Product/FeaturedCollection'
import FeaturesSection from '../components/Product/FeaturesSection'
import {useDispatch,useSelector} from 'react-redux';
import { useEffect } from 'react'
import { fetchProductByFilters } from '../../redux/Slice/productSlice'
import axios from 'axios'
import { useState } from 'react'


const Home = () => {

  const dispatch =useDispatch();
  const {products,loading,error}=useSelector((state)=>state.products);
  const [bestSellerProduct,setBestSellerProduct]=useState(null);


  useEffect(()=>{
    //Fetch Products for a specific collection
    dispatch(
      fetchProductByFilters({
        gender:"Women",
        category:"Bottom Wear",
        limit:8,
      })
    );
    // fetch best seller product
    const fetchBestSeller=async()=>{
      try {
        const response=await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/products/best-seller`
        );
      } catch (error) {
        console.error(error);
        
      }
    };
    fetchBestSeller();
  },[dispatch]);
  return (
   <>
   <Hero/>
   <GenderCollectionSection/>
   <NewArrivals/>

   {/* Best Seller */}
   <h2 className='text-3xl text-center font-bold mb-4'>
    Best Seller</h2>
    {bestSellerProduct ? (
      <ProductDetails productId={bestSellerProduct._id}/>
    ):(
      <p className='text-center'>Loading Best Seller Products</p>
    )}

    <div className='container mx-auto'>
      <h2 className='text-3xl text-center font-bold mb-4 '>
          Top Wears for Women
      </h2>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>


    <FeaturedCollection/>
    <FeaturesSection/>
   </>
  )
}

export default Home