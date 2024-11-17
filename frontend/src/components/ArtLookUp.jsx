import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser } from '../components/ArtworkCard';
import styles from '../css/Art.module.css';
import axios from 'axios';
import config from '../config';

const ArtLookUp = ({ refreshArtworks, refreshArtists, triggerRefreshArtists, triggerRefreshArtworks }) => {
    const location = useLocation();
    const role = localStorage.getItem('role');

    const [artworks, setArtworks] = useState([]);
    const [artistsWithArtwork, setArtistsWithArtwork] = useState([]);
    const [artistsWithoutArtwork, setArtistsWithoutArtwork] = useState([]);

    const [departments, setDepartments] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [years, setYears] = useState([]);
    //const [conditions, setConditions] = useState([]);
    const [nationalities, setNationalities] = useState([]);

    // SEARCH, FILTER, SORT
    const [query, setQuery] = useState('');
    const [selectedMediumQ, setSelectedMediumQ] = useState('');
    const [selectedArtistQ, setSelectedArtistQ] = useState('');
    const [selectedYearQ, setSelectedYearQ] = useState('');
    const [selectedDepartmentQ, setSelectedDepartmentQ] = useState('');
    const [selectedGenderQ, setSelectedGenderQ] = useState('');
    const [selectedNationalityQ, setSelectedNationalityQ] = useState('');

    const [activeTab, setActiveTab] = useState('artwork');
    const [sortOption, setSortOption] = useState(activeTab === 'artwork' ? 'title_asc' : 'artist_asc');

    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [filteredArtistsWithArtwork, setFilteredArtistsWithArtwork] = useState([]);
    const [filteredArtistsWithoutArtwork, setFilteredArtistsWithoutArtwork] = useState([]);

    

    useEffect(() => {
        if (activeTab === 'artwork') {
            setFilteredArtworks(searchArtwork(artworks));
        } else {
            setFilteredArtistsWithArtwork(searchArtists(artistsWithArtwork));
            setFilteredArtistsWithoutArtwork(searchArtists(artistsWithoutArtwork));
        }
    }, [query, selectedMediumQ, selectedArtistQ, selectedYearQ, selectedDepartmentQ, sortOption, selectedGenderQ, selectedNationalityQ, activeTab, artworks, artistsWithArtwork, artistsWithoutArtwork]);

    useEffect(() => {
        fetchArtwork();
        fetchArtists();
        fetchFilterOptions();
    }, [refreshArtworks, refreshArtists]);

    const fetchArtwork = () => {
<<<<<<< Updated upstream
        axios.get(`${config.backendUrl}/artwork`)
            .then(response => setArtworks(response.data))
            .catch(err => console.log('Error fetching artwork:', err));
    };

    const fetchArtists = async () => {
        try {
            const responseWithArtwork = await axios.get(`${config.backendUrl}/artist-with-artwork`);
            const responseWithoutArtwork = await axios.get(`${config.backendUrl}/artist-null-artwork`);
            setArtistsWithArtwork(responseWithArtwork.data);
            setArtistsWithoutArtwork(responseWithoutArtwork.data);
=======
        console.log("isDeletedView:", isDeletedView);
        axios.get(`http://localhost:5000/artwork?isDeleted=${isDeletedView}`)
            .then(response => {
                console.log("Artwork data:", response.data); // Log the data to see if it's fetched
                setArtworks(response.data[0]);
            })
            .catch(err => console.log('Error fetching artwork:', err));
    };

    useEffect(() => {
        fetchAllArtworkImages();
    }, [artworks]);

    const fetchAllArtworkImages = async () => {
        const images = {};
        await Promise.all(
            artworks.map(async (art_image) => {
                try {
                    const response = await axios.get(`http://localhost:5000/artwork/${art_image.ArtworkID}/image`, {
                        responseType: 'blob',
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    images[art_image.ArtworkID] = imageUrl;
                    console.log(`Fetched image for artwork ${art_image.ArtworkID}`);
                } catch (error) {
                    console.error(`Error fetching image for artwork ${art_image.ArtworkID}:, error`);
                }
            })
        );
        setArtworkImages(images); // Update artworkImages state with all images
    };
    // Update specific artwork preview in artworkPreviewImages
    const handlePreviewImageChange = (artworkId, previewUrl) => {
        setArtworkPreviewImages((prev) => ({
            ...prev,
            [artworkId]: previewUrl,
        }));
    };

    const fetchArtists = async () => {
        try {
            const responseWithArtwork = await axios.get(`http://localhost:5000/artist-with-artwork?isDeleted=${isDeletedView}`);
            const responseWithoutArtwork = await axios.get(`http://localhost:5000/artist-null-artwork?isDeleted=${isDeletedView}`);

            // Combine and filter out entries without ArtistID
            const artistsWithArtwork = responseWithArtwork.data.flat().filter(artist => artist.ArtistID);
            const artistsWithoutArtwork = responseWithoutArtwork.data.flat().filter(artist => artist.ArtistID);

            console.log("Filtered Artists with artwork:", artistsWithArtwork);
            console.log("Filtered Artists without artwork:", artistsWithoutArtwork);

            setArtists([...artistsWithArtwork, ...artistsWithoutArtwork]);
            setArtistsWithArtwork(artistsWithArtwork);
            setArtistsWithoutArtwork(artistsWithoutArtwork);
>>>>>>> Stashed changes
        } catch (err) {
            console.log('Error fetching artists:', err);
        }
    };

<<<<<<< Updated upstream
    const fetchFilterOptions = async () => {
        try {
            const departmentRes = await axios.get(`${config.backendUrl}/department`);
            const mediumsRes = await axios.get(`${config.backendUrl}/mediums`);
            const yearsRes = await axios.get(`${config.backendUrl}/creation-years`);
            //const conditionsRes = await axios.get(`${config.backendUrl}/artworkconditions`);
            const nationalitiesRes = await axios.get(`${config.backendUrl}/nationalities`);
=======
    useEffect(() => {
        fetchAllArtistImages();
    }, [artists]);

    const fetchAllArtistImages = async () => {
        const images = {};
        await Promise.all(
            artists.filter(artist_image => artist_image.ArtistID).map(async (artist_image) => {
                try {
                    const response = await axios.get(`http://localhost:5000/artist/${artist_image.ArtistID}/image`, {
                        responseType: 'blob',
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    images[artist_image.ArtistID] = imageUrl;
                    console.log(`Fetched image for artist ${artist_image.ArtistID}`);
                } catch (error) {
                    console.error(`Error fetching image for artist ${artist_image.ArtistID}:`, error);
                }
            })
        );
        setArtistImages(images);
    };
    // Update specific artwork preview in artworkPreviewImages
    const handlePreviewArtistImageChange = (artistId, previewUrl) => {
        console.log(`Updating preview for artist ${artistId} with URL:`, previewUrl);
        setArtistPreviewImages((prev) => ({
            ...prev,
            [artistId]: previewUrl,
        }));
    };




    const fetchFilterOptions = async () => {
        try {
            const departmentRes = await axios.get(`http://localhost:5000/department`);
            const mediumsRes = await axios.get(`http://localhost:5000/mediums`);
            const yearsRes = await axios.get(`http://localhost:5000/creation-years`);
            //const conditionsRes = await axios.get(`http://localhost:5000/artworkconditions`);
            const nationalitiesRes = await axios.get(`http://localhost:5000/nationalities`);
>>>>>>> Stashed changes

            setDepartments(departmentRes.data);
            setMediums(mediumsRes.data);
            setYears(yearsRes.data);
            //setConditions(conditionsRes.data);
            setNationalities(nationalitiesRes.data);
        } catch (err) {
            console.log('Error fetching filter options:', err);
        }
    };

    const clearFilters = () => {
        setSelectedMediumQ('');
        setSelectedArtistQ('');
        setSelectedYearQ('');
        setSelectedDepartmentQ('');
        setSelectedGenderQ('');
        setSelectedNationalityQ('');
        setQuery('');
        setSortOption('A-Z');
    };

    const handleTabSwitch = (tab) => {
        clearFilters();
        setActiveTab(tab);

        // Set default sort option based on the tab
        if (tab === 'artwork') {
            setSortOption('title_asc');  // Default sorting for artwork
        } else if (tab === 'artist') {
            setSortOption('artist_asc');  // Default sorting for artist
        }
    };

    // Search and filter artwork
    const searchArtwork = (artworks) => {
        return artworks.filter((artwork) => {
            const artistName = artwork.artist_name ? artwork.artist_name.toLowerCase() : '';
            const title = artwork.Title ? artwork.Title.toLowerCase() : '';
            const medium = artwork.Medium || '';
            const year = artwork.CreationYear || '';
            const departmentName = artwork.department_name || '';
    
            return (
                (title.includes(query.toLowerCase()) || artistName.includes(query.toLowerCase())) &&
                (!selectedMediumQ || medium === selectedMediumQ) &&
                (!selectedArtistQ || artistName === selectedArtistQ.toLowerCase()) &&
                (!selectedYearQ || year.toString() === selectedYearQ) &&
                (!selectedDepartmentQ || departmentName === selectedDepartmentQ)
            );
        }).sort((a, b) => {
            switch (sortOption) {
                case 'title_asc':
                    return a.Title.localeCompare(b.Title);
                case 'title_desc':
                    return b.Title.localeCompare(a.Title);
                case 'year_asc':
                    return a.CreationYear - b.CreationYear;
                case 'year_desc':
                    return b.CreationYear - a.CreationYear;
                case 'artist_asc':
                    return a.artist_name.localeCompare(b.artist_name);
                case 'artist_desc':
                    return b.artist_name.localeCompare(a.artist_name);
                default:
                    return 0;
            }
        });
    };

    // Search and filter artists
    const searchArtists = (artists) => {
        return artists
            .filter((artist) => {
                // Normalize artist name to avoid undefined errors and enable case-insensitive search
                const artistName = artist.name_ ? artist.name_.toLowerCase() : '';
                const artistGender = artist.gender || '';
                const artistNationality = artist.nationality || '';
    
                // Apply all filters and search query
                return (
                    (!query || artistName.includes(query.toLowerCase())) && // Search by artist name
                    (!selectedGenderQ || artistGender === selectedGenderQ) && // Filter by gender
                    (!selectedNationalityQ || artistNationality === selectedNationalityQ) // Filter by nationality
                );
            })
            .sort((a, b) => {
                // Access name_ directly for sorting
                const nameA = a.name_ || '';
                const nameB = b.name_ || '';
                if (sortOption === 'artist_asc') {
                    return nameA.localeCompare(nameB);
                } else if (sortOption === 'artist_desc') {
                    return nameB.localeCompare(nameA);
                }
                return 0;
            });
    };
    


    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
    const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

    const openArtworkModal = (artwork) => {
        setSelectedArtwork(artwork);
        setIsArtworkModalOpen(true);
    };
    const closeArtworkModal = () => {
        setSelectedArtwork(null);
        setIsArtworkModalOpen(false);
    };

    const openArtistModal = (artist) => {
        setSelectedArtist(artist);
        setIsArtistModalOpen(true);
    };
    const closeArtistModal = () => {
        setSelectedArtist(null);
        setIsArtistModalOpen(false);
    };

    return (
        <div>
            <div className={styles.FilterContainer}>
                <h1>Search Collection</h1>
                <div className={styles.tabs}>
                    <button onClick={() => handleTabSwitch('artwork')} className={activeTab === 'artwork' ? styles.activeTab : ''}>
                        Artwork
                    </button>
                    <button onClick={() => handleTabSwitch('artist')} className={activeTab === 'artist' ? styles.activeTab : ''}>
                        Artist
                    </button>
                </div>

                {/* Search */}
                <div className={styles.search}>
                    <input 
                    type="text" 
                    placeholder={activeTab === 'artwork' ? 'Search artwork or artist name...' : 'Search artist name...'} 
                    value={query} 
                    className='search' 
                    onChange={(e) => setQuery(e.target.value)} 
                    />
                </div>

                <h2>Filter By</h2>

                {/* Filters for Artwork */}
                {activeTab === 'artwork' && (
                    <div className={styles.filterSection}>
                        <select onChange={(e) => setSelectedMediumQ(e.target.value)} value={selectedMediumQ}>
                            <option value="">Medium</option>
                            {mediums.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setSelectedArtistQ(e.target.value)} value={selectedArtistQ}>
                            <option value="">Artist</option>
                            {artistsWithArtwork.map(option => (
                                <option key={option.ArtistID} value={option.name_}>{option.name_}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setSelectedYearQ(e.target.value)} value={selectedYearQ}>
                            <option value="">Year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <select onChange={(e) => setSelectedDepartmentQ(e.target.value)} value={selectedDepartmentQ}>
                            <option value="">Department</option>
                            {departments.map(department => (
                                <option key={department.DepartmentID} value={department.Name}>{department.Name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Filters for Artists */}
                {activeTab === 'artist' && (
                    <div className={styles.filterSection}>
                        <select onChange={(e) => setSelectedGenderQ(e.target.value)} value={selectedGenderQ}>
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>

                        <select onChange={(e) => setSelectedNationalityQ(e.target.value)} value={selectedNationalityQ}>
                            <option value="">Nationality</option>
                            {nationalities.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Clearable Filter Tags */}
                <div className={styles.tagContainer}>
                    {selectedMediumQ && <span>{selectedMediumQ} <button onClick={() => setSelectedMediumQ('')}>X</button></span>}
                    {selectedArtistQ && <span>{selectedArtistQ} <button onClick={() => setSelectedArtistQ('')}>X</button></span>}
                    {selectedYearQ && <span>{selectedYearQ} <button onClick={() => setSelectedYearQ('')}>X</button></span>}
                    {selectedDepartmentQ && <span>{selectedDepartmentQ} <button onClick={() => setSelectedDepartmentQ('')}>X</button></span>}
                    {selectedGenderQ && <span>{selectedGenderQ} <button onClick={() => setSelectedGenderQ('')}>X</button></span>}
                    {selectedNationalityQ && <span>{selectedNationalityQ} <button onClick={() => setSelectedNationalityQ('')}>X</button></span>}
                </div>

                {/* Sort by */}
                <h2>Sort By</h2>
                <div className={styles.sortSection}>
                    <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                        {activeTab === 'artwork' && (
                            <>
                                <option value="title_asc">Title A-Z</option>
                                <option value="title_desc">Title Z-A</option>
                                <option value="year_asc">Year Ascending</option>
                                <option value="year_desc">Year Descending</option>
                                <option value="artist_asc">Artist A-Z</option>
                                <option value="artist_desc">Artist Z-A</option>
                            </>
                        )}
                        {activeTab === 'artist' && (
                            <>
                                <option value="artist_asc">Artist A-Z</option>
                                <option value="artist_desc">Artist Z-A</option>
                            </>
                        )}
                    </select>
                </div>
                
            </div>

            {/* Display Artwork or Artist */}
            <div>
                {activeTab === 'artwork' ? (
                    searchArtwork(filteredArtworks).length > 0 ? (
                        <>
                            <ArtworkCard artwork_={filteredArtworks} onCardClick={openArtworkModal} />
                            {isArtworkModalOpen && (
                                <ArtworkModalUser artwork_={selectedArtwork} onClose={closeArtworkModal} onRefresh={triggerRefreshArtworks} />
                            )}
                        </>
                    ) : (
                        <p>No artwork found matching your search.</p>
                    )
                ) : (
                    <>
                        {(role === 'admin' || role === 'staff') && location.pathname !== '/Art' && (
                            <>
                                <h2>Artists Without Artwork</h2>
                                <p>These artists will not be displayed</p>
                                {filteredArtistsWithoutArtwork.length > 0 ? (
                                    searchArtists(filteredArtistsWithoutArtwork).length > 0 ? (
                                        // Display artists that match the search criteria
                                        <>
                                            <ArtistCard artist_={filteredArtistsWithoutArtwork} onCardClick={openArtistModal} />
                                            {isArtistModalOpen && (
                                                <ArtistModalUser artist_={selectedArtist} onClose={closeArtistModal} onRefresh={triggerRefreshArtists} />
                                            )}
                                        </>
                                    ) : (
                                        // If there's an active search but no matches
                                        <p>No artists found matching your search.</p>
                                    )
                                ) : (
                                    // If there’s no active search and no artists without artwork
                                    <p>No artists without Artwork</p>
                                )}
                                <h2>Artists With Artwork</h2>
                            </>
                        )}
                        {searchArtists(filteredArtistsWithArtwork).length > 0 ? (
                            <>
                                <ArtistCard artist_={filteredArtistsWithArtwork} onCardClick={openArtistModal} />
                                {isArtistModalOpen && (
                                    <ArtistModalUser artist_={selectedArtist} onClose={closeArtistModal} onRefresh={triggerRefreshArtists} />
                                )}
                            </>
                        ) : (
                            <p>No artists found matching your search.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

<<<<<<< Updated upstream
export default ArtLookUp;
=======
const DepartmentLookUp = ({ isDepartmentDeletedOpen, refreshDepartments }) => {
    const [departments, setDepartments] = useState([]);
    const [sortOption, setSortOption] = useState('department_asc');
    const [filterType, setFilterType] = useState('all'); // 'all', 'withArtwork', 'withoutArtwork'
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, [isDepartmentDeletedOpen, filterType, refreshDepartments]);

    const fetchDepartments = async () => {
        let endpoint = 'http://localhost:5000/department';
        if (filterType === 'withArtwork') {
            endpoint = 'http://localhost:5000/department-with-artwork';
        } else if (filterType === 'withoutArtwork') {
            endpoint = 'http://localhost:5000/department-null-artwork';
        }

        try {
            const response = await axios.get(`${endpoint}?isDeleted=${isDepartmentDeletedOpen}`);
            const validDepartments = response.data.flat().filter(department => department.DepartmentID);
            setDepartments(validDepartments);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleEditClick = (department) => {
        if (!isDepartmentDeletedOpen) { // Prevent editing if department is in deleted view
            setSelectedDepartment(department);
            setIsEditModalOpen(true);
        }
    };

    const handleDeleteClick = (departmentId) => {
        if (!isDepartmentDeletedOpen) { // Prevent deletion if department is in deleted view
            setSelectedDepartment(departmentId);
            setIsDeleteModalOpen(true);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:5000/department/${selectedDepartment}`);
            fetchDepartments(); // Refresh the department list after deletion
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting department:", error);
        }
    };

    const sortedDepartments = [...departments].sort((a, b) => {
        return sortOption === 'department_asc'
            ? a.Name.localeCompare(b.Name)
            : b.Name.localeCompare(a.Name);
    });

    return (
        <div>
            <div className={styles.FilterContainer}>
                <h1>{isDepartmentDeletedOpen ? 'Deleted Departments' : 'Departments'}</h1>

                {/* Filter by artwork association */}
                <div>
                    <label>Filter Departments:</label>
                    <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
                        <option value="all">All</option>
                        <option value="withArtwork">With Artwork</option>
                        <option value="withoutArtwork">Without Artwork</option>
                    </select>
                </div>

                {/* Sort Departments */}
                <div className={styles.sortSection}>
                    <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                        <option value="department_asc">Department A-Z</option>
                        <option value="department_desc">Department Z-A</option>
                    </select>
                </div>
            </div>

            {/* Display Department Cards */}
            <DepartmentCard
                department_={sortedDepartments}
                onRefresh={fetchDepartments}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                isDepartmentDeletedOpen={isDepartmentDeletedOpen} // Pass the prop here
            />

            {/* Edit Department Modal */}
            {isEditModalOpen && selectedDepartment && (
                <EditDepartmentModal
                    department={selectedDepartment}
                    onClose={() => setIsEditModalOpen(false)}
                    onRefresh={fetchDepartments}
                />
            )}

            {/* Confirm Delete Department Modal */}
            {isDeleteModalOpen && (
                <ConfirmDeleteDepartmentModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};


export {ArtLookUp, DepartmentLookUp};
>>>>>>> Stashed changes
