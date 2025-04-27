import { Attendee } from "../types";

// Function to generate PDF ticket content
export const generatePdfTicket = (
  attendee: Attendee,
  qrCodeUrl: string,
  targetRef: React.RefObject<HTMLDivElement>
) => {
  // Ticket is generated using react-to-pdf with the targetRef
  // The actual HTML rendering is done in the Confirmation component
  return {
    attendee,
    qrCodeUrl,
    targetRef,
  };
};

// Format date for display
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Generate a unique ticket number
export const generateTicketNumber = (attendeeId: string): string => {
  const prefix = "TG-2025";
  const shortId = attendeeId.substring(0, 8).toUpperCase();
  return `${prefix}-${shortId}`;
};
