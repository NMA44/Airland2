import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	//   FILTER_BY_BRAND,
	FILTER_BY_TYPE,
	FILTER_BY_PRICE
} from '../../../redux/slice/filterSlice'
import {
	selectMaxPrice,
	selectMinPrice,
	selectProducts
} from '../../../redux/slice/productSlice'
import styles from './ProductFilter.module.scss'

export const ProductFilter = () => {
	const [type, setType] = useState('All')
	// const [brand, setBrand] = useState("All");
	const [price, setPrice] = useState(3000)
	const products = useSelector(selectProducts)
	const minPrice = useSelector(selectMinPrice)
	const maxPrice = useSelector(selectMaxPrice)

	const dispatch = useDispatch()

	const allTypes = ['All', ...new Set(products.map(product => product.type))]
	//   const allBrands = [
	//     "All",
	//     ...new Set(products.map((product) => product.brand)),
	//   ];
	//   // console.log(allBrands);

	//   useEffect(() => {
	//     dispatch(FILTER_BY_BRAND({ products, brand }));
	//   }, [dispatch, products, brand]);

	useEffect(() => {
		dispatch(FILTER_BY_PRICE({ products, price }))
	}, [dispatch, products, price])

	const filterProducts = tipo => {
		setType(tipo)
		dispatch(FILTER_BY_TYPE({ products, type: tipo }))
	}

	const clearFilters = () => {
		setType('All')
		// setBrand("All");
		setPrice(maxPrice)
	}

	return (
		<div className={styles.filter}>
			<h4>Types</h4>
			<div className={styles.type}>
				{allTypes.map((tipo, index) => {
					return (
						<button
							key={index}
							type='button'
							className={`${type}` === tipo ? `${styles.active}` : null}
							onClick={() => filterProducts(tipo)}
						>
							&#8250; {tipo}
						</button>
					)
				})}
			</div>
			{/* <h4>Brand</h4> */}
			<div className={styles.brand}>
				{/* <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          {allBrands.map((brand, index) => {
            return (
              <option key={index} value={brand}>
                {brand}
              </option>
            );
          })}
        </select> */}
				<h4>Price</h4>
				<p>{`$${price}`}</p>
				<div className={styles.price}>
					<input
						type='range'
						value={price}
						onChange={e => setPrice(e.target.value)}
						min={minPrice}
						max={maxPrice}
					/>
				</div>
				<br />
				<button className='--btn --btn-danger' onClick={clearFilters}>
					Clear Filter
				</button>
			</div>
		</div>
	)
}
