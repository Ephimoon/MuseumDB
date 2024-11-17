import React, { useState, useEffect } from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import {ArtLookUp, DepartmentLookUp} from '../../components/ArtLookUp';
import styles from '../../css/Art.module.css';
import styles2 from '../../css/ArtworkCard.module.css';
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
    const [isSaving, setIsSaving] = useState(false); // Loading state
    const [errors, setErrors] = useState({});

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

    const handleSave = async () => {
        let newErrors = {};
        if (!name) newErrors.name = "Name is required";
        if (!gender) newErrors.gender = "Gender is required";
        if (!nationality) newErrors.nationality = "Nationality is required";
        if (!birthYear) newErrors.birthYear = "Birth year is required";
        if (!description) newErrors.description = "Description is required";

        setErrors(newErrors);

        // Stop if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsSaving(true); // Start loading state

        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('nationality', nationality);
        formData.append('birthYear', birthYear);
        formData.append('deathYear', deathYear ? parseInt(deathYear) : null);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await onSave(formData); // Call the onSave function passed as a prop
            onClose(); // Close the modal on success
        } catch (error) {
            console.error('Error saving artist:', error);
        } finally {
            setIsSaving(false); // End loading state
        }
    };

    // Disable the "Save" button if required fields are not filled
    const isSaveDisabled =
        !name || !gender || !nationality || !birthYear || !description || isSaving;

    return (
        <div className={styles2.edit_modal}>
            <div className={styles2.edit_modal_content}>
                <h2>Insert New Artist</h2>
                {/* Form fields */}
                <label>Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                {errors.name && <p className={styles2.error_message}>{errors.name}</p>}

                <label>Gender*</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.gender && <p className={styles2.error_message}>{errors.gender}</p>}

                <label>Nationality *</label>
                <select value={nationality} onChange={(e) => setNationality(e.target.value)} required>
                    <option value="">Select Nationality</option>
                    {nationalities.map((nat) => <option key={nat} value={nat}>{nat}</option>)}
                </select>
                {errors.nationality && <p className={styles2.error_message}>{errors.nationality}</p>}

                <label>Birth Year *</label>
                <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                {errors.birthYear && <p className={styles2.error_message}>{errors.birthYear}</p>}
                
                <label>Death Year</label>
                <input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} />
                
                <label>Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <p className={styles2.error_message}>{errors.description}</p>}
                
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                
                <div className={styles2.edit_modal_actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave} className={styles2.save}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
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
    const [isSaving, setIsSaving] = useState(false); // Loading state

    const isSaveDisabled =
    !Title || !artistId || !departmentId || !CreationYear || !medium || !height || !width || !acquisitionDate || !condition || !description || isSaving;

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
                console.log("Fetch Departments Response:", response); // Log the response to check its structure
                const validDepartments = response.data.flat().filter(department => department.DepartmentID);
                setDepartments(validDepartments);
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

    const handleSave = async () => {
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
    
        if (medium === "Other" && (!customMedium || mediums.includes(customMedium))) {
            newErrors.customMedium = customMedium
                ? "This medium already exists in the list. Please select it from the dropdown."
                : "Please specify the medium.";
        }
    
        if (condition === "Other" && (!customCondition || conditions.includes(customCondition))) {
            newErrors.customCondition = customCondition
                ? "This condition already exists in the list. Please select it from the dropdown."
                : "Please specify the artwork condition.";
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) {
            return;
        }
    
        setIsSaving(true); // Start loading state
    
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
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving artwork:', error);
        } finally {
            setIsSaving(false); // End loading state
        }
    };    

    return (
        <div className={styles2.edit_modal}>
            <div className={styles2.edit_modal_content}>
                <h2>Insert New Artwork</h2>

                <label>Title *</label>
                <input type="text" value={Title} onChange={(e) => setTitle(e.target.value)} />
                {errors.Title && <p className={styles2.error_message}>{errors.Title}</p>}

                {/* Artist Dropdown */}
                <label>Artist *</label>
                <select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
                    <option value="">Select Artist</option>
                    {artists.map((artist) => <option key={artist.ArtistID} value={artist.ArtistID}>{artist.name_}</option>)}
                </select>
                {errors.artistId && <p className={styles2.error_message}>{errors.artistId}</p>}

                {/* Department Dropdown */}
                <label>Department *</label>
                <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map((department) => <option key={department.DepartmentID} value={department.DepartmentID}>{department.Name}</option>)}
                </select>
                {errors.departmentId && <p className={styles2.error_message}>{errors.departmentId}</p>}                

                {/* Creation Year */}
                <label>Creation Year *</label>
                <input type="number" value={CreationYear} onChange={(e) => setCreationYear(e.target.value)} />
                {errors.CreationYear && <p className={styles2.error_message}>{errors.CreationYear}</p>}                

                {/* Medium Dropdown with Other Option */}
                <label>Medium *</label>
                <select value={medium} onChange={(e) => setMedium(e.target.value)}>
                    <option value="">Select Medium</option>
                    {mediums.map((med) => <option key={med} value={med}>{med}</option>)}
                    <option value="Other">Other</option>
                </select>
                {medium === 'Other' && (
                    <input type="text" placeholder="Specify medium" value={customMedium} onChange={(e) => setCustomMedium(e.target.value)} />
                )}
                {errors.medium && <p className={styles2.error_message}>{errors.medium}</p>}
                {errors.customMedium && <p className={styles2.error_message}>{errors.customMedium}</p>}                

                {/* Dimensions */}
                <label>Height (inches) *</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                {errors.height && <p className={styles2.error_message}>{errors.height}</p>}                

                <label>Width (inches) *</label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                {errors.width && <p className={styles2.error_message}>{errors.width}</p>}                

                <label>Depth (inches)</label>
                <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />                

                {/* Acquisition Date, Condition, Location */}
                <label>Acquisition Date *</label>
                <input type="date" value={acquisitionDate} onChange={(e) => setAcquisitionDate(e.target.value)} />
                {errors.acquisitionDate && <p className={styles2.error_message}>{errors.acquisitionDate}</p>}               

                <label>Condition *</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                    <option value="">Select Condition</option>
                    {conditions.map((cond) => <option key={cond} value={cond}>{cond}</option>)}
                    <option value="Other">Other</option>
                </select>
                {condition === 'Other' && (
                    <input type="text" placeholder="Specify condition" value={customCondition} onChange={(e) => setCustomCondition(e.target.value)} />
                )}
                {errors.condition && <p className={styles2.error_message}>{errors.condition}</p>}
                {errors.customCondition && <p className={styles2.error_message}>{errors.customCondition}</p>}

                {/* Location, Price, Description, Image */}
                <label>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />                

                <label>Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />               

                <label>Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <p className={styles2.error_message}>{errors.description}</p>}

                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />               

                <div className={styles2.edit_modal_actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave} className={styles2.save}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const InsertDepartmentModal = ({ onClose, onSave }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [departmentLocation, setDepartmentLocation] = useState('');
    const [departmentDescription, setDepartmentDescription] = useState('');
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false); // Loading state

    // Disable Save Button Logic
    const isSaveDisabled =
    !departmentName || !departmentDescription || isSaving;

    const handleSave = async () => {
        const newErrors = {};
        if (!departmentName) newErrors.departmentName = 'Department name is required.';
        if (!departmentDescription) newErrors.departmentDescription = 'Description is required.';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        setIsSaving(true); // Start loading state

        const departmentData = {
            name: departmentName,
            location: departmentLocation,
            description: departmentDescription,
        };

        try {
            await onSave(departmentData); // Call the onSave function
            onClose(); // Close the modal on success
        } catch (error) {
            console.error('Error saving department:', error);
        } finally {
            setIsSaving(false); // End loading state
        }
    };

    return (
        <div className={styles2.edit_modal}>
            <div className={styles2.edit_modal_content}>
                <h2>Insert New Department</h2>
                <label>Department Name *</label>
                <input
                    type="text"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                />
                {errors.departmentName && <p className={styles2.error_message}>{errors.departmentName}</p>}
                
                <label>Location</label>
                <input
                    type="text"
                    value={departmentLocation}
                    onChange={(e) => setDepartmentLocation(e.target.value)}
                />
                
                <label>Description *</label>
                <textarea
                    value={departmentDescription}
                    onChange={(e) => setDepartmentDescription(e.target.value)}
                />
                {errors.departmentDescription && <p className={styles2.error_message}>{errors.departmentDescription}</p>}
                
                <div className={styles2.edit_modal_actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave} className={styles2.save}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CurateArt = () => {
    const [isInsertArtistOpen, setIsInsertArtistOpen] = useState(false);
    const [isInsertArtworkOpen, setIsInsertArtworkOpen] = useState(false);
    const [isInsertDepartmentOpen, setIsInsertDepartmentOpen] = useState(false);
    const [isDeletedOpen, setIsDeletedOpen] = useState(false);
    const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
    const [isDepartmentDeletedOpen, setIsDepartmentDeletedOpen] = useState(false);
    const [artists, setArtists] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [refreshArtists, setRefreshArtists] = useState(false);
    const [refreshArtworks, setRefreshArtworks] = useState(false);
    const [refreshDepartments, setRefreshDepartments] = useState(false); // State for refreshing departments

    useEffect(() => {
        fetchArtists();
    }, [refreshArtists, isDeletedOpen]);

    const fetchArtists = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/artist?isDeleted=${isDeletedOpen}`)
            .then(response => {
                const validArtists = response.data.flat().filter(artist => artist.ArtistID);
                setArtists(validArtists);
            })
            .catch(error => console.error('Error fetching artists:', error));
    };

    useEffect(() => {
        fetchArtworks();
    }, [refreshArtworks, isDeletedOpen]);

    const fetchArtworks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/artwork?isDeleted=${isDeletedOpen}`)
            .then(response => setArtworks(response.data))
            .catch(error => console.error('Error fetching artworks:', error));
    };

    const openInsertArtistModal = () => setIsInsertArtistOpen(true);
    const closeInsertArtistModal = () => setIsInsertArtistOpen(false);
    const openInsertArtworkModal = () => setIsInsertArtworkOpen(true);
    const closeInsertArtworkModal = () => setIsInsertArtworkOpen(false);
    const openInsertDepartmentModal = () => setIsInsertDepartmentOpen(true);
    const closeInsertDepartmentModal = () => setIsInsertDepartmentOpen(false);

    const triggerArtistRefresh = () => setRefreshArtists(!refreshArtists);
    const triggerArtworkRefresh = () => setRefreshArtworks(!refreshArtworks);
    const triggerDepartmentRefresh = () => setRefreshDepartments(!refreshDepartments); // Refresh function for departments

    const saveInsertArtwork = (artworkData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/artwork`, artworkData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                triggerArtworkRefresh();
                closeInsertArtworkModal();
            })
            .catch(error => console.error('Error adding artwork:', error));
    };

    const saveInsertArtist = (artistData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/artist`, artistData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                triggerArtistRefresh();
                closeInsertArtistModal();
            })
            .catch(error => console.error('Error adding artist:', error));
    };

    const saveInsertDepartment = (departmentData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/department`, departmentData)
            .then(() => {
                triggerDepartmentRefresh(); // Trigger department refresh
                closeInsertDepartmentModal();
            })
            .catch(error => console.error('Error adding department:', error));
    };

    return (
        <div className={styles.ArtContainer}>
            <HomeNavBar />
            <h1 className={styles.searchTitle}>Curate Art</h1>
            <div className={styles.buttonContainer}>
                {!isDeletedOpen && (
                    <>
                        {isDepartmentOpen ? (
                            <>
                                {!isDepartmentDeletedOpen && (
                                    <button onClick={openInsertDepartmentModal} className={styles.addButton}>Insert Department</button>
                                )}
                                <button onClick={() => setIsDepartmentDeletedOpen(!isDepartmentDeletedOpen)}>
                                    {isDepartmentDeletedOpen ? 'View Active Departments' : 'View Deleted Departments'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={openInsertArtworkModal} className={styles.addButton}>Insert Artwork</button>
                                <button onClick={openInsertArtistModal} className={styles.addButton}>Insert Artist</button>
                            </>
                        )}
                    </>
                )}
                {!isDepartmentOpen && (
                    <button onClick={() => setIsDeletedOpen(!isDeletedOpen)}>
                        {isDeletedOpen ? 'View Active' : 'View Deleted'}
                    </button>
                )}
                {!isDeletedOpen && !isDepartmentDeletedOpen && (
                    <button onClick={() => setIsDepartmentOpen(!isDepartmentOpen)} className={styles.depButton}>
                        {isDepartmentOpen ? 'View Artwork and Artists' : 'View Departments'}
                    </button>
                )}
            </div>
    
            {!isDepartmentOpen ? (
                <ArtLookUp
                    refreshArtists={refreshArtists}
                    refreshArtworks={refreshArtworks}
                    triggerRefreshArtists={triggerArtistRefresh}
                    triggerRefreshArtworks={triggerArtworkRefresh}
                    isDeletedView={isDeletedOpen}
                />
            ) : (
                <DepartmentLookUp
                    isDepartmentDeletedOpen={isDepartmentDeletedOpen}
                    refreshDepartments={refreshDepartments}
                />
            )}
    
            {isInsertArtworkOpen && (
                <InsertArtworkModal onClose={closeInsertArtworkModal} onSave={saveInsertArtwork} artists={artists} />
            )}
            {isInsertArtistOpen && (
                <InsertArtistModal onClose={closeInsertArtistModal} onSave={saveInsertArtist} />
            )}
            {isInsertDepartmentOpen && (
                <InsertDepartmentModal onClose={closeInsertDepartmentModal} onSave={saveInsertDepartment} />
            )}
        </div>        
    );
};

export default CurateArt;