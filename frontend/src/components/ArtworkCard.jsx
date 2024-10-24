import React from 'react'
import styles from '../css/ArtworkCard.module.css';

const ArtworkCard = ({artwork_, getArtistName_}) => {

  return (
    <div className={styles.cards}>
        { artwork_.map((art) => (
            <div key={art.id} className={styles.card}>
                <img src={art.image} alt={art.title} className={styles.image} />
                <h1>{art.title}</h1>
                <p>{getArtistName_(art.artist_id)}</p>
                <p>{art.creation_year}</p>
            </div>
        )) }
    </div>
  )
}

export default ArtworkCard
