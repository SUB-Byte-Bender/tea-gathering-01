import { createTheme } from "@mui/material/styles";

// Theme colors as specified in the project brief
const colors = {
  light: "#e9e9f0",
  lightHover: "#dedee8",
  lightActive: "#bbbacf",
  normal: "#252265",
  normalHover: "#211f5b",
  normalActive: "#1e1b51",
  dark: "#1c1a4c",
  darkHover: "#16143d",
  darkActive: "#110f2d",
  darker: "#0d0c23",
};

// Create a custom MUI theme using the violet color palette
const theme = createTheme({
  palette: {
    primary: {
      main: colors.normal,
      light: colors.light,
      dark: colors.dark,
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.light,
      light: colors.lightHover,
      dark: colors.lightActive,
      contrastText: colors.normal,
    },
    background: {
      default: "#f9f9fd",
      paper: "#ffffff",
    },
    text: {
      primary: colors.dark,
      secondary: colors.normal,
      disabled: colors.lightActive,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
      color: colors.normal,
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: colors.normal,
    },
    h3: {
      fontWeight: 500,
      fontSize: "1.75rem",
      color: colors.normal,
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
      color: colors.dark,
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      color: colors.dark,
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      color: colors.dark,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          padding: "8px 24px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(37, 34, 101, 0.15)",
          },
        },
        containedPrimary: {
          backgroundColor: colors.normal,
          "&:hover": {
            backgroundColor: colors.normalHover,
          },
          "&:active": {
            backgroundColor: colors.normalActive,
          },
        },
        containedSecondary: {
          backgroundColor: colors.light,
          color: colors.normal,
          "&:hover": {
            backgroundColor: colors.lightHover,
          },
          "&:active": {
            backgroundColor: colors.lightActive,
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 8px 16px rgba(37, 34, 101, 0.08)",
          overflow: "hidden",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.normalHover,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.normal,
            },
          },
        },
      },
    },
  },
});

export { colors };
export default theme;
