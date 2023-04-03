import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { useDispatch, useSelector } from 'react-redux'
import {
	CALCULATE_SUBTOTAL,
	CALCULATE_TOTAL_QUANTITY,
	selectCartItems,
	selectCartTotalAmount
} from '../../redux/slice/cartSlice'
import { selectEmail } from '../../redux/slice/authSlice'
import { selectShippingAddress } from '../../redux/slice/checkoutSlice'

import { toast } from 'react-toastify'
import { CheckoutForm } from '../../components/checkoutForm/CheckoutForm'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.STRIPE_PK)

export const Checkout = () => {
	const [message, setMessage] = useState('Initializing checkout...')
	const [clientSecret, setClientSecret] = useState('')
	const cartItems = useSelector(selectCartItems)
	const totalAmount = useSelector(selectCartTotalAmount)
	const customerEmail = useSelector(selectEmail)

	const shippingAddress = useSelector(selectShippingAddress)

	const dispatch = useDispatch()
	useEffect(
		() => {
			dispatch(CALCULATE_SUBTOTAL())
			dispatch(CALCULATE_TOTAL_QUANTITY())
		},
		[dispatch],
		cartItems
	)

	const description = `AirLand payment: ${customerEmail}, Amount: ${totalAmount}`

	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		// 'http://localhost:4242/create-payment-intent'
		fetch('https://airland.herokuapp.com/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				items: cartItems,
				userEmail: customerEmail,
				shipping: shippingAddress,
				description
			})
		})
			.then(res => {
				if (res.ok) {
					return res.json()
				}
				return res.json().then(json => Promise.reject(json))
			})
			.then(data => {
				setClientSecret(data.clientSecret)
			})
			.catch(error => {
				console.log(error)
				setMessage('Failed to initialize checkout')
				toast.error('Something went wrong')
			})
	}, [])

	const appearance = {
		theme: 'stripe'
	}
	const options = {
		clientSecret,
		appearance
	}

	return (
		<>
			<section>
				<div className='container'>{!clientSecret && <h3>{message}</h3>}</div>
			</section>
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<CheckoutForm />
				</Elements>
			)}
		</>
	)
}
