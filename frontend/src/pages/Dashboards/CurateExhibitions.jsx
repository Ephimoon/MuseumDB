import React, { useState, useEffect } from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import styles1 from '../../css/Art.module.css';
import styles2 from '../../css/ArtworkCard.module.css';
import axios from 'axios';

const ExhibitionCard = ({ exhibition_, onRefresh, onEditClick, onDeleteClick, isExhibitionDeletedOpen, exhibitionImages }) => {
    const handleRestoreClick = async (exId) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/exhibition/${exId}/restore`);
            onRefresh();
        } catch (error) {
            console.error('Error restoring exhibition:', error);
        }
    };

    // Helper function to format dates
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={styles2.cards}>
            {exhibition_.map((exhibition) => (
                <div key={exhibition.exhibition_id} className={styles2.ex_card}>
                    <img
                        src={exhibitionImages[exhibition.exhibition_id] || ''}
                        alt={exhibition.name_ || 'Exhibition Image'}
                        className={styles2.image}
                    />
                    <h1>{exhibition.name_}</h1>
                    <p>Start Date: {formatDate(exhibition.start_date)}</p>
                    <p>End Date: {formatDate(exhibition.end_date)}</p>
                    <p>{exhibition.description_}</p>
                    <div className={styles2.outside2}>
                        {!isExhibitionDeletedOpen ? (
                            <>
                                <button onClick={(e) => { e.stopPropagation(); onEditClick(exhibition); }} className={styles2.edit}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteClick(exhibition.exhibition_id); }} className={styles2.delete}>Delete</button>
                            </>
                        ) : (
                            <button onClick={(e) => { e.stopPropagation(); handleRestoreClick(exhibition.exhibition_id); }}>Restore</button>
                        )}
                    </div>

                </div>
            ))}
        </div>
    );
};

const EditExhibitionModal = ({ exhibition, onClose, onRefresh }) => {
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
        const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
        return `${year}-${month}-${day}`;
    };

    const [name, setName] = useState(exhibition.name_ || '');
    const [startDate, setStartDate] = useState(formatDate(exhibition.start_date) || '');
    const [endDate, setEndDate] = useState(formatDate(exhibition.end_date) || '');
    const [description, setDescription] = useState(exhibition.description_ || '');
    const [image, setImage] = useState(null); // New state for image
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false); // Track if fields have changed

    // Function to validate fields
    const validateFields = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Exhibition name is required.";
        if (!description) newErrors.description = "Description is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) return;
        setIsSaving(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('description', description);

        if (image) {
            formData.append('image', image); // Append the new image if selected
        }

        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/exhibition/${exhibition.exhibition_id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error updating exhibition:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to set `isDirty` to true if any field is changed
    const handleFieldChange = (setter, originalValue) => (e) => {
        setter(e.target.value);
        if (e.target.value !== originalValue) {
            setIsDirty(true);
        }
    };

    // Function to handle image file selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setIsDirty(true);
    };

    return (
        <div className={styles2.edit_modal}>
            <div className={styles2.edit_modal_content}>
                <h2>Edit Exhibition</h2>
                <label>Exhibition Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={handleFieldChange(setName, exhibition.name_ || '')}
                />
                {errors.name && <p className={styles2.error_message}>{errors.name}</p>}
                
                <label>Start Date *</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleFieldChange(setStartDate, formatDate(exhibition.start_date) || '')}
                />
                
                <label>End Date *</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleFieldChange(setEndDate, formatDate(exhibition.end_date) || '')}
                />
                
                <label>Description *</label>
                <textarea
                    value={description}
                    onChange={handleFieldChange(setDescription, exhibition.description_ || '')}
                />
                {errors.description && <p className={styles2.error_message}>{errors.description}</p>}
                
                <label>Change Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                
                <div className={styles2.edit_modal_actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave} disabled={isSaving || !isDirty}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>

            </div>
        </div>
    );
};

const ConfirmDeleteExhibitionModal = ({ onConfirm, onCancel }) => {
    return (
        <div className={styles2.modal}>
            <div className={styles2.modal_content}>
                <h2>Are you sure you want to delete this exhibition?</h2>
                <p>This action can be undone. Go to 'View Deleted' to restore.</p>
                <div className={styles2.outside}>
                    <button onClick={onCancel} className={styles2.cancel}>Cancel</button>
                    <button onClick={onConfirm} className={styles2.delete}>Delete</button>
                </div>
            </div>
        </div>
    );
};

const ExLookUp = ({ exhibitions, triggerExhibitionRefresh, isDeletedOpen }) => {
    const [query, setQuery] = useState('');
    const [sortOption, setSortOption] = useState('name_asc');
    const [filteredExhibitions, setFilteredExhibitions] = useState([]);
    const [selectedExhibition, setSelectedExhibition] = useState(null);
    const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [exhibitionToDelete, setExhibitionToDelete] = useState(null);
    const [exhibitionImages, setExhibitionImages] = useState({});
    const [dateFilter, setDateFilter] = useState('ongoing'); // Default to "ongoing"

    useEffect(() => {
        setFilteredExhibitions(searchAndSortExhibitions(exhibitions));
        fetchAllExhibitionImages();
    }, [query, sortOption, exhibitions, dateFilter]);

    const fetchAllExhibitionImages = async () => {
        const images = {};
        await Promise.all(
            exhibitions.map(async (exhibition) => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/exhibition/${exhibition.exhibition_id}/image`, {
                        responseType: 'blob',
                    });
                    const imageUrl = URL.createObjectURL(response.data);
                    images[exhibition.exhibition_id] = imageUrl;
                } catch (error) {
                    console.error(`Error fetching image for exhibition ${exhibition.exhibition_id}:`, error);
                }
            })
        );
        setExhibitionImages(images);
    };

    const isExhibitionOngoing = (endDate) => new Date(endDate) >= new Date();

    const searchAndSortExhibitions = (exhibitions) => {
        return exhibitions
            .filter((ex) => {
                const matchesQuery = ex.name_ ? ex.name_.toLowerCase().includes(query.toLowerCase()) : false;
                const matchesDateFilter = dateFilter === 'all'
                    || (dateFilter === 'ongoing' && isExhibitionOngoing(ex.end_date))
                    || (dateFilter === 'passed' && !isExhibitionOngoing(ex.end_date));
                return matchesQuery && matchesDateFilter;
            })
            .sort((a, b) => {
                if (sortOption === 'name_asc') return (a.name_ || '').localeCompare(b.name_ || '');
                if (sortOption === 'name_desc') return (b.name_ || '').localeCompare(a.name_ || '');
                if (sortOption === 'start_date_asc') return new Date(a.start_date) - new Date(b.start_date);
                if (sortOption === 'start_date_desc') return new Date(b.start_date) - new Date(a.start_date);
                if (sortOption === 'end_date_asc') return new Date(a.end_date) - new Date(b.end_date);
                if (sortOption === 'end_date_desc') return new Date(b.end_date) - new Date(a.end_date);
                return 0;
            });
    };

    const handleEditClick = (exhibition) => {
        setSelectedExhibition(exhibition);
        setIsExhibitionModalOpen(true);
    };

    const openDeleteModal = (exhibitionId) => {
        setExhibitionToDelete(exhibitionId);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/exhibition/${exhibitionToDelete}`);
            triggerExhibitionRefresh();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting exhibition:', error);
        }
    };

    const handleCancelDelete = () => {
        setExhibitionToDelete(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div>
            <div className={styles1.FilterContainer}>
                <h1>{isDeletedOpen ? 'Deleted Exhibitions' : 'Search Exhibitions'}</h1>
                <div className={styles1.sortByContainer}>
                    {/* Filter */}
                    <div className={styles1.sortByContainerExhibition}>
                        <label>Filter</label>
                        <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
                            <option value="all">All</option>
                            <option value="ongoing">Still Ongoing</option>
                            <option value="passed">Passed Date</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className={styles1.sortByContainerExhibition}>
                        <label>Sort By</label>
                        <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                            <option value="name_asc">Name A-Z</option>
                            <option value="name_desc">Name Z-A</option>
                            <option value="start_date_asc">Start Date Ascending</option>
                            <option value="start_date_desc">Start Date Descending</option>
                            <option value="end_date_asc">End Date Ascending</option>
                            <option value="end_date_desc">End Date Descending</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className={styles1.search}>
                        <input
                            type="text"
                            placeholder="Search exhibition by name..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div>
                {/* Display Exhibitions */}
                {filteredExhibitions.length > 0 ? (
                    <ExhibitionCard
                        exhibition_={filteredExhibitions}
                        onRefresh={triggerExhibitionRefresh}
                        onEditClick={handleEditClick}
                        onDeleteClick={(id) => openDeleteModal(id)}
                        isExhibitionDeletedOpen={isDeletedOpen}
                        exhibitionImages={exhibitionImages}
                    />
                ) : (
                    <p>No exhibitions found matching your search.</p>
                )}

                {/* Modals for Editing and Deleting */}
                {isExhibitionModalOpen && (
                    <EditExhibitionModal
                        exhibition={selectedExhibition}
                        onClose={() => setIsExhibitionModalOpen(false)}
                        onRefresh={triggerExhibitionRefresh}
                    />
                )}
                {isDeleteModalOpen && (
                    <ConfirmDeleteExhibitionModal
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                    />
                )}
            </div>
        </div>
    );
};

const InsertExhibitionModal = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [errors, setErrors] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false); // Loading state

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setHasChanges(true);
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setHasChanges(true);
    };

    const handleSave = async () => {
        const newErrors = {};
        if (!name) newErrors.name = "Name is required.";
        if (!startDate) newErrors.startDate = "Start date is required.";
        if (!endDate) newErrors.endDate = "End date is required.";
        if (!description) newErrors.description = "Description is required.";

        setErrors(newErrors);

        // Stop if there are any validation errors
        if (Object.keys(newErrors).length > 0) return;

        setIsSaving(true); // Start loading state

        const formData = new FormData();
        formData.append('name', name);
        formData.append('sdate', startDate); // Use sdate to match the backend
        formData.append('edate', endDate);   // Use edate to match the backend
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await onSave(formData); // Call the onSave function passed as a prop
            onClose(); // Close the modal on success
        } catch (error) {
            console.error("Error saving exhibition:", error);
        } finally {
            setIsSaving(false); // Reset loading state
        }
    };

    return (
        <div className={styles2.edit_modal}>
            <div className={styles2.edit_modal_content}>
                <h2>Insert New Exhibition</h2>

                <label>Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={handleInputChange(setName)}
                    required
                />
                {errors.name && <p className={styles2.error_message}>{errors.name}</p>}

                <label>Start Date *</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={handleInputChange(setStartDate)}
                    required
                />
                {errors.startDate && <p className={styles2.error_message}>{errors.startDate}</p>}

                <label>End Date *</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={handleInputChange(setEndDate)}
                    required
                />
                {errors.endDate && <p className={styles2.error_message}>{errors.endDate}</p>}

                <label>Description *</label>
                <textarea
                    value={description}
                    onChange={handleInputChange(setDescription)}
                    required
                />
                {errors.description && <p className={styles2.error_message}>{errors.description}</p>}

                <label>Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <div className={styles2.edit_modal_actions}>
                    <button onClick={onClose}>Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving} // Disable if no changes or during saving
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CurateExhibitions = () => {
    const [isInsertExhibitionOpen, setIsInsertExhibitionOpen] = useState(false);
    const [exhibitions, setExhibitions] = useState([]);
    const [refreshExhibitions, setRefreshExhibitions] = useState(false);
    const [isDeletedOpen, setIsDeletedOpen] = useState(false);

    useEffect(() => {
        fetchExhibitions();
    }, [refreshExhibitions, isDeletedOpen]);

    const fetchExhibitions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/exhibition?isDeleted=${isDeletedOpen}`);
            console.log("Fetched Exhibitions Data (Raw):", response.data);

            // Flatten the nested arrays in response.data
            const flattenedExhibitions = response.data.flat(); // Flatten the array

            // Filter valid exhibitions after flattening
            const validExhibitions = Array.isArray(flattenedExhibitions)
                ? flattenedExhibitions.filter(exhibition => exhibition.exhibition_id)
                : [];

            console.log("Flattened and Filtered Exhibitions Data:", validExhibitions);
            setExhibitions(validExhibitions);
        } catch (error) {
            console.error('Error fetching exhibitions:', error.response || error.message || error);
        }
    };

    const openInsertExhibitionModal = () => setIsInsertExhibitionOpen(true);
    const closeInsertExhibitionModal = () => setIsInsertExhibitionOpen(false);

    const triggerExhibitionRefresh = () => setRefreshExhibitions(!refreshExhibitions);

    const saveInsertExhibition = (exData) => {
        axios.post(`${process.env.REACT_APP_API_URL}/exhibition`, exData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                triggerExhibitionRefresh();
                closeInsertExhibitionModal();
            })
            .catch(error => console.error('Error adding exhibition:', error));
    };

    return (
        <div className={styles1.ArtContainer}>
            <HomeNavBar />
            <h1 className={styles1.searchTitle}>Curate Exhibitions</h1>
            <div className={styles1.buttonContainer}>
                {!isDeletedOpen && (
                    <button onClick={openInsertExhibitionModal} className={styles1.addButton}>Insert Exhibition</button>
                )}
                <button onClick={() => setIsDeletedOpen(!isDeletedOpen)}>
                    {isDeletedOpen ? 'View Active' : 'View Deleted'}
                </button>
            </div>

            <ExLookUp
                exhibitions={exhibitions}
                triggerExhibitionRefresh={triggerExhibitionRefresh}
                isDeletedOpen={isDeletedOpen}
            />

            {isInsertExhibitionOpen && (
                <InsertExhibitionModal
                    onClose={closeInsertExhibitionModal}
                    onSave={saveInsertExhibition}
                />
            )}
        </div>
    );
};

export default CurateExhibitions;
