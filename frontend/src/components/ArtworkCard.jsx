import React from 'react'
import styles from '../css/ArtworkCard.module.css';

const ArtworkCard = ({ artwork_, getArtistName_, onCardClick }) => {
  return (
    <div className={styles.cards}>
        {artwork_.map((art) => (
            <div key={art.id} className={styles.card} onClick={() => onCardClick(art)}>
                <img src={art.image} alt={art.title} className={styles.image} />
                <h1>{art.title}</h1>
                <p>{getArtistName_(art.artist_id)}</p>
                <p>{art.creation_year}</p>
            </div>
        ))}
    </div>
  );
};

// Modal to show more details about the selected exhibition
const ArtworkModalUser = ({ artwork_, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <span className={styles.close_button} onClick={onClose}>&times;</span>
          <img src={artwork_.image} alt={artwork_.title} />
          <h2>{artwork_.title}</h2>
          <p><strong>Description:</strong> {artwork_.description_text}</p>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist_, onCardClick }) => {
  return (
    <div className={styles.cards}>
        { artist_.map((name_) => (
            <div key={name_.id} className={styles.card} onClick={() => onCardClick(name_)}>
                <img src={name_.image} alt={name_.name} className={styles.image} />
                <h1>{name_.name}</h1>
            </div>
        )) }
    </div>
  )
}

// Modal to show more details about the selected exhibition
const ArtistModalUser = ({ artist_, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <span className={styles.close_button} onClick={onClose}>&times;</span>
          <img src={artist_.image} alt={artist_.name} />
          <h2>{artist_.name}</h2>
      </div>
    </div>
  );
};


export {ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser} ;
