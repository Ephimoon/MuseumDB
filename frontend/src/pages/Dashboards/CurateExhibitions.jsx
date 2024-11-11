// import React, { useState, useEffect } from 'react';
// import HomeNavBar from '../../components/HomeNavBar';
// import ArtLookUp from '../../components/ArtLookUp';
// import styles from '../../css/Art.module.css';
// import axios from 'axios';

// const InsertExhibitionModal = ({ onClose, onSave }) => {
//     const [nationalities, setNationalities] = useState([]);
//     const [name, setName] = useState('');
//     const [gender, setGender] = useState('');
//     const [nationality, setNationality] = useState('');
//     const [birthYear, setBirthYear] = useState('');
//     const [deathYear, setDeathYear] = useState('');
//     const [description, setDescription] = useState('');
//     const [image, setImage] = useState(null);

//     useEffect(() => {
//         const fetchNationalities = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/nationalities`);
//                 setNationalities(response.data);
//             } catch (error) {
//                 console.error('Error fetching nationalities:', error);
//             }
//         };
//         fetchNationalities();
//     }, []);

//     const handleImageChange = (e) => setImage(e.target.files[0]);

//     const handleSave = () => {
//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('gender', gender);
//         formData.append('nationality', nationality);
//         formData.append('birthYear', birthYear);
//         formData.append('deathYear', deathYear ? parseInt(deathYear) : null);
//         formData.append('description', description);
//         if (image) formData.append('image', image);

//         onSave(formData);
//         onClose();
//     };

//     return (
//         <div className={styles.modalOverlay}>
//             <div className={styles.modalContent}>
//                 <h2>Insert New Artist</h2>
//                 {/* Form fields */}
//                 <label>Name *<input type="text" value={name} onChange={(e) => setName(e.target.value)} required /></label>
//                 <label>Gender*<select value={gender} onChange={(e) => setGender(e.target.value)} required>
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                 </select></label>
//                 <label>Nationality *<select value={nationality} onChange={(e) => setNationality(e.target.value)} required>
//                     <option value="">Select Nationality</option>
//                     {nationalities.map((nat) => <option key={nat} value={nat}>{nat}</option>)}
//                 </select></label>
//                 <label>Birth Year *<input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} /></label>
//                 <label>Death Year<input type="number" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} /></label>
//                 <label>Description *<textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
//                 <label>Image<input type="file" accept="image/*" onChange={handleImageChange} /></label>
//                 <div className={styles.buttonContainer}>
//                     <button onClick={onClose}>Cancel</button>
//                     <button onClick={handleSave}>Save</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const CurateExhibitions = () => {
//     const [isInsertExhibitionOpen, setIsInsertArtistOpen] = useState(false);
//     const [exhibitions, setExhibitions] = useState([]);
//     const [refreshExhibitions, setRefreshExhibitions] = useState(false);

//     useEffect(() => {
//         fetchExhibitions();
//     }, [refreshExhibitions]);

//     const fetchExhibitions = () => {
//         axios.get(`http://localhost:5000/exhibition`)
//             .then(response => setExhibitions(response.data))
//             .catch(error => console.error('Error fetching exhibitions:', error));
//     };

//     const openInsertArtistModal = () => setIsInsertArtistOpen(true);
//     const closeInsertArtistModal = () => setIsInsertArtistOpen(false);

//     const triggerArtistRefresh = () => setRefreshArtists(!refreshArtists);

//     const saveInsertArtist = (artistData) => {
//         axios.post(`http://localhost:5000/artist`, artistData, { headers: { 'Content-Type': 'multipart/form-data' } })
//             .then(() => { triggerArtistRefresh(); closeInsertArtistModal(); })
//             .catch(error => console.error('Error adding artist:', error));
//     };

//     return (
//         <div className={styles.ArtContainer}>
//             <HomeNavBar />
//             <h1>Curate Exhibtions</h1>
//             <button onClick={openInsertArtistModal}>Insert Artist</button>

//             <ArtLookUp
//                 refreshArtists={refreshArtists}
//                 triggerRefreshArtists={triggerArtistRefresh}
//             />

//             {isInsertArtistOpen && (
//                 <InsertArtistModal onClose={closeInsertArtistModal} onSave={saveInsertArtist} />
//             )}
//         </div>
//     );
// };

// export default CurateExhibitions;