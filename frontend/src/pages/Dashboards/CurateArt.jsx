import React, { useState, useEffect } from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import ArtLookUp from '../../components/ArtLookUp';
import styles from '../../css/Art.module.css';
import axios from 'axios';

const InsertArtistModal = ({ onClose, onSave }) => {
    const [nationalities, setNationalities] = useState([]);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [deathYear, setDeathYear] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchNationalities = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/nationalities`);
                setNationalities(response.data);
            } catch (error) {
                console.error('Error fetching nationalities:', error);
            }
        };
        fetchNationalities();
    }, []);

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('nationality', nationality);
        formData.append('birthYear', birthYear);
        formData.append('deathYear', deathYear ? parseInt(deathYear) : null);
        formData.append('description', description);
        if (image) formData.append('image', image);

        onSave(formData);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Insert New Artist</h2>
                {/* Form fields */}
                <label>Name *<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
                <label>Gender*<select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select></label>
                <label>Nationality *<select value={nationality} onChange={(e) => setNationality(e.target.value)} required>
                    <option value="">Select Nationality</option>
                    {nationalities.map((nat) => <option key={nat} value={nat}>{nat}</option>)}
                </select></label>
                <label>Birth Year *<input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} /></label>
                <label>Death Year<input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} /></label>
                <label>Description *<textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
                <label>Image<input type="file" accept="image/*" onChange={handleImageChange} /></label>
                <div className={styles.buttonContainer}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

const InsertArtworkModal = ({ onClose, onSave, artists }) => {
    const [Title, setTitle] = useState('');
    const [artistId, setArtistId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [CreationYear, setCreationYear] = useState('');
    const [medium, setMedium] = useState('');
    const [customMedium, setCustomMedium] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [acquisitionDate, setAcquisitionDate] = useState('');
    const [condition, setCondition] = useState('');
    const [customCondition, setCustomCondition] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    // Options
    const [departments, setDepartments] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [conditions, setConditions] = useState([]);

    // Error tracking for multiple fields
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/department`);
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        const fetchMediums = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/mediums`);
                setMediums(response.data);
            } catch (error) {
                console.error('Error fetching mediums:', error);
            }
        };

        const fetchConditions = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/artworkconditions`);
                setConditions(response.data);
            } catch (error) {
                console.error('Error fetching artworkconditions:', error);
            }
        };

        fetchDepartments();
        fetchMediums();
        fetchConditions();
    }, []);

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSave = () => {
        let newErrors = {};

        // Basic field validations
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

        // If "Other" is selected for medium, check if custom medium is provided and if it already exists
        if (medium === "Other") {
            if (!customMedium) {
                newErrors.customMedium = "Please specify the medium.";
            } else if (mediums.includes(customMedium)) {
                newErrors.customMedium = "This medium already exists in the list. Please select it from the dropdown.";
            }
        }

        // If "Other" is selected for condition, check if custom condition is provided and if it already exists
        if (condition === "Other") {
            if (!customCondition) {
                newErrors.customCondition = "Please specify the artwork condition.";
            } else if (conditions.includes(customCondition)) {
                newErrors.customCondition = "This condition already exists in the list. Please select it from the dropdown.";
            }
        }

        setErrors(newErrors);

        // Stop if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Proceed with form submission if no errors
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

        onSave(formData);
        onClose();
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Insert New Artwork</h2>
                <label>Title *
                    <input type="text" value={Title} onChange={(e) => setTitle(e.target.value)} />
                    {errors.Title && <p style={{ color: 'red' }}>{errors.Title}</p>}
                </label>

                {/* Artist Dropdown */}
                <label>Artist *
                    <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
                        <option value="">Select Artist</option>
                        {artists.map((artist) => <option key={artist.ArtistID} value={artist.ArtistID}>{artist.name_}</option>)}
                    </select>
                    {errors.artistId && <p style={{ color: 'red' }}>{errors.artistId}</p>}
                </label>

                {/* Department Dropdown */}
                <label>Department *
                    <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                        <option value="">Select Department</option>
                        {departments.map((department) => <option key={department.DepartmentID} value={department.DepartmentID}>{department.Name}</option>)}
                    </select>
                    {errors.departmentId && <p style={{ color: 'red' }}>{errors.departmentId}</p>}
                </label>

                {/* Creation Year */}
                <label>Creation Year *
                    <input type="number" value={CreationYear} onChange={(e) => setCreationYear(e.target.value)} />
                    {errors.CreationYear && <p style={{ color: 'red' }}>{errors.CreationYear}</p>}
                </label>

                {/* Medium Dropdown with Other Option */}
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

                {/* Dimensions */}
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

                {/* Acquisition Date, Condition, Location */}
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

                {/* Location, Price, Description, Image */}
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

                <label>Image
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>

                <div className={styles.buttonContainer}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

const CurateArt = () => {
    const [isInsertArtistOpen, setIsInsertArtistOpen] = useState(false);
    const [isInsertArtworkOpen, setIsInsertArtworkOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [refreshArtists, setRefreshArtists] = useState(false);
    const [refreshArtworks, setRefreshArtworks] = useState(false);

    useEffect(() => {
        fetchArtists();
    }, [refreshArtists]);

    const fetchArtists = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/artist`)
            .then(response => setArtists(response.data))
            .catch(error => console.error('Error fetching artists:', error));
    };

    useEffect(() => {
        fetchArtworks();
    }, [refreshArtworks]);

    const fetchArtworks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/artwork`)
            .then(response => setArtworks(response.data))
            .catch(error => console.error('Error fetching artworks:', error));
    };

    const openInsertArtistModal = () => setIsInsertArtistOpen(true);
    const closeInsertArtistModal = () => setIsInsertArtistOpen(false);
    const openInsertArtworkModal = () => setIsInsertArtworkOpen(true);
    const closeInsertArtworkModal = () => setIsInsertArtworkOpen(false);

    const triggerArtistRefresh = () => setRefreshArtists(!refreshArtists);
    const triggerArtworkRefresh = () => setRefreshArtworks(!refreshArtworks);

    // refresh both artist lists after saving new artwork
    const saveInsertArtwork = (artworkData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/artwork`, artworkData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                // Refresh both artist and artwork lists
                triggerArtistRefresh();
                triggerArtworkRefresh();
                closeInsertArtworkModal();
            })
            .catch(error => console.error('Error adding artwork:', error));
    };

    const saveInsertArtist = (artistData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/artist`, artistData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => { triggerArtistRefresh(); closeInsertArtistModal(); })
            .catch(error => console.error('Error adding artist:', error));
    };

    return (
        <div className={styles.ArtContainer}>
            <HomeNavBar />
            <h1>Curate Art</h1>
            <button onClick={openInsertArtworkModal}>Insert Artwork</button>
            <button onClick={openInsertArtistModal}>Insert Artist</button>

            <ArtLookUp
                refreshArtists={refreshArtists}
                refreshArtworks={refreshArtworks}
                triggerRefreshArtists={triggerArtistRefresh}
                triggerRefreshArtworks={triggerArtworkRefresh}
            />

            {isInsertArtistOpen && (
                <InsertArtistModal onClose={closeInsertArtistModal} onSave={saveInsertArtist} />
            )}
            {isInsertArtworkOpen && (
                <InsertArtworkModal onClose={closeInsertArtworkModal} onSave={saveInsertArtwork} artists={artists} />
            )}
        </div>
    );
};

export default CurateArt;
