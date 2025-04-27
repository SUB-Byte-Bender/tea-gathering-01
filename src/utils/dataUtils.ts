import { Attendee, RegistrationFormData } from "../types";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";

// Local Storage Key
const ATTENDEES_STORAGE_KEY = "tea-gathering-attendees";

// Save attendees to local storage
export const saveAttendees = (attendees: Attendee[]): void => {
  localStorage.setItem(ATTENDEES_STORAGE_KEY, JSON.stringify(attendees));
};

// Get attendees from local storage
export const getAttendees = (): Attendee[] => {
  const data = localStorage.getItem(ATTENDEES_STORAGE_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data).map((attendee: any) => ({
      ...attendee,
      registrationDate: new Date(attendee.registrationDate),
    }));
  } catch (error) {
    console.error("Error parsing attendees data:", error);
    return [];
  }
};

// Add a new attendee
export const addAttendee = async (
  formData: RegistrationFormData
): Promise<Attendee> => {
  const attendees = getAttendees();

  // Convert the profile picture to base64 if available
  let profilePictureBase64 = "";
  if (formData.profilePicture) {
    profilePictureBase64 = await convertFileToBase64(formData.profilePicture);
  }

  const newAttendee: Attendee = {
    id: uuidv4(),
    ...formData,
    profilePicture: profilePictureBase64,
    registrationDate: new Date(),
  };

  attendees.push(newAttendee);
  saveAttendees(attendees);

  return newAttendee;
};

// Convert File to base64 string
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Export attendees data to Excel
export const exportToExcel = (
  attendees: Attendee[],
  selectedFields: string[]
): void => {
  // Filter attendees to only include selected fields
  const filteredData = attendees.map((attendee) => {
    const filteredAttendee: any = {};
    selectedFields.forEach((field) => {
      if (field === "registrationDate") {
        // Format the date for better readability
        filteredAttendee[field] = new Date(
          attendee[field as keyof Attendee] as unknown as string
        ).toLocaleDateString();
      } else {
        filteredAttendee[field] = attendee[field as keyof Attendee];
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
