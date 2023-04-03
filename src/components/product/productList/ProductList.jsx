import { useEffect, useState } from 'react'
import { Search } from '../../search/Search'
import { BsFillGridFill } from 'react-icons/bs'
import { FaListAlt } from 'react-icons/fa'
import styles from './ProductList.module.scss'
import { ProductItem } from '../productItem/ProductItem'
import { useDispatch, useSelector } from 'react-redux'
import {
	FILTER_BY_SEARCH,
	selectFilteredProducts,
	SORT_PRODUCTS
} from '../../../redux/slice/filterSlice'
import { Pagination } from '../../pagination/Pagination'

export const ProductList = ({ products }) => {
	const [grid, setGrid] = useState(true)
	const [search, setSearch] = useState('')
	const [sort, setSort] = useState('latest')
	const filteredProducts = useSelector(selectFilteredProducts)
	// Pagination states
	const [currentPage, setCurrentPage] = useState(1)
	const [productsPerPage] = useState(9)
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
			SORT_PRODUCTS({
				products,
				sort
			})
		)
	}, [dispatch, products, sort])

	useEffect(() => {
		dispatch(
			FILTER_BY_SEARCH({
				products,
				search
			})
		)
	}, [dispatch, products, search])

	return (
		<div>
			<div>
				<div>
					<BsFillGridFill
						cursor='pointer'
						size={22}
						color='black'
						onClick={() => setGrid(true)}
					/>
					<FaListAlt
						cursor='pointer'
						size={24}
						color='black'
						onClick={() => setGrid(false)}
					/>
					<p>
						<b>{filteredProducts.length}</b> Shoes found
					</p>
				</div>
				{/* Search Icon */}
				<div>
					<Search
						value={search}
						onChange={e => {
							setSearch(e.target.value)
						}}
					/>
				</div>
				{/* Sort Shoes */}
				<div>
					<label>Sort by:</label>
				</div>
				<select value={sort} onChange={e => setSort(e.target.value)}>
					<option value='latest'>Latest</option>
					<option value='lowest-price'>Lowest Price</option>
					<option value='highest-price'>Highest Price</option>
					<option value='a-z'>A-Z</option>
					<option value='z-a'>Z-A</option>
				</select>
			</div>
			<div className={grid ? `${styles.grid}` : `${styles.list}`}>
				{products.length === 0 ? (
					<p>No product found.</p>
				) : (
					<>
						{currentProducts.map(product => {
							return (
								<div key={product.id}>
									<ProductItem {...product} grid={grid} product={product} />
								</div>
							)
						})}
					</>
				)}
			</div>
			<Pagination
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				productsPerPage={productsPerPage}
				totalProducts={filteredProducts.length}
			/>
		</div>
	)
}
