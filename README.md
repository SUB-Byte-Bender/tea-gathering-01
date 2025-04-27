# Tea Gathering Registration Website

A professional and elegant registration website for the Tea Gathering event at Stamford University Bangladesh.

## Features

- **Landing Page**:

  - Event details display (Title, Date, Venue)
  - Registration form with all required fields
  - Responsive design with violet-based theme

- **Registration Form**:

  - Full Name
  - Contact Number
  - Present Company Name
  - Current Position
  - Batch
  - Student ID
  - Email Address
  - Profile Picture Upload
  - Address

- **Confirmation Page**:

  - Registration confirmation message
  - QR code embedded into ticket layout
  - Downloadable PDF ticket
  - Information about entry requirements

- **Admin/Management Page**:
  - View all registered attendee data
  - Toggle column visibility
  - Export selected data columns to Excel

## Design

The website follows a professional violet-themed design with these color codes:

- Light: #e9e9f0
- Light Hover: #dedee8
- Light Active: #bbbacf
- Normal (Primary Color): #252265
- Normal Hover: #211f5b
- Normal Active: #1e1b51
- Dark: #1c1a4c
- Dark Hover: #16143d
- Dark Active: #110f2d
- Darker: #0d0c23

## Technologies Used

- React with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- React Hook Form for form validation
- QR Code generation
- PDF generation with jsPDF and html-to-image
- Excel export functionality
- Local storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:

```
git clone [repository-url]
```

2. Navigate to the project directory:

```
cd tea-gathering-website
```

3. Install dependencies:

```
npm install
```

4. Start the development server:

```
npm start
```

5. Open your browser and visit:

```
http://localhost:3000
```

## Usage

### Registration Process

1. Fill out the registration form on the landing page
2. Submit the form to register for the event
3. Receive a confirmation with a downloadable ticket containing a QR code
4. Download and save the ticket for entry to the event

### Admin Access

1. Navigate to `/admin` route
2. View all registered attendees in a table format
3. Select which columns to display
4. Export the selected columns to an Excel file

## Production Build

To create a production build:

```
npm run build
```

The build files will be located in the `build` folder.

## Responsive Design

The website is fully responsive and optimized for:

- Desktop devices
- Tablets
- Mobile phones

## License

This project is licensed under the MIT License.
