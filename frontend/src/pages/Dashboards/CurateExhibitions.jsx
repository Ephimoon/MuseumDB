<<<<<<< Updated upstream
import React from 'react'
import DashboardNavBar from '../../components/DashboardNavBar'

const CurateExhibitions = () => {
=======
import React, { useState, useEffect } from 'react';
import HomeNavBar from '../../components/HomeNavBar';
import styles1 from '../../css/Art.module.css';
import styles2 from '../../css/ArtworkCard.module.css';
import axios from 'axios';

const ExhibitionCard = ({ exhibition_, onRefresh, onEditClick, onDeleteClick, isExhibitionDeletedOpen, exhibitionImages }) => {
    const handleRestoreClick = async (exId) => {
        try {
            await axios.patch(`http://localhost:5000/exhibition/${exId}/restore`);
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
                <div key={exhibition.exhibition_id} className={styles2.card}>
                    <img
                        src={exhibitionImages[exhibition.exhibition_id] || ''}
                        alt={exhibition.name_ || 'Exhibition Image'}
                        className={styles2.image}
                    />
                    <h1>{exhibition.name_}</h1>
                    <p>Start Date: {formatDate(exhibition.start_date)}</p>
                    <p>End Date: {formatDate(exhibition.end_date)}</p>
                    <p>Description: {exhibition.description_}</p>
                    {!isExhibitionDeletedOpen ? (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); onEditClick(exhibition); }}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteClick(exhibition.exhibition_id); }}>Delete</button>
                        </>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleRestoreClick(exhibition.exhibition_id); }}>Restore</button>
                    )}
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
            await axios.patch(`http://localhost:5000/exhibition/${exhibition.exhibition_id}`, formData, {
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
        <div className={styles2.modal}>
            <div className={styles2.modal_content}>
                <h2>Edit Exhibition</h2>
                <label>Exhibition Name *
                    <input
                        type="text"
                        value={name}
                        onChange={handleFieldChange(setName, exhibition.name_ || '')}
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </label>
                <label>Start Date *
                    <input
                        type="date"
                        value={startDate}
                        onChange={handleFieldChange(setStartDate, formatDate(exhibition.start_date) || '')}
                    />
                </label>
                <label>End Date *
                    <input
                        type="date"
                        value={endDate}
                        onChange={handleFieldChange(setEndDate, formatDate(exhibition.end_date) || '')}
                    />
                </label>
                <label>Description *
                    <textarea
                        value={description}
                        onChange={handleFieldChange(setDescription, exhibition.description_ || '')}
                    />
                    {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                </label>
                <label>Change Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSave} disabled={isSaving || !isDirty}>
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
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
                <div className={styles2.buttonContainer}>
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm} style={{ color: "red" }}>Delete</button>
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
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        setFilteredExhibitions(searchAndSortExhibitions(exhibitions));
        fetchAllExhibitionImages();
    }, [query, sortOption, exhibitions, dateFilter]);

    const fetchAllExhibitionImages = async () => {
        const images = {};
        await Promise.all(
            exhibitions.map(async (exhibition) => {
                try {
                    const response = await axios.get(`http://localhost:5000/exhibition/${exhibition.exhibition_id}/image`, {
                        responseType: 'blob', // Use 'blob' to handle binary data
                    });
                    const imageUrl = URL.createObjectURL(response.data); // Create a URL for the binary data
                    images[exhibition.exhibition_id] = imageUrl; // Assign the URL to the specific exhibition ID
                    console.log(`Fetched image for exhibition ${exhibition.exhibition_id}`);
                } catch (error) {
                    console.error(`Error fetching image for exhibition ${exhibition.exhibition_id}:`, error);
                }
            })
        );
        setExhibitionImages(images); // Update the state with all fetched images
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
            await axios.delete(`http://localhost:5000/exhibition/${exhibitionToDelete}`);
            triggerExhibitionRefresh();
            setIsDeleteModalOpen(false); // Close modal after deletion
        } catch (error) {
            console.error('Error deleting exhibition:', error);
        }
    };

    const handleCancelDelete = () => {
        setExhibitionToDelete(null);
        setIsDeleteModalOpen(false);
    };

    return (
        <div className={styles1.FilterContainer}>
            <h1>{isDeletedOpen ? 'Deleted Exhibitions' : 'Search Exhibitions'}</h1>

            {/* Search */}
            <div className={styles1.search}>
                <input
                    type="text"
                    placeholder="Search exhibition by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Date Filter */}
            <div className={styles1.filterSection}>
                <label>Filter By Date:</label>
                <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
                    <option value="all">All</option>
                    <option value="ongoing">Still Ongoing</option>
                    <option value="passed">Passed Date</option>
                </select>
            </div>

            {/* Sort By */}
            <h2>Sort By</h2>
            <div className={styles1.sortSection}>
                <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                </select>
            </div>

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
    );
};

const InsertExhibitionModal = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => setImage(e.target.files[0]);

    const handleSave = () => {
        const newErrors = {};
        if (!name) newErrors.name = "Name is required.";
        if (!startDate) newErrors.startDate = "Start date is required.";
        if (!endDate) newErrors.endDate = "End date is required.";
        if (!description) newErrors.description = "Description is required.";

        setErrors(newErrors);

        // Stop if there are any validation errors
        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('sdate', startDate); // Use sdate to match the backend
        formData.append('edate', endDate);   // Use edate to match the backend
        formData.append('description', description);
        if (image) formData.append('image', image);

        onSave(formData);
        onClose();
    };

    return (
        <div className={styles1.modalOverlay}>
            <div className={styles1.modalContent}>
                <h2>Insert New Exhibition</h2>

                <label>
                    Name *
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                </label>

                <label>
                    Start Date *
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    {errors.startDate && <p style={{ color: 'red' }}>{errors.startDate}</p>}
                </label>

                <label>
                    End Date *
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    {errors.endDate && <p style={{ color: 'red' }}>{errors.endDate}</p>}
                </label>

                <label>
                    Description *
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
                </label>

                <label>
                    Image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>

                <div /*className={styles.buttonContainer}*/>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleSave}>Save</button>
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
            const response = await axios.get(`http://localhost:5000/exhibition?isDeleted=${isDeletedOpen}`);
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
        axios.post(`http://localhost:5000/exhibition`, exData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(() => {
                triggerExhibitionRefresh();
                closeInsertExhibitionModal();
            })
            .catch(error => console.error('Error adding exhibition:', error));
    };

>>>>>>> Stashed changes
    return (
        <div>
            <DashboardNavBar />
        </div>
    )
}

export default CurateExhibitions
