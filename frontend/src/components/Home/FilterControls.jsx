"use client"
import styles from "../../styles/HomeLoggedIn.module.css" // Updated import

const FilterControls = ({ radiusFilter, setRadiusFilter, typeFilter, setTypeFilter, totalResults }) => {
  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="radius-filter" className={styles.filterLabel}>
          Radio
        </label>
        <select
          id="radius-filter"
          className={styles.filterSelect}
          value={radiusFilter}
          onChange={(e) => setRadiusFilter(e.target.value)}
        >
          <option value="all">Toda la ciudad</option>
          <option value="1">1 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="25">25 km</option>
        </select>
      </div>
      <div className={styles.filterGroup}>
        <label htmlFor="type-filter" className={styles.filterLabel}>
          Tipo
        </label>
        <select
          id="type-filter"
          className={styles.filterSelect}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Todas las mascotas</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
          <option value="otro">Otros</option>
        </select>
      </div>
      {/* Results Counter - Now aligned left and below filters */}
      <div className={styles.resultsCounter}>
        {totalResults} resultado{totalResults !== 1 ? "s" : ""}
      </div>
    </div>
  )
}

export default FilterControls
