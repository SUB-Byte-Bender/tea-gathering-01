/**
 * This file contains the JS documentation for data structures used in the application
 */

/**
 * @typedef {Object} Attendee
 * @property {string} id - Unique identifier for the attendee
 * @property {string} fullName - Full name of the attendee
 * @property {string} contactNumber - Contact number of the attendee
 * @property {string} companyName - Company name of the attendee
 * @property {string} currentPosition - Current position/job title of the attendee
 * @property {string} batch - Graduation batch of the attendee
 * @property {string} studentId - Student ID of the attendee
 * @property {string} email - Email address of the attendee
 * @property {string} [profilePicture] - Base64 encoded string of the profile image
 * @property {string} address - Address of the attendee
 * @property {Date} registrationDate - Date when the attendee registered
 */

/**
 * @typedef {Object} RegistrationFormData
 * @property {string} fullName - Full name of the attendee
 * @property {string} contactNumber - Contact number of the attendee
 * @property {string} companyName - Company name of the attendee
 * @property {string} currentPosition - Current position/job title of the attendee
 * @property {string} batch - Graduation batch of the attendee
 * @property {string} studentId - Student ID of the attendee
 * @property {string} email - Email address of the attendee
 * @property {File} [profilePicture] - Profile picture file
 * @property {string} address - Address of the attendee
 */

/**
 * @typedef {Object} ColumnConfig
 * @property {string} field - Field name in the attendee object
 * @property {string} headerName - Display name for the column header
 * @property {number} width - Width of the column
 * @property {boolean} selected - Whether the column is selected for display
 * @property {Function} [valueFormatter] - Function to format the cell value
 * @property {Function} [renderCell] - Function to render custom cell content
 */

// No exports needed for JavaScript - JSDoc is used for documentation only