import 'react';
import { Link } from 'react-router-dom';
import { TbBrandMeta, TbPhoneCall } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-gray-50">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        
        {/* Newsletter Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>
          
          {/* Newsletter Form */}
          <form className="flex">
            <input 
              type="email" 
              placeholder="Enter Your Email"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md 
                         focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all" 
              required
            />
            <button 
              type="submit" 
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md 
                         hover:bg-gray-800 transition-all">
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Men Top Wear</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Women Top Wear</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Men Bottom Wear</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Women Bottom Wear</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Contact</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">About</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">FAQs</Link></li>
            <li><Link to="#" className="hover:text-gray-500 transition-colors">Features</Link></li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
              <TbBrandMeta className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
              <IoLogoInstagram className="h-6 w-6" />
            </a>
            <a href="https://www.threads.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500">
              <RiTwitterXLine className="h-6 w-6" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <p className="text-gray-800 font-medium flex items-center">
            <TbPhoneCall className="inline-block mr-2" /> 0123456789
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6 text-center">
        <p className="text-gray-500 text-sm tracking-tighter">
          &copy; 2025, CompileTab. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
