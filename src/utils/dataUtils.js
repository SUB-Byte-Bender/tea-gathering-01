import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

// Local Storage Key
const ATTENDEES_STORAGE_KEY = "tea-gathering-attendees";

/**
 * Save attendees to local storage
 * @param {Array} attendees - Array of attendee objects
 */
export const saveAttendees = (attendees) => {
  localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(attendees));
};

/**
 * Get attendees from local storage
 * @returns {Array} Array of attendee objects
 */
export const getAttendees = () => {
  const data = localStorage.getItem(ATTENDEES_STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data).map((attendee) => ({
      ...attendee,
      registrationDate: new Date(attendee.registrationDate),
    }));
  } catch (error) {
    console.error("Error parsing attendees data:", error);
    return [];
  }
};

/**
 * Add a new attendee
 * @param {Object} formData - Registration form data
 * @returns {Promise<Object>} The newly created attendee object
 */
export const addAttendee = async (formData) => {
  const attendees = getAttendees();

  // Convert the profile picture to base64 if available
  let profilePictureBase64 = "";
  if (formData.profilePicture) {
    profilePictureBase64 = await convertFileToBase64(formData.profilePicture);
  }

  const newAttendee = {
    id: uuidv4(),
    ...formData,
    profilePicture: profilePictureBase64,
    registrationDate: new Date(),
  };

  attendees.push(newAttendee);
  saveAttendees(attendees);

  return newAttendee;
};

/**
 * Convert File to base64 string
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 encoded file content
 */
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Export attendees data to Excel
 * @param {Array} attendees - Array of attendee objects
 * @param {Array<string>} selectedFields - Array of field names to include in export
 */
export const exportToExcel = (
  attendees,
  selectedFields
) => {
  // Filter attendees to only include selected fields
  const filteredData = attendees.map((attendee) => {
    const filteredAttendee = {};
    selectedFields.forEach((field) => {
      if (field === "registrationDate") {
        // Format the date for better readability
        filteredAttendee[field] = new Date(
          attendee[field]
        ).toLocaleDateString();
      } else {
        filteredAttendee[field] = attendee[field];
      }
    });
    return filteredAttendee;
  });

  // Create workbook and add the data
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendees");

  // Generate file name with current date
  const date = new Date().toISOString().split("T")[0];
  const fileName = `tea-gathering-attendees-${date}.xlsx`;

  // Save file
  XLSX.writeFile(workbook, fileName);
};