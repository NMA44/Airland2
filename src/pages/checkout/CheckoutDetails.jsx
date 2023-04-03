import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CountryDropdown } from 'react-country-region-selector'
import { Card } from '../../components/card/Card'
import styles from './CheckoutDetails.module.scss'
import { SAVE_SHIPPING_ADDRESS } from '../../redux/slice/checkoutSlice'
import { CheckoutSummary } from '../../components/checkoutSummary/CheckoutSummary'

const initialAddressState = {
	name: '',
	line1: '',
	line2: '',
	city: '',
	state: '',

	country: '',
	phone: ''
}

export const CheckoutDetails = () => {
	const [shippingAddress, setShippingAddress] = useState({
		...initialAddressState
	})

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleShipping = e => {
		const { name, value } = e.target
		setShippingAddress({
			...shippingAddress,
			[name]: value
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		dispatch(SAVE_SHIPPING_ADDRESS(shippingAddress))

		navigate('/checkout')
	}

	return (
		<section>
			<div className={`container ${styles.checkout}`}>
				<h2>Checkout Details</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<Card cardClass={styles.card}>
							<h3> Shipping Address</h3>
							<label>Name</label>
							<input
								type='text'
								placeholder=' Name'
								required
								name='name'
								value={shippingAddress.name}
								onChange={e => handleShipping(e)}
							/>
							<label>Address</label>
							<input
								type='text'
								placeholder='Address line 1'
								required
								name='line1'
								value={shippingAddress.line1}
								onChange={e => handleShipping(e)}
							/>

							<label>City</label>
							<input
								type='text'
								placeholder='City'
								required
								name='city'
								value={shippingAddress.city}
								onChange={e => handleShipping(e)}
							/>
							<label>State</label>
							<input
								type='text'
								placeholder='State'
								required
								name='state'
								value={shippingAddress.state}
								onChange={e => handleShipping(e)}
							/>
							<label>Postal code</label>
							<input
								type='text'
								placeholder='Postal code'
								required
								name='postal_code'
								value={shippingAddress.postal_code}
								onChange={e => handleShipping(e)}
							/>
							{/* COUNTRY INPUT */}
							<CountryDropdown
								className={styles.select}
								valueType='short'
								value={shippingAddress.country}
								onChange={val =>
									handleShipping({
										target: {
											name: 'country',
											value: val
										}
									})
								}
							/>
							<label>Phone</label>
							<input
								type='text'
								placeholder='Phone'
								required
								name='phone'
								value={shippingAddress.phone}
								onChange={e => handleShipping(e)}
							/>
							<button type='submit' className='--btn --btn-primary'>
								Proceed To Checkout
							</button>
						</Card>
					</div>
					<div>
						<Card cardClass={styles.card}>
							<CheckoutSummary />
						</Card>
					</div>
				</form>
			</div>
		</section>
	)
}
