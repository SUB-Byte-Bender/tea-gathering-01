/**
 * Function to generate PDF ticket content
 * @param {Object} attendee - Attendee data
 * @param {string} qrCodeUrl - URL for QR code
 * @param {Object} targetRef - React ref to the element to convert to PDF
 * @returns {Object} PDF ticket data
 */
export const generatePdfTicket = (
  attendee,
  qrCodeUrl,
  targetRef
) => {
  // Ticket is generated using react-to-pdf with the targetRef
  // The actual HTML rendering is done in the Confirmation component
  return {
    attendee,
    qrCodeUrl,
    targetRef,
  };
};

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generate a unique ticket number
 * @param {string} attendeeId - Attendee ID
 * @returns {string} Ticket number
 */
export const generateTicketNumber = (attendeeId) => {
  const prefix = "TG-2025";
  const shortId = attendeeId.substring(0, 8).toUpperCase();
  return `${prefix}-${shortId}`;
};