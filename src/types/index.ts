// Attendee interface represents a registered person for the Tea Gathering event
export interface Attendee {
  id: string;
  fullName: string;
  contactNumber: string;
  companyName: string;
  currentPosition: string;
  batch: string;
  studentId: string;
  email: string;
  profilePicture?: string; // Base64 encoded string of the image
  address: string;
  registrationDate: Date;
}

// Form data for the registration form
export interface RegistrationFormData {
  fullName: string;
  contactNumber: string;
  companyName: string;
  currentPosition: string;
  batch: string;
  studentId: string;
  email: string;
  profilePicture?: File;
  address: string;
}

// Column configuration for the admin data grid
export interface ColumnConfig {
  field: keyof Attendee;
  headerName: string;
  width: number;
  selected: boolean;
  valueFormatter?: (params: any) => string;
  renderCell?: (params: any) => JSX.Element;
}
