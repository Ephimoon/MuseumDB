import React, {useState, useEffect, useRef} from 'react'
import { useLocation } from 'react-router-dom';
import styles from '../css/ArtworkCard.module.css';
import axios from 'axios';
import config from '../config';

const ArtworkCard = ({ artwork_, onCardClick }) => {
  return (
    <div className={styles.cards}>
      {artwork_.map((art) => (
        <div
          key={art.ArtworkID}
          className={styles.card}
          onClick={() => onCardClick(art)}
        >
          <img src={art.image} alt={art.Title} className={styles.image} />
          <h1>{art.Title}</h1>
          <p>{art.artist_name || 'Unknown Artist'}</p>
          <p>{art.CreationYear  || 'Unknown Year'}</p>
        </div>
      ))}
    </div>
  );
};

const ArtworkModalUser = ({ artwork_, onClose }) => {
  if (!artwork_) return null; // If no artwork is selected, don't render the modal

  const handleOverlayClick = (e) => {
    // Only close if clicking on the overlay, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modal_content}>
        <span className={styles.close_button} onClick={onClose}>
          &times;
        </span>
        <img src={artwork_.image} alt={artwork_.Title} className={styles.modal_image} />
        <h2>{artwork_.Title}</h2>
        <p><strong>Artist:</strong> {artwork_.artist_name || 'Unknown Artist'}</p>
        <p><strong>Year:</strong> {artwork_.CreationYear}</p>
        <p><strong>Description:</strong> {artwork_.Description}</p>
        <p><strong>Price:</strong> {artwork_.price}</p>
        {/* Add more artwork details here as needed */}
      </div>
    </div>
  );
};

const ArtistCard = ({ artist_, onCardClick }) => {
  return (
    <div className={styles.cards}>
      {artist_.map((artist) => (
        <div
          key={artist.ArtistID}
          className={styles.card}
          onClick={() => onCardClick(artist)}
        >
          <img src={`${config.backendUrl}/assets/artists/${artist.image}`} alt={artist.name_} className={styles.image} />
          <h1>{artist.name_}</h1>
        </div>
      ))}
    </div>
  );
};

