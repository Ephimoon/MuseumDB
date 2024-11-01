/* src/css/ProfilePage.css */
.profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f4f4f9;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    color: #333;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #4A4A4A;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    background-color: #ffffff; /* White background for editable fields */
}

input:focus {
    border-color: #6200ea;
    outline: none;
}

.read-only-input {
    background-color: #f0f0f0; /* Light gray for read-only field */
    color: #6c757d; /* Muted text color */
    cursor: default; /* No cursor change on hover */
    pointer-events: none; /* Prevent interaction */
    border: 1px solid #d0d0d0; /* Softer border for read-only */
}

.submit-button {
    padding: 12px;
    background-color: #6200ea;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}

.submit-button:hover {
    background-color: #4500a3;
}

.success-message {
    color: green;
    margin-top: 15px;
    text-align: center;
}
