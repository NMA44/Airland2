import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db, storage } from '../../../firebase/config'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { deleteObject, ref } from 'firebase/storage'
import Notiflix from 'notiflix'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectProducts,
	STORE_PRODUCTS
} from '../../../redux/slice/productSlice'
import { useFetchCollectionHook } from '../../../customHooks/useFetchCollectionHook'
import { Loader } from '../../loader/Loader'
import { Pagination } from '../../pagination/Pagination'
import styles from './ViewProducts.module.scss'
import {
	FILTER_BY_SEARCH,
	selectFilteredProducts
} from '../../../redux/slice/filterSlice'
import { Search } from '../../search/Search'

export const ViewProducts = () => {
	const [search, setSearch] = useState('')
	const { data, isLoading } = useFetchCollectionHook('zapatillas')
	const products = useSelector(selectProducts)
	// const [products, setProducts] = useState([]) ya no usamos esto, usamos el custom hook
	const filteredProducts = useSelector(selectFilteredProducts)
	// Pagination states
	const [currentPage, setCurrentPage] = useState(1)
	const [productsPerPage, setProductsPerPage] = useState(10)
	// Get Current Products
	const indexOfLastProduct = currentPage * productsPerPage
	const indexOfFirstProduct = indexOfLastProduct - productsPerPage
	const currentProducts = filteredProducts.slice(
		indexOfFirstProduct,
		indexOfLastProduct
	)
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(
			STORE_PRODUCTS({
				products: data
			})
		)
	}, [dispatch, data])

	// useEffect(() => { aca lo mismo, esto va en el custom hook
	// 	getProducts()
	// }, [])

	// const getProducts = () => {
	// 	try {
	// 		const productsRef = collection(db, 'zapatillas')
	// 		const q = query(productsRef, orderBy('name', 'desc'))

	// 		onSnapshot(q, snapshot => {
	// 			const allProducts = snapshot.docs.map(doc => ({
	// 				id: doc.id,
	// 				...doc.data()
	// 			}))
	// 			setProducts(allProducts)
	// 			dispatch(
	// 				STORE_PRODUCTS({
	// 					products: allProducts
	// 				})
	// 			)
	// 		})
	// 	} catch (error) {
	// 		toast.error(error.message)
	// 	}
	// }
	useEffect(() => {
		dispatch(FILTER_BY_SEARCH({ products, search }))
	}, [dispatch, products, search])
	const confirmDelete = (id, imageURL) => {
		Notiflix.Confirm.show(
			'Delete shoe!!!!',
			'You are about to delete this shoe?',
			'Delete',
			'Cancel',
			function okCb() {
				deleteProduct(id, imageURL)
			},
			function cancelCb() {
				alert('If you say so...')
			},
			{
				width: '320px',
				borderRadius: '8px',
				titleColor: 'black',
				okButtonBackground: 'black',
				cssAnimationStyle: 'zoom'
				// etc...
			}
		)
	}
	const deleteProduct = async (id, imageURL) => {
		try {
			await deleteDoc(doc(db, 'zapatillas', id))
			const storageRef = ref(storage, imageURL)
			await deleteObject(storageRef)
			toast.success('Product delete successfully')
		} catch (error) {
			toast.error(error.message)
		}
	}
	return (
		<>
			{isLoading && <Loader />}
			<div className={styles.table}>
				<h2>All Products</h2>

				<div className={styles.search}>
					<p>
						<b>{filteredProducts.length}</b> products found
					</p>
					<Search value={search} onChange={e => setSearch(e.target.value)} />
				</div>

				{filteredProducts.length === 0 ? (
					<p>No product found.</p>
				) : (
					<table>
						<thead>
							<tr>
								<th>s/n</th>
								<th>Image</th>
								<th>Name</th>
								<th>Type</th>
								<th>Size</th>
								<th>Price</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{currentProducts.map((product, index) => {
								const { id, name, price, imageURL, type, size } = product
								return (
									<tr key={id}>
										<td>{index + 1}</td>
										<td>
											<img
												src={imageURL}
												alt={name}
												style={{ width: '100px' }}
											/>
										</td>
										<td>{name}</td>
										<td>{type}</td>

										<td>{size}</td>
										<td>{`$${price}`}</td>
										<td className={styles.icons}>
											<Link to={`/admin/add-product/${id}`}>
												<FaEdit size={20} color='green' />
											</Link>
											&nbsp;
											<FaTrashAlt
												size={18}
												color='red'
												onClick={() => confirmDelete(id, imageURL)}
											/>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
				<Pagination
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					productsPerPage={productsPerPage}
					totalProducts={filteredProducts.length}
				/>
			</div>
		</>
	)
}