const ArtistModalUser = ({ artist_, onClose, onRefresh }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [artist, setArtist] = useState(artist_);

  const openEditMode = () => setIsEditMode(true);
  const openConfirmDelete = () => setShowConfirmDelete(true);
  const closeConfirmDelete = () => setShowConfirmDelete(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.backendUrl}/artist/${artist.ArtistID}`);
      console.log("Artist deleted successfully");
      onRefresh(); // Refresh the artist list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const handleModalRefresh = async () => {
    try {
      const response = await axios.get(`${config.backendUrl}/artist/${artist.ArtistID}`);
      const updatedArtist = response.data;
      console.log('Fetched updated artist data from server:', updatedArtist);
      setArtist(updatedArtist);
    } catch (error) {
      console.error('Error fetching updated artist data:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (!isEditMode && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modal_content}>
        {!isEditMode && (
          <span className={styles.close_button} onClick={onClose}>
            &times;
          </span>
        )}
        
        {!isEditMode ? (
          <>
            <img src={`${config.backendUrl}/assets/artists/${artist.image}`} alt={artist.name_} className={styles.image} />
            <h2>{artist.name_}</h2>
            <p><strong>Gender:</strong> {artist.gender}</p>
            <p><strong>Nationality:</strong> {artist.nationality || 'Not specified'}</p>
            <p><strong>Birth Year:</strong> {artist.birth_year || 'Not specified'}</p>
            <p><strong>Death Year:</strong> {artist.death_year || 'N/A'}</p>
            <p><strong>Description:</strong> {artist.description || 'No description provided'}</p>
            {(role === 'admin' || role === 'staff') && location.pathname !== '/Art' && (
              <>
                <button onClick={openEditMode}>Edit Artist</button>
                <button onClick={openConfirmDelete}>Delete Artist</button>
              </>
            )}
          </>
        ) : (
          <EditArtistModal 
            artist={artist} 
            onClose={() => setIsEditMode(false)} 
            onRefresh={onRefresh} 
            onModalRefresh={handleModalRefresh} 
          />
        )}
        {showConfirmDelete && (
          <ConfirmDeleteArtistModal
            onConfirm={handleDelete}
            onCancel={closeConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

const EditArtistModal = ({ artist, onClose, onRefresh, onModalRefresh }) => {
  const [nationalities, setNationalities] = useState([]);
  const [name, setName] = useState(artist.name_);
  const [gender, setGender] = useState(artist.gender);
  const [nationality, setNationality] = useState(artist.nationality);
  const [birthYear, setBirthYear] = useState(artist.birth_year || '');
  const [deathYear, setDeathYear] = useState(artist.death_year || '');
  const [description, setDescription] = useState(artist.description || '');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Store the initial values to compare changes
  const initialValues = useRef({
    name: artist.name_,
    gender: artist.gender,
    nationality: artist.nationality,
    birthYear: artist.birth_year || '',
    deathYear: artist.death_year || '',
    description: artist.description || ''
  });

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await axios.get(`${config.backendUrl}/api/nationalities`);
        setNationalities(response.data);
      } catch (error) {
        console.error('Error fetching nationalities:', error);
      }
    };
    fetchNationalities();
  }, []);

  // Update `hasChanges` when any field changes
  useEffect(() => {
    const changesMade =
      name !== initialValues.current.name ||
      gender !== initialValues.current.gender ||
      nationality !== initialValues.current.nationality ||
      birthYear !== initialValues.current.birthYear ||
      deathYear !== initialValues.current.deathYear ||
      description !== initialValues.current.description ||
      image !== null; // Add image to check for new image selection
  
    setHasChanges(changesMade);
  }, [name, gender, nationality, birthYear, deathYear, description, image]);

  const handleSave = () => {
    if (!name) {
        setError('Name is required');
        return;
    }
    if (!gender) {
        setError('Gender is required');
        return;
    }
    if (!nationality) {
        setError('Nationality is required');
        return;
    }
    if (!birthYear) {
        setError('Birth year is required');
        return;
    }
    if (!description) {
        setError('Description is required');
        return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('nationality', nationality);
    formData.append('birthYear', birthYear);
    formData.append('deathYear', deathYear || '');
    formData.append('description', description);
    if (image) {
        formData.append('image', image); // Append the file only if it's selected
    }

    axios.patch(`${config.backendUrl}/artist/${artist.ArtistID}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(() => {
        console.log('Artist updated successfully');
        onRefresh();
        onModalRefresh();
        onClose();
    })
    .catch(err => {
        console.error('Error updating artist:', err);
        setError('Failed to update artist');
    });
};


  return (
    <div>
      <h2>Edit Artist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
          Change Image:
          <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
          />
      </label>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Gender:
        <select 
          value={gender} 
          onChange={(e) => setGender(e.target.value)} 
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Nationality:
        <select 
          value={nationality} 
          onChange={(e) => setNationality(e.target.value)} 
          required
        >
          {nationalities.map((nat) => (
            <option key={nat} value={nat}>{nat}</option>
          ))}
        </select>
      </label>
      <label>
        Birth Year:
        <input
          type="number"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          required
        />
      </label>
      <label>
        Death Year:
        <input
          type="number"
          value={deathYear}
          onChange={(e) => setDeathYear(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleSave} disabled={!hasChanges}>Save</button>
    </div>
  );
};

const ConfirmDeleteArtistModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to delete this artist?</h2>
        <p>WARNING: All artwork from this artist WILL be removed from the collection</p>
        <p>This action cannot be undone.</p>
        <div className={styles.buttonContainer}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ color: "red" }}>Delete</button>
        </div>
      </div>
    </div>
  );
};



export {ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser} ;