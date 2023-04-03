import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header, Footer } from './components'
import { Home, Contact, Login, Register, Reset, Admin } from './pages' // no need to specify index.js; used as default
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config.js'
import { ProductDetails } from './components/product/productDetails/ProductDetails'
import { Cart } from './pages/cart/Cart'
import { CheckoutDetails } from './pages/checkout/CheckoutDetails'
import { Checkout } from './pages/checkout/Checkout'
import { CheckoutSuccess } from './pages/checkout/CheckoutSuccess'
import { OrderHistory } from './pages/orderHistory/OrderHistory'
import { OrderDetails } from './pages/orderDetails/OrderDetails'
import { ReviewProducts } from './components/reviewProducts/ReviewProducts'
import AdminOnlyRoute, {
	AdminOnlyLink
} from './components/adminOnlyRoute/AdminOnlyRoute'
import { NotFound } from './pages/notFound/NotFound'

function App() {
	// here
	const [user, setUser] = useState()
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, setUser)
		return unsubscribe
	}, [])

	return (
		<>
			<BrowserRouter>
				<ToastContainer />
				<Header />

				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/contact' element={<Contact />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/reset' element={<Reset />} />
					<Route
						path='/admin/*'
						element={
							// here
							user && (
								<AdminOnlyLink>
									<Admin />
								</AdminOnlyLink>
							)
						}
					/>
					<Route path='/product-details/:id' element={<ProductDetails />} />
					<Route path='/cart' element={<Cart />} />
					<Route path='/checkout-details' element={<CheckoutDetails />} />
					<Route path='/checkout' element={<Checkout />} />
					<Route path='/checkout-success' element={<CheckoutSuccess />} />
					<Route path='/order-history' element={<OrderHistory />} />
					<Route path='/order-details/:id' element={<OrderDetails />} />
					<Route path='/review-product/:id' element={<ReviewProducts />} />
					<Route path='*' element={<NotFound />} />
				</Routes>

				<Footer />
			</BrowserRouter>
		</>
	)
}

export default App
