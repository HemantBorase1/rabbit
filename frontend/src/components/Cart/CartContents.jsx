import 'react'
import PropTypes from 'prop-types'
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeFromCart } from '../../../redux/Slice/cartSlice'

const CartContents = ({cart = { products: [] }, userId, guestId}) => {
const dispatch=useDispatch();

// Handle adding or substracting to cart
const handleAddToCart=(productId,delta,quantity,size,color)=>{
    const newQuantity=quantity+delta;
    if(newQuantity>=1){
        dispatch(
            updateCartItemQuantity({
                productId,
                quantity:newQuantity,
                guestId,
                userId,
                size,
                color,
            })
        );
    }
};

const handleRemoveFromCart=(productId,size,color)=>{
    if(!productId || !size || !color) {
        console.error('Missing required data for cart removal');
        return;
    }
    
    dispatch(removeFromCart({
        productId,
        guestId,
        userId,
        size,
        color
    }));
};

  return (
    <>
    <div>
        {cart.products.map((product,index)=>(
            <div key={index} className='flex items-start justify-between py-4 border-b'>
                <div className='flex items-start'>
                   {product.image && (
                     <img 
                       src={product.image} 
                       alt={product.name}
                       className='w-20 h-24 object-cover mr-4 rounded'
                     />
                   )}
                
                <div>
                    <h3>{product.name}</h3>
                    <p className='text-sm text-gray-500'>
                        size: {product.size} | color: {product.color}
                    </p>
                    <div className='flex items-center mt-2'>
                     <button
                     onClick={()=>handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color,
                     )}
                     className='border rounded px-2 py-1 text-xl font-medium'>
                        -</button>
                        <span className='mx-4 '>{product.quantity}</span>
                     <button
                      onClick={()=>handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color,
                     )}
                     className='border rounded px-2 py-1 text-xl font-medium'>
                        +</button>
                    </div>
                </div>
                </div>
                <div>
                    <p>$ {product.price.toLocaleString()}</p>
                    <button
                    onClick={()=>handleRemoveFromCart(
                        product.productId,
                        product.size,
                        product.color
                    )}
                    >
                        <RiDeleteBin3Line  className='h-6 w-6 mt-2 text-red-600'/>
                    </button>
                </div>
            </div>
        ))}
    </div>
    </>
  )
}

CartContents.propTypes = {
    cart: PropTypes.shape({
        products: PropTypes.arrayOf(PropTypes.shape({
            productId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            image: PropTypes.string,
            size: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired
        })).isRequired
    }).isRequired,
    userId: PropTypes.string,
    guestId: PropTypes.string
}

export default CartContents