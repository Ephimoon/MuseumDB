import React, {useState, useEffect, useRef} from 'react'
import { useLocation } from 'react-router-dom';
import styles from '../css/ArtworkCard.module.css';
import axios from 'axios';

const ArtworkCard = ({ artwork_, onCardClick, artworkImages }) => {
  return (
    <div className={styles.cards}>
      {artwork_.map((art) => (
        <div
          key={art.ArtworkID}
          className={styles.card}
          onClick={() => onCardClick(art)}
        >
          <img src={artworkImages[art.ArtworkID]} alt={art.Title} className={styles.image} />
          <h1>{art.Title}</h1>
          <p>{art.artist_name || 'Unknown Artist'}</p>
          <p>{art.CreationYear}</p>
        </div>
      ))}
    </div>
  );
};

const ArtworkModalUser = ({ artwork_, onClose, onRefresh, artworkPreviewImages, handlePreviewImageChange, isDeletedView }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [artwork, setArtwork] = useState(artwork_);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const openEditMode = () => setIsEditMode(true);
  const openConfirmDelete = () => setShowConfirmDelete(true);
  const closeConfirmDelete = () => setShowConfirmDelete(false);

  console.log("isDeletedView in ArtworkModalUser:", isDeletedView);

  const fetchArtworkImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/artwork/${artwork.ArtworkID}/image`, {responseType: 'blob', });
      setImageUrl(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error fetching artwork image:', error);
    }
  };

  useEffect(() => {
    fetchArtworkImage();
  }, [artwork.ArtworkID]); // Re-fetch the image when artwork ID changes

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/artwork/${artwork.ArtworkID}`);
      console.log("Artwork deleted successfully");
      onRefresh(); // Refresh the artwork list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting artwork:", error);
    }
  };

  const handleModalRefresh = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/artwork/${artwork.ArtworkID}`);
      setArtwork(response.data);
      fetchArtworkImage();
    } catch (error) {
      console.error('Error fetching updated artwork data:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (!isEditMode && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRestore = async (artistId, departmentId) => {
    try {
        // Fetch both the artist and department information in parallel
        const [artistResponse, departmentResponse] = await Promise.all([
            axios.get(`http://localhost:5000/artist/${artistId}`),
            axios.get(`http://localhost:5000/department/${departmentId}`)
        ]);

        const artistData = artistResponse.data;
        const departmentData = departmentResponse.data[0]; // Access the first element if response is an array

        let errorMessages = [];

        // Check artist deletion status
        if (artistData.is_deleted === 1) {
            errorMessages.push("Cannot restore this artwork because the assigned artist is deleted. Please restore the artist first.");
        }

        // Check department deletion status
        if (departmentData.is_deleted === 1) {
            console.log("Department is marked as deleted."); // Debug log
            errorMessages.push("Cannot restore this artwork because the assigned department is deleted. Please restore the department first.");
        } else {
            console.log("Department is not deleted or missing is_deleted field."); // Debug log
        }

        // If there are error messages, show them and stop here
        if (errorMessages.length > 0) {
            setErrorMessage(errorMessages.join(" "));
            return;
        }

        // Proceed with restoring the artwork if the artist and department are active
        await axios.patch(`http://localhost:5000/artwork/${artwork.ArtworkID}/restore`);
        console.log("Artwork restored successfully");
        onRefresh(); // Refresh the artwork list
        onClose(); // Close the modal
    } catch (error) {
        console.error("Error restoring artwork:", error);
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

        {artwork_ && !isEditMode ? (
          <>
            <img src={artworkPreviewImages?.[artwork_.ArtworkID] || imageUrl} alt={artwork.Title} className={styles.image} />
            <h2>{artwork.Title}</h2>
            <p><strong>Artist:</strong> {artwork.artist_name || 'Unknown Artist'}</p>
            <p><strong>Year:</strong> {artwork.CreationYear}</p>
            <p><strong>Department:</strong> {artwork.department_name || 'Unknown Department'}</p>
            <p><strong>Medium:</strong> {artwork.Medium}</p>
            <p><strong>Height:</strong> {artwork.height} inches</p>
            <p><strong>Width:</strong> {artwork.width} inches</p>
            <p><strong>Depth:</strong> {artwork.depth || 'N/A'} inches</p>
            <p><strong>Acquisition Date:</strong> {artwork.acquisition_date ? new Date(artwork.acquisition_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'N/A'}</p>
            <p><strong>Condition:</strong> {artwork.ArtworkCondition}</p>
            <p><strong>Location:</strong> {artwork.location || 'Not Specified'}</p>
            <p><strong>Price:</strong> {artwork.price ? `$${artwork.price}` : 'N/A'}</p>
            <p><strong>Description:</strong> {artwork.Description}</p>
            {(role === 'admin' || role === 'staff') && location.pathname !== '/Art' && (
              <>
                {!isDeletedView ? (
                    <>
                      <button onClick={openEditMode}>Edit Artwork</button>
                      <button onClick={openConfirmDelete}>Delete Artwork</button>
                    </>
                ) : (
                  <>
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <button onClick={() => handleRestore(artwork.artist_id, artwork.department_id)}>Restore</button>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <EditArtworkModal
            artwork={artwork}
            onClose={() => setIsEditMode(false)}
            onRefresh={onRefresh}
            onModalRefresh={handleModalRefresh}
            setModalImagePreview={(previewUrl) => handlePreviewImageChange(artwork_.ArtworkID, previewUrl)}
          />
        )}
        {showConfirmDelete && (
          <ConfirmDeleteArtworkModal
            onConfirm={handleDelete}
            onCancel={closeConfirmDelete}
          />
        )}
      </div>
    </div>
  );
};

const EditArtworkModal = ({ artwork, onClose, onRefresh, onModalRefresh, setModalImagePreview }) => {
  const [Title, setTitle] = useState(artwork.Title || '');
  const [artistId, setArtistId] = useState(artwork.artist_id || '');
  const [departmentId, setDepartmentId] = useState(artwork.department_id || '');
  const [CreationYear, setCreationYear] = useState(artwork.CreationYear !== null ? artwork.CreationYear : '');
  const [medium, setMedium] = useState(artwork.Medium || '');
  const [customMedium, setCustomMedium] = useState('');
  const [height, setHeight] = useState(artwork.height !== null ? artwork.height : '');
  const [width, setWidth] = useState(artwork.width !== null ? artwork.width : '');
  const [depth, setDepth] = useState(artwork.depth !== null ? artwork.depth : '');
  const [acquisitionDate, setAcquisitionDate] = useState(artwork.acquisition_date ? artwork.acquisition_date.split("T")[0] : '');
  const [condition, setCondition] = useState(artwork.ArtworkCondition || '');
  const [customCondition, setCustomCondition] = useState('');
  const [location, setLocation] = useState(artwork.location || '');
  const [price, setPrice] = useState(artwork.price !== null ? artwork.price : '');
  const [description, setDescription] = useState(artwork.Description || '');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(artwork.imageUrl || '');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading state

  const [artists, setArtists] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [conditions, setConditions] = useState([]);

  // Fetch artists, departments, mediums, and conditions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, departmentsRes, mediumsRes, conditionsRes] = await Promise.all([
          axios.get(`http://localhost:5000/artist`),
          axios.get(`http://localhost:5000/department`),
          axios.get(`http://localhost:5000/mediums`),
          axios.get(`http://localhost:5000/artworkconditions`)
        ]);
        const validArtists = Array.isArray(artistRes.data) 
        ? artistRes.data.flat().filter(artist => artist.ArtistID) 
        : [];
        const validDepartments = Array.isArray(departmentsRes.data) 
        ? departmentsRes.data.flat().filter(department => department.DepartmentID) 
        : [];
        setArtists(validArtists);
        setDepartments(validDepartments);
        setMediums(mediumsRes.data);
        setConditions(conditionsRes.data);
      } catch (error) {
        console.error('Error fetching dropdown options:', error);
      }
    };
    fetchData();
  }, []);

  // Image preview handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
        //setModalImagePreview(previewUrl); // Pass the preview URL to ArtworkModalUser through ArtLookUp
    }
};

  // Function to check if any field has changed from the original artwork values
  const checkIfChanged = () => {
    const originalDate = artwork.acquisition_date ? artwork.acquisition_date.split("T")[0] : '';
    return (
      Title !== artwork.Title ||
      artistId !== artwork.artist_id ||
      departmentId !== artwork.department_id ||
      CreationYear !== artwork.CreationYear ||
      medium !== artwork.Medium ||
      height !== artwork.height ||
      width !== artwork.width ||
      (depth || '') !== (artwork.depth || '') ||  // Normalize depth comparison
      acquisitionDate !== originalDate ||
      condition !== artwork.ArtworkCondition ||
      (location || '') !== (artwork.location || '') ||  // Normalize location comparison
      (price || '') !== (artwork.price || '') ||  // Normalize price comparison
      description !== artwork.Description ||
      image !== null
    );
  };

  // Update hasChanges whenever any field is changed
  useEffect(() => {
    setHasChanges(checkIfChanged());
  }, [Title, artistId, departmentId, CreationYear, medium, height, width, depth, acquisitionDate, condition, location, price, description, image]);

  // Validate all required fields
  const validateFields = () => {
    const newErrors = {};
    if (!Title) newErrors.Title = "Title is required.";
    if (!artistId) newErrors.artistId = "Please select an artist.";
    if (!departmentId) newErrors.departmentId = "Please select a department.";
    if (!CreationYear) newErrors.CreationYear = "Creation year is required.";
    if (!medium) newErrors.medium = "Please select a medium.";
    if (!height) newErrors.height = "Height is required.";
    if (!width) newErrors.width = "Width is required.";
    if (!acquisitionDate) newErrors.acquisitionDate = "Acquisition date is required.";
    if (!condition) newErrors.condition = "Please select a condition.";
    if (!description) newErrors.description = "Description is required.";

    // Additional validation for custom fields
    if (medium === "Other") {
      if (!customMedium) {
        newErrors.customMedium = "Please specify the medium.";
      } else if (mediums.includes(customMedium)) {
        newErrors.customMedium = "This medium already exists in the list. Please select it from the dropdown.";
      }
    }
    if (condition === "Other") {
      if (!customCondition) {
        newErrors.customCondition = "Please specify the artwork condition.";
      } else if (conditions.includes(customCondition)) {
        newErrors.customCondition = "This condition already exists in the list. Please select it from the dropdown.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append('Title', Title);
    formData.append('artist_id', artistId);
    formData.append('department_id', departmentId);
    formData.append('CreationYear', CreationYear);
    formData.append('Medium', medium === 'Other' ? customMedium : medium);
    formData.append('height', height);
    formData.append('width', width);
    formData.append('depth', depth);
    formData.append('acquisition_date', acquisitionDate);
    formData.append('ArtworkCondition', condition === 'Other' ? customCondition : condition);
    formData.append('location', location);
    formData.append('price', price);
    formData.append('Description', description);
    if (image) formData.append('image', image);

    try {
      await axios.patch(`http://localhost:5000/artwork/${artwork.ArtworkID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onRefresh();
      onModalRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating artwork:', error);
      setError('Failed to update artwork');
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  return (
    <div>
      <h2>Edit Artwork</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <label>Image
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
      </label>

      <label>Title *
        <input type="text" value={Title} onChange={(e) => setTitle(e.target.value)} />
        {errors.Title && <p style={{ color: 'red' }}>{errors.Title}</p>}
      </label>

      <label>Artist *
        <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
          <option value="">Select Artist</option>
          {artists.map((artist) => (
            <option key={artist.ArtistID} value={artist.ArtistID}>{artist.name_}</option>
          ))}
        </select>
        {errors.artistId && <p style={{ color: 'red' }}>{errors.artistId}</p>}
      </label>

      <label>Department *
        <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.DepartmentID} value={department.DepartmentID}>{department.Name}</option>
          ))}
        </select>
        {errors.departmentId && <p style={{ color: 'red' }}>{errors.departmentId}</p>}
      </label>

      <label>Creation Year *
        <input type="number" value={CreationYear} onChange={(e) => setCreationYear(e.target.value)} />
        {errors.CreationYear && <p style={{ color: 'red' }}>{errors.CreationYear}</p>}
      </label>

      <label>Medium *
        <select value={medium} onChange={(e) => setMedium(e.target.value)}>
          <option value="">Select Medium</option>
          {mediums.map((med) => <option key={med} value={med}>{med}</option>)}
          <option value="Other">Other</option>
        </select>
        {medium === 'Other' && (
          <input type="text" placeholder="Specify medium" value={customMedium} onChange={(e) => setCustomMedium(e.target.value)} />
        )}
        {errors.medium && <p style={{ color: 'red' }}>{errors.medium}</p>}
        {errors.customMedium && <p style={{ color: 'red' }}>{errors.customMedium}</p>}
      </label>

      <label>Height (inches) *
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        {errors.height && <p style={{ color: 'red' }}>{errors.height}</p>}
      </label>

      <label>Width (inches) *
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        {errors.width && <p style={{ color: 'red' }}>{errors.width}</p>}
      </label>

      <label>Depth (inches)
        <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      </label>

      <label>Acquisition Date *
        <input type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
        {errors.acquisitionDate && <p style={{ color: 'red' }}>{errors.acquisitionDate}</p>}
      </label>

      <label>Condition *
        <select value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Select Condition</option>
          {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
          <option value="Other">Other</option>
        </select>
        {condition === 'Other' && (
          <input type="text" placeholder="Specify condition" value={customCondition} onChange={(e) => setCustomCondition(e.target.value)} />
        )}
        {errors.condition && <p style={{ color: 'red' }}>{errors.condition}</p>}
        {errors.customCondition && <p style={{ color: 'red' }}>{errors.customCondition}</p>}
      </label>

      <label>Location
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>

      <label>Price
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </label>

      <label>Description *
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
      </label>

      <button onClick={onClose}>Cancel</button>
      <button onClick={handleSave} disabled={!hasChanges || isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

const ConfirmDeleteArtworkModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to delete this artwork?</h2>
        <p>This action can be undone. Go to 'View Deleted' to restore.</p>
        <div className={styles.buttonContainer}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ color: "red" }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const ArtistCard = ({ artist_, onCardClick, artistImages }) => {
  useEffect(() => {
    console.log("Rendering ArtistCard with images:", artistImages);
  }, [artistImages]);
  return (
    <div className={styles.cards}>
      {artist_.map((artist) => (
        <div
          key={artist.ArtistID}
          className={styles.card}
          onClick={() => onCardClick(artist)}
        >
          <img src={artistImages[artist.ArtistID]} alt={artist.name_} className={styles.image} />
          <h1>{artist.name_}</h1>
          <p>{artist.nationality}</p>
          <p>{artist.birth_year} - {artist.death_year || 'Present'}</p>
        </div>
      ))}
    </div>
  );
};

const ArtistModalUser = ({ artist_, onClose, onRefresh, artistPreviewImages, handlePreviewArtistImageChange, isDeletedView }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [artist, setArtist] = useState(artist_);
  const [imageUrl, setImageUrl] = useState(null);

  const openEditMode = () => setIsEditMode(true);
  const openConfirmDelete = () => setShowConfirmDelete(true);
  const closeConfirmDelete = () => setShowConfirmDelete(false);

  const fetchArtistImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/artist/${artist.ArtistID}/image`, { responseType: 'blob' });
      setImageUrl(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error fetching artist image:', error);
    }
  };

  useEffect(() => {
    fetchArtistImage();
  }, [artist.ArtistID]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/artist/${artist.ArtistID}`);
      console.log("Artist deleted successfully");
      onClose(); // Close the modal first to prevent further rendering issues
      onRefresh(); // Then refresh the artist list after closing the modal
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const handleModalRefresh = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/artist/${artist.ArtistID}`);
      setArtist(response.data);
      fetchArtistImage();
    } catch (error) {
      console.error('Error fetching updated artist data:', error);
    }
  };

  const handleOverlayClick = (e) => {
    if (!isEditMode && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRestoreArtist = async (artistId) => {
    try {
      await axios.patch(`http://localhost:5000/artist/${artistId}/restore`);

      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error restoring artist:', error);
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

        {artist_ && !isEditMode ? (
          <>
            <img src={artistPreviewImages?.[artist_.ArtistID] || imageUrl} alt={artist.name_} className={styles.image} />
            <h2>{artist.name_}</h2>
            <p><strong>Gender:</strong> {artist.gender}</p>
            <p><strong>Nationality:</strong> {artist.nationality || 'Not specified'}</p>
            <p><strong>Birth Year:</strong> {artist.birth_year || 'Not specified'}</p>
            <p><strong>Death Year:</strong> {artist.death_year || 'N/A'}</p>
            <p><strong>Description:</strong> {artist.description || 'No description provided'}</p>
            {(role === 'admin' || role === 'staff') && location.pathname !== '/Art' && (
              <>
                {!isDeletedView ? (
                    <>
                      <button onClick={openEditMode}>Edit Artist</button>
                      <button onClick={openConfirmDelete}>Delete Artist</button>
                    </>
                ) : (
                  <button onClick={() => handleRestoreArtist(artist.ArtistID)}>Restore</button>
                )}
              </>
            )}
          </>
        ) : (
          <EditArtistModal
            artist={artist}
            onClose={() => setIsEditMode(false)}
            onRefresh={onRefresh}
            onModalRefresh={handleModalRefresh}
            setModalArtistImagePreview={(previewUrl) => handlePreviewArtistImageChange(artist_.ArtistID, previewUrl)}
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

const EditArtistModal = ({ artist, onClose, onRefresh, onModalRefresh, setModalArtistImagePreview }) => {
  const [nationalities, setNationalities] = useState([]);
  const [name, setName] = useState(artist.name_);
  const [gender, setGender] = useState(artist.gender);
  const [nationality, setNationality] = useState(artist.nationality);
  const [birthYear, setBirthYear] = useState(artist.birth_year || '');
  const [deathYear, setDeathYear] = useState(artist.death_year || '');
  const [description, setDescription] = useState(artist.description || '');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(artist.imageUrl || '');
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState(previewUrl);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Loading state

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/nationalities`);
        setNationalities(response.data);
      } catch (error) {
        console.error('Error fetching nationalities:', error);
      }
    };
    fetchNationalities();
  }, []);

  // Image preview handling
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
        console.log("Setting preview URL in EditArtistModal:", previewUrl);
        //setModalArtistImagePreview(previewUrl); // Pass the preview URL to ArtworkModalUser through ArtLookUp
    }
  };

  // Function to check if any field has changed from the original artwork values
  const checkIfChanged = () => {
    return (
      name !== artist.name_ ||
      gender !== artist.gender ||
      nationality !== artist.nationality ||
      birthYear !== artist.birth_year ||
      deathYear !== artist.death_year ||
      description !== artist.description ||
      image !== null
    );
  };

  // Update hasChanges whenever any field is changed
  useEffect(() => {
    setHasChanges(checkIfChanged());
  }, [name, gender, nationality, birthYear, deathYear, description, image]);

  // Validate all required fields
  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!nationality) newErrors.nationality = "Nationality is required.";
    if (!birthYear) newErrors.birthYear = "Birth year is required.";
    if (!description) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSaving(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('gender', gender);
    formData.append('nationality', nationality);
    formData.append('birthYear', birthYear);
    formData.append('deathYear', deathYear || '');
    formData.append('description', description);
    if (image) formData.append('image', image); // Append the file only if it's selected

    // Log all form data keys and values
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }

    try {
      const response = await axios.patch(`http://localhost:5000/artist/${artist.ArtistID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Response from backend:", response.data);
      onRefresh();
      onModalRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating artwork:', error);
      setError('Failed to update artwork');
    } finally {
      setIsSaving(false); // Reset saving state
    }
};

  return (
    <div>
      <h2>Edit Artist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>Change Image
          <input type="file" onChange={handleImageChange}/></label>
          {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
      <label>Name *
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required/></label>
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      <label>Gender *
        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
      </label>
      <label>Nationality *
        <select value={nationality} onChange={(e) => setNationality(e.target.value)} required>
          {nationalities.map((nat) => (
            <option key={nat} value={nat}>{nat}</option>
          ))}
        </select>
        {errors.nationality && <p style={{ color: 'red' }}>{errors.nationality}</p>}
      </label>
      <label>Birth Year *
        <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} required/>
        {errors.birthYear && <p style={{ color: 'red' }}>{errors.birthYear}</p>}
      </label>
      <label>Death Year
        <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)}/>
      </label>
      <label>Description *
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
        {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
      </label>
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleSave} disabled={!hasChanges || isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>    
    </div>
  );
};

const ConfirmDeleteArtistModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Are you sure you want to delete this artist?</h2>
        <p>WARNING: All artwork from this artist WILL be removed from the collection</p>
        <p>This action can be undone. Go to 'View Deleted' to restore.</p>
        <div className={styles.buttonContainer}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ color: "red" }}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const DepartmentCard = ({ department_, onRefresh, onEditClick, onDeleteClick, isDepartmentDeletedOpen }) => {

  const handleRestoreClick = async (departmentId) => {
      try {
          await axios.patch(`http://localhost:5000/department/${departmentId}/restore`);
          onRefresh();
      } catch (error) {
          console.error('Error restoring department:', error);
      }
  };

  return (
      <div className={styles.cards}>
          {department_.map((department) => (
              <div key={department.DepartmentID} className={styles.card}>
                  <h1>{department.Name}</h1>
                  <p>{department.Description}</p>
                  <p>{department.Location}</p>
                  {!isDepartmentDeletedOpen ? (
                      <>
                          <button onClick={(e) => { e.stopPropagation(); onEditClick(department); }}>Edit</button>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteClick(department.DepartmentID); }}>Delete</button>
                      </>
                  ) : (
                      <button onClick={(e) => { e.stopPropagation(); handleRestoreClick(department.DepartmentID); }}>Restore</button>
                  )}
              </div>
          ))}
      </div>
  );
};

const EditDepartmentModal = ({ department, onClose, onRefresh }) => {
  const [name, setName] = useState(department.Name || '');
  const [location, setLocation] = useState(department.Location || '');
  const [description, setDescription] = useState(department.Description || '');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Function to validate fields
  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Department name is required.";
    if (!description) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;
    setIsSaving(true);

    const updatedDepartmentData = { 
      name, 
      location, 
      description 
    };

    try {
      await axios.patch(`http://localhost:5000/department/${department.DepartmentID}`, updatedDepartmentData);
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error updating department:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>Edit Department</h2>
        <label>Department Name *
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </label>
        <label>Location
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          {errors.location && <p style={{ color: 'red' }}>{errors.location}</p>}
        </label>
        <label>Description *
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
        </label>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
      </div>
    </div>
  );
};

const ConfirmDeleteDepartmentModal = ({ onConfirm, onCancel }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h2>Are you sure you want to delete this department? This will also delete the artwork associated with this department</h2>
        <p>This action can be undone. Go to 'View Deleted' to restore.</p>
        <div className={styles.buttonContainer}>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ color: "red" }}>Delete</button>
        </div>
      </div>
    </div>
  );
};


export {ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser, DepartmentCard, EditDepartmentModal, ConfirmDeleteDepartmentModal};
