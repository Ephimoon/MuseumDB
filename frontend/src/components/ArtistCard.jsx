import React from 'react'
import styles from '../css/ArtistCard.module.css';

const ArtistCard = ({artist_}) => {
  return (
    <div className={styles.cards}>
        { artist_.map((name_) => (
            <div key={name_.id} className={styles.card}>
                <img src={name_.image} alt={name_.name} className={styles.image} />
                <h1>{name_.name}</h1>
            </div>
        )) }
    </div>
  )
}

export default ArtistCard
