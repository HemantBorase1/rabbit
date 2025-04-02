import  { useEffect, useRef, useState } from 'react';
import { FaFilter } from "react-icons/fa";
import FilterSidebar from '../components/Product/FilterSidebar';
import SortOptions from '../components/Product/SortOptions';
import ProductGrid from '../components/Product/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { fetchProductByFilters } from '../../redux/Slice/productSlice';


const CollectionPage = () => {
    const {collection} = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products);
    
    // Convert URLSearchParams to a plain object
    const queryParams = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });
   
    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProductByFilters({collection, ...queryParams}));
    }, [dispatch, collection, searchParams]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

   
    return (
        <div className="flex flex-col lg:flex-row">
            {/* Mobile Filter Button */}
            <button onClick={toggleSidebar} 
                className="lg:hidden border p-2 flex items-center mx-auto">
                <FaFilter className="mr-2" /> <span className="text-center">Filters</span>
            </button>

            {/* Sidebar - Fixed Full Height with Background Fix */}
            <div
                ref={sidebarRef}
                className={`absolute lg:relative bg-white min-h-screen lg:h-auto w-64 lg:w-1/4 shadow-md overflow-y-auto transition-transform duration-300 
                ${isSidebarOpen ? "left-0" : "-left-full"} lg:left-0`}
            >
                <h3 className="text-xl font-semibold text-center py-4 bg-gray-100">
                    Filters
                </h3>
                <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collection</h2>
                <SortOptions />
                <ProductGrid products={products} loading={loading} error={error} />
            </div>
        </div>
    );
};

export default CollectionPage;
