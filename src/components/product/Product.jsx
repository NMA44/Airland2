import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFetchCollectionHook } from '../../customHooks/useFetchCollectionHook'
import {
	GET_PRICE_RANGE,
	selectProducts,
	STORE_PRODUCTS
} from '../../redux/slice/productSlice'
import { ProductFilter } from './productFilter/ProductFilter'
import { ProductList } from './productList/ProductList'
import spinnerImg from '../../assets/spinnerImg.jpg'
import styles from './Product.module.scss'
import { FaCogs } from 'react-icons/fa'

export const Product = () => {
	const { data, isLoading } = useFetchCollectionHook('zapatillas')
	const products = useSelector(selectProducts)
	const [showFilter, setShowFilter] = useState(false)
	// const [products, setProducts] = useState([]) ya no usamos esto, usamos el custom hook
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(
			STORE_PRODUCTS({
				products: data
			})
		)
		dispatch(
			GET_PRICE_RANGE({
				products: data
			})
		)
	}, [dispatch, data])
	const toggleFilter = () => {
		setShowFilter(!showFilter)
	}
	return (
		<section>
			<div className={`container ${styles.product}`}>
				<aside
					className={
						showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`
					}
				>
					{isLoading ? null : <ProductFilter />}
				</aside>
				<div className={styles.content}>
					{isLoading ? (
						<img
							src={spinnerImg}
							alt='Loading..'
							style={{ width: '50px' }}
							className='--center-all'
						/>
					) : (
						<ProductList products={products} />
					)}
					<div className={styles.icon} onClick={toggleFilter}>
						<FaCogs size={20} color='orangered' />
						<p>
							<b>{showFilter ? 'Hide Filter' : 'Show Filter'}</b>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
