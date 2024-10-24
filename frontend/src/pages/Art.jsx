import React, { useState } from 'react';
import HomeNavBar from '../components/HomeNavBar';
import ArtworkCard from '../components/ArtworkCard';
import ArtistCard from '../components/ArtistCard';
import ArtImage from '../assets/art.png';
import styles from '../css/Art.module.css';

const Art = () => {
    const artist = [
        { id: 1, image: "https://placehold.jp/500x400.png", name: 'Vincent van Gogh', gender_: 'male', nationality: 'Dutch', birth_year: '1853', death_year: '1890' },
        { id: 2, image: "https://placehold.jp/500x400.png", name: 'Leonardo da Vinci', gender_: 'male', nationality: 'Italian', birth_year: '1452', death_year: '1519' },
        { id: 3, image: "https://placehold.jp/500x400.png", name: 'Johannes Vermeer', gender_: 'male', nationality: 'Dutch', birth_year: '1632', death_year: '1675' },
        { id: 4, image: "https://placehold.jp/500x400.png", name: 'Grant Wood', gender_: 'male', nationality: 'American', birth_year: '1891', death_year: '1942' },
        { id: 5, image: "https://placehold.jp/500x400.png", name: 'Edward Hopper', gender_: 'male', nationality: 'American', birth_year: '1882', death_year: '1967' }
    ];

    const department = [
        { id: 1, name_of_department: 'European Art', location: 'wing 1' },
        { id: 2, name_of_department: 'American Art', location: 'wing 2' }
    ];

    const artwork = [
        {
            id: 1,
            image: "https://placehold.jp/500x400.png",
            title: 'Starry Night',
            artist_id: 1,
            department_id: 1,
            description_text: 'It depicts the view from the east-facing window of his asylum room...',
            creation_year: '1889',
            price: '$100,000,000 USD',
            medium_: 'oil on canvas',
            location: 'Museum of Modern Art',
            condition: 'Mint',
        },
        {
            id: 2,
            image: "https://placehold.jp/600x500.png",
            title: 'Mona Lisa',
            artist_id: 2,
            department_id: 1,
            description_text: "it has been described as 'the best known, the most visited...",
            creation_year: '1500',
            price: '$1,010,000,000 USD',
            medium_: 'oil on poplar panel',
            location: 'Louvre Museum',
            condition: 'Good',
        },
        {
            id: 3,
            image: "https://placehold.jp/500x600.png",
            title: 'Girl with a Pearl Earring',
            artist_id: 3,
            department_id: 1,
            creation_year: '1665',
            price: '$55,000,000 USD',
            medium_: 'oil on canvas',
            location: 'Mauritshuis, The Hague',
            condition: 'Good',
        },
        {
            id: 4,
            image: "https://placehold.jp/500x500.png",
            title: 'American Gothic',
            artist_id: 4,
            department_id: 2,
            creation_year: '1930',
            price: '$80,000,000 USD',
            medium_: 'oil on beaverboard',
            location: 'Art Institute of Chicago',
            condition: 'Good',
        },
        {
            id: 5,
            image: "https://placehold.jp/500x500.png",
            title: 'Nighthawks',
            artist_id: 5,
            department_id: 2,
            creation_year: '1942',
            price: '$140,000,000 USD',
            medium_: 'oil on canvas',
            location: 'Art Institute of Chicago',
            condition: 'Excellent',
        },
    ];

    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('artwork');
    const [selectedMedium, setSelectedMedium] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('');
    const [sortOption, setSortOption] = useState('A-Z');

    // Get unique values for filter dropdowns
    const getUniqueValues = (data, key) => [...new Set(data.map(item => item[key]))];

    // Get unique values for filter dropdowns for Artwork
    const mediumOptions = getUniqueValues(artwork, 'medium_');
    const artistOptions = artist.map(a => a.name);
    const yearOptions = getUniqueValues(artwork, 'creation_year');
    const departmentOptions = getUniqueValues(department, 'name_of_department');
    // Get unique values for filter dropdowns for Artists
    const genderOptions = getUniqueValues(artist, 'gender_');
    const nationalityOptions = getUniqueValues(artist, 'nationality');

    // Helper function to get artist name by id
    const getArtistName = (id) => {
        const artistObj = artist.find(a => a.id === id);
        return artistObj ? artistObj.name : 'Unknown Artist';
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedMedium('');
        setSelectedArtist('');
        setSelectedYear('');
        setSelectedDepartment('');
        setSelectedGender('');
        setSelectedNationality('');
        setQuery('');
        setSortOption('A-Z');
    };

    // Handle tab switch
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
            const artistName = getArtistName(artwork.artist_id).toLowerCase();
            return (
                (artwork.title.toLowerCase().includes(query) || artistName.includes(query)) &&
                (!selectedMedium || artwork.medium_ === selectedMedium) &&
                (!selectedArtist || artistName === selectedArtist.toLowerCase()) &&
                (!selectedYear || artwork.creation_year === selectedYear) &&
                (!selectedDepartment || department.find(d => d.id === artwork.department_id)?.name_of_department === selectedDepartment)
            );
        }).sort((a, b) => {
            // Sorting logic based on sortOption for artwork
            switch (sortOption) {
                case 'title_asc':
                    return a.title.localeCompare(b.title);
                case 'title_desc':
                    return b.title.localeCompare(a.title);
                case 'year_asc':
                    return a.creation_year - b.creation_year;
                case 'year_desc':
                    return b.creation_year - a.creation_year;
                case 'artist_asc':
                    return getArtistName(a.artist_id).localeCompare(getArtistName(b.artist_id));
                case 'artist_desc':
                    return getArtistName(b.artist_id).localeCompare(getArtistName(a.artist_id));
                default:
                    return 0;
            }
        });
    };
    

    // Search and filter artists
    const searchArtists = (artists) => {
        return artists.filter((artist) => {
            return (
                artist.name.toLowerCase().includes(query) &&
                (!selectedGender || artist.gender_ === selectedGender) &&
                (!selectedNationality || artist.nationality === selectedNationality)
            );
        }).sort((a, b) => {
            // Sorting logic based on sortOption for artists
            if (sortOption === 'artist_asc') {
                return a.name.localeCompare(b.name);
            } else if (sortOption === 'artist_desc') {
                return b.name.localeCompare(a.name);
            }
            return 0;
        });
    };
    

    return (
        <div>
            <div className={styles.ArtContainer}>
                <HomeNavBar />
                <div className={styles.ImageContainer}>
                    <img src={ArtImage} alt="Art Image" className={styles.HalfBackgroundImage} />
                    <div className={styles.overlay}>
                        <h1 className={styles.title}>Artwork</h1>
                    </div>
                </div>

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
                            <select onChange={(e) => setSelectedMedium(e.target.value)} value={selectedMedium}>
                                <option value="">Medium</option>
                                {mediumOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <select onChange={(e) => setSelectedArtist(e.target.value)} value={selectedArtist}>
                                <option value="">Artist</option>
                                {artistOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                                <option value="">Year</option>
                                {yearOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>

                            <select onChange={(e) => setSelectedDepartment(e.target.value)} value={selectedDepartment}>
                                <option value="">Department</option>
                                {departmentOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Filters for Artists */}
                    {activeTab === 'artist' && (
                        <div className={styles.filterSection}>
                            <select onChange={(e) => setSelectedGender(e.target.value)} value={selectedGender}>
                                <option value="">Gender</option>
                                {genderOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <select onChange={(e) => setSelectedNationality(e.target.value)} value={selectedNationality}>
                                <option value="">Nationality</option>
                                {nationalityOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Clearable Filter Tags */}
                    <div className={styles.tagContainer}>
                        {selectedMedium && <span>{selectedMedium} <button onClick={() => setSelectedMedium('')}>X</button></span>}
                        {selectedArtist && <span>{selectedArtist} <button onClick={() => setSelectedArtist('')}>X</button></span>}
                        {selectedYear && <span>{selectedYear} <button onClick={() => setSelectedYear('')}>X</button></span>}
                        {selectedDepartment && <span>{selectedDepartment} <button onClick={() => setSelectedDepartment('')}>X</button></span>}
                        {selectedGender && <span>{selectedGender} <button onClick={() => setSelectedGender('')}>X</button></span>}
                        {selectedNationality && <span>{selectedNationality} <button onClick={() => setSelectedNationality('')}>X</button></span>}
                    </div>

                    {/* Sort by */}

                    <h2>Sort By</h2>
                    <div className={styles.sortSection}>
                        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                            {/* Artwork sorting options */}
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
                            {/* Artist sorting options */}
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
                        searchArtwork(artwork).length > 0 ? (
                            <ArtworkCard artwork_={searchArtwork(artwork)} getArtistName_={getArtistName} />
                        ) : (
                            <p>No artwork found matching your query.</p>
                        )
                    ) : (
                        searchArtists(artist).length > 0 ? (
                            <ArtistCard artist_={searchArtists(artist)} />
                        ) : (
                            <p>No artists found matching your query.</p>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};

export default Art;
