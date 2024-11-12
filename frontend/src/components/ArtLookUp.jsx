import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArtworkCard, ArtworkModalUser, ArtistCard, ArtistModalUser } from '../components/ArtworkCard';
import styles from '../css/Art.module.css';
import axios from 'axios';

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
        axios.get(`${process.env.REACT_APP_API_URL}/artwork`)
            .then(response => setArtworks(response.data))
            .catch(err => console.log('Error fetching artwork:', err));
    };

    const fetchArtists = async () => {
        try {
            const responseWithArtwork = await axios.get(`${process.env.REACT_APP_API_URL}/artist-with-artwork`);
            const responseWithoutArtwork = await axios.get(`${process.env.REACT_APP_API_URL}/artist-null-artwork`);
            setArtistsWithArtwork(responseWithArtwork.data);
            setArtistsWithoutArtwork(responseWithoutArtwork.data);
        } catch (err) {
            console.log('Error fetching artists:', err);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const departmentRes = await axios.get(`${process.env.REACT_APP_API_URL}/department`);
            const mediumsRes = await axios.get(`${process.env.REACT_APP_API_URL}/mediums`);
            const yearsRes = await axios.get(`${process.env.REACT_APP_API_URL}/creation-years`);
            //const conditionsRes = await axios.get(`${process.env.REACT_APP_API_URL}/artworkconditions`);
            const nationalitiesRes = await axios.get(`${process.env.REACT_APP_API_URL}/nationalities`);

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

export default ArtLookUp;
