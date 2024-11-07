import React, { useState, useEffect } from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import ArtLookUp from '../../components/ArtLookUp';
import styles from '../../css/Art.module.css';
import axios from 'axios';
import config from '../../config';

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
            const response = await axios.get(`${config.backendUrl}/api/nationalities`);
            setNationalities(response.data);
          } catch (error) {
            console.error('Error fetching nationalities:', error);
          }
        };
        fetchNationalities();
      }, []);

    // Handle file input change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Set the image file
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('nationality', nationality);
        formData.append('birthYear', birthYear);
        formData.append('deathYear', deathYear ? parseInt(deathYear) : null);
        formData.append('description', description);
        if (image) {
            formData.append('image', image); // Add image file to FormData
        }
    
        // Log FormData values to check what's being sent
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        onSave(formData); // Call onSave with FormData object
        onClose();
    };
    

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Insert New Artist</h2>
                
                <label>
                    Name *
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Gender*
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <label>
                    Nationality *
                    <select 
                        value={nationality} 
                        onChange={(e) => setNationality(e.target.value)} 
                        required
                    >
                        <option value="">Select Nationality</option> {/* Placeholder option */}
                        {nationalities.map((nat) => (
                            <option key={nat} value={nat}>{nat}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Birth Year *
                    <input
                        type="number"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                    />
                </label>
                
                <label>
                    Death Year
                    <input
                        type="number"
                        value={deathYear}
                        onChange={(e) => setDeathYear(e.target.value)}
                    />
                </label>
                <label>
                    Description *
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                
                <label>
                    Image
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
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
    const openInsertArtistModal = () => {
        setIsInsertArtistOpen(true);
    };
    const closeInsertArtistModal = () => {
        setIsInsertArtistOpen(false);
    };

    const [refreshArtists, setRefreshArtists] = useState(false);
    const triggerRefresh = () => {
        setRefreshArtists(!refreshArtists);
    };

    const saveInsertArtist = (artistData) => {
        console.log('Sending artist data:', artistData);
        for (let [key, value] of artistData.entries()) {
            console.log(`${key}:`, value);
        }

        axios.post(`${config.backendUrl}/artist`, artistData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            console.log('Artist added:', response.data);
            triggerRefresh();
            closeInsertArtistModal();
        })
        .catch(error => console.error('Error adding artist:', error));
    };

    return (
        <div className={styles.ArtContainer}>
            <HomeNavBar />
            <h1>Curate Art</h1>
            <button onClick={openInsertArtistModal}>Insert Artist</button>
            <ArtLookUp refreshArtists={refreshArtists} onRefresh={triggerRefresh} />

            {isInsertArtistOpen && (
                <InsertArtistModal onClose={closeInsertArtistModal} onSave={saveInsertArtist} onRefresh={triggerRefresh} />
            )}
        </div>
    );
};

export default CurateArt;