require('dotenv').config()
const express = require('express')
const PORT = process.env.PORT || 4242
const app = express()
const cors = require('cors')

// This is your test secret API key..
const stripe = require('stripe')(
	'sk_test_51Mpy4SJLEMVsSOvcXOXuvo80sehaEIpmbpNzXQSstr7e0Hkn7NMmZWlLiqSoDr6qRoNc3gcSPLRK7qKvdqZ0fGaG00mppm9obr'
)

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

app.get('/', (req, res) => {
	res.send('Welcome to AirLand')
})
const array = []
const calculateOrderAmount = items => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client

	items.map(item => {
		const { price, cartQuantity } = item
		const cartItemAmount = price * cartQuantity
		return array.push(cartItemAmount)
	})
	const totalAmount = array.reduce((a, b) => {
		return a + b
	}, 0)

	return totalAmount * 100
}

app.post('/create-payment-intent', async (req, res) => {
	const { items, shipping, description } = req.body

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(items),
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true
		},
		description,
		shipping: {
			address: {
				line1: shipping.line1,

				city: shipping.city,
				country: shipping.country,
				postal: shipping.postal
			},
			name: shipping.name,
			phone: shipping.phone
		}
		// receipt_email: customerEmail;
	})

	res.send({
		clientSecret: paymentIntent.client_secret
	})
})

app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`))
