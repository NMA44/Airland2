import { addDoc, collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable
} from 'firebase/storage'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { toast } from 'react-toastify'
import { db, storage } from '../../../firebase/config'

import { selectProducts } from '../../../redux/slice/productSlice'
import { Card } from '../../card/Card'
import { Loader } from '../../loader/Loader'
import styles from './AddProduct.module.scss'
const types = [
	{ id: 1, name: 'Low' },
	{ id: 2, name: 'Mid' },
	{ id: 3, name: 'High' }
]
const sizes = [
	{ talle: 38 },
	{ talle: 39 },
	{ talle: 40 },
	{ talle: 41 },
	{ talle: 42 },
	{ talle: 43 },
	{ talle: 44 }
]
const initialState = {
	name: '',
	imageURL: '',
	price: 0,
	type: '',
	size: '',
	brand: '',
	desc: ''
}
export const AddProduct = () => {
	const { id } = useParams()
	const products = useSelector(selectProducts)
	const productEdit = products.find(item => item.id === id)

	const [product, setProduct] = useState(() => {
		const newState = detectForm(
			id,
			{
				...initialState
			},
			productEdit
		)
		return newState
	})
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	function detectForm(id, f1, f2) {
		if (id === 'ADD') {
			return f1
		}
		return f2
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setProduct({ ...product, [name]: value })
	}

	const handleImageChange = e => {
		const file = e.target.files[0]
		// console.log(file);

		const storageRef = ref(storage, `Zapatillas(images)/${file.name}`)
		const uploadTask = uploadBytesResumable(storageRef, file)

		uploadTask.on(
			'state_changed',
			snapshot => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				console.log(progress)
			},
			error => {
				toast.error(error.message)
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
					setProduct({ ...product, imageURL: downloadURL })
					toast.success('Image uploaded successfully.')
				})
			}
		)
	}
	const addProduct = e => {
		e.preventDefault()
		// console.log(product)
		setIsLoading(true)

		try {
			const docRef = addDoc(collection(db, 'zapatillas'), {
				name: product.name,
				imageURL: product.imageURL,
				price: Number(product.price),
				type: product.type,
				size: product.size,
				brand: product.brand,
				desc: product.desc,
				createdAt: Timestamp.now().toDate()
			})
			setIsLoading(false)
			setProduct({ ...initialState })
			toast.success('Product uploaded successfully.')
			navigate('/admin/all-products')
		} catch (error) {
			setIsLoading(false)
			toast.error(error.message)
		}
	}
	const editProduct = e => {
		e.preventDefault()
		// console.log(product)
		setIsLoading(true)
		if (product.imageURL !== productEdit.imageURL) {
			const storageRef = ref(storage, productEdit.imageURL)
			deleteObject(storageRef)
		}
		try {
			setDoc(doc(db, 'zapatillas', id), {
				name: product.name,
				imageURL: product.imageURL,
				price: Number(product.price),
				type: product.type,
				size: product.size,
				brand: product.brand,
				desc: product.desc,
				createdAt: Timestamp.now().toDate(),
				editedAt: Timestamp.now().toDate()
			})
			setIsLoading(false)
			toast.success('Product Edit Succesfully')
			navigate('/admin/all-products')
		} catch (error) {
			setIsLoading(false)
			toast.error(error.message)
		}
	}

	return (
		<>
			{isLoading && <Loader />}
			<div className={styles.product}>
				<h2>{detectForm(id, 'Add New Product', 'Edit Product')}</h2>
				<Card cardClass={styles.card}>
					<form onSubmit={detectForm(id, addProduct, editProduct)}>
						<label>Product name:</label>
						<input
							type='text'
							placeholder='Product name'
							required
							name='name'
							value={product.name}
							onChange={e => handleInputChange(e)}
						/>

						<label>Product image:</label>
						<Card cardClass={styles.group}>
							<input
								type='file'
								accept='image/*'
								placeholder='Product Image'
								name='image'
								onChange={e => handleImageChange(e)}
							/>

							{product.imageURL === '' ? null : (
								<input
									type='text'
									// required
									placeholder='Image URL'
									name='imageURL'
									value={product.imageURL}
									disabled
								/>
							)}
						</Card>

						<label>Product price:</label>
						<input
							type='number'
							placeholder='Product price'
							required
							name='price'
							value={product.price}
							onChange={e => handleInputChange(e)}
						/>
						<label>Type:</label>
						<select
							required
							name='type'
							value={product.type}
							onChange={e => handleInputChange(e)}
						>
							<option value='' disabled>
								-- choose type --
							</option>
							{types.map(type => {
								return (
									<option key={type.id} value={type.name}>
										{type.name}
									</option>
								)
							})}
						</select>
						<label>Size:</label>
						<select
							required
							name='size'
							value={product.size}
							onChange={e => handleInputChange(e)}
						>
							<option value='' disabled>
								-- choose size --
							</option>
							{sizes.map(size => {
								return (
									<option key={size.id} value={size.talle}>
										{size.talle}
									</option>
								)
							})}
						</select>

						<label>Product Company/Brand:</label>
						<input
							type='text'
							placeholder='Product brand'
							required
							name='brand'
							value={product.brand}
							onChange={e => handleInputChange(e)}
						/>

						<label>Product Description</label>
						<textarea
							name='desc'
							required
							value={product.desc}
							onChange={e => handleInputChange(e)}
							cols='30'
							rows='10'
						></textarea>

						<button className='--btn --btn-danger'>
							{detectForm(id, 'Save Product', 'Edit Product')}
						</button>
					</form>
				</Card>
			</div>
		</>
	)
}
