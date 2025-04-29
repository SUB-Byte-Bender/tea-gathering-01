import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
  Fab,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import theme, { colors } from "./styles/theme";
import LandingPage from "./components/landing/LandingPage";
import ConfirmationPage from "./components/confirmation/ConfirmationPage";
import AdminPage from "./components/admin/AdminPage";
import CustomCursor from "./components/ui/CustomCursor";

// Wrapper component to access location
const AppContent = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for AppBar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Check if navbar is scrolled out of view
      if (navbarRef.current) {
        const navbarBottom = navbarRef.current.getBoundingClientRect().bottom;
        setShowScrollTop(navbarBottom <= 0);
      } else {
        // Fallback if ref is not available
        setShowScrollTop(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Close drawer when navigating
  const handleNavigation = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  // Scroll to registration form
  const scrollToForm = () => {
    if (location.pathname !== "/") {
      // If not on home page, navigate to home and then scroll after a delay
      window.location.href = "/";
      setTimeout(() => {
        const formElement = document.querySelector("#registration-form");
        formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    } else {
      // If already on home page, just scroll
      const formElement = document.querySelector("#registration-form");
      formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (mobileOpen) setMobileOpen(false);
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Menu items
  const menuItems = [
    { label: "Home", path: "/", icon: <HomeIcon /> },
    { label: "Admin", path: "/admin", icon: <AdminPanelSettingsIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header with navigation - Updated to be transparent and positioned inside hero */}
      <AppBar
        position="absolute"
        ref={navbarRef}
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          transition: "all 0.3s ease",
          zIndex: 1100,
          top: 0,
          width: "100%",
        }}
        elevation={0}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              px: { xs: 1, sm: 2 },
              py: 1.5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* Logo area - Updated to show SVG logos */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.15)",
                  px: 2.5,
                  py: 1,
                  borderRadius: 1.5,
                  mr: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <Box 
                  component="img"
                  src="/Images/SUB.svg"
                  alt="SUB Logo" 
                  sx={{
                    height: isMobile ? "34px" : "40px",
                    
                    width: "auto",
                    mr: 1.5,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
                <Box 
                  component="img"
                  src="/Images/CSE_White.svg"
                  alt="CSE Logo" 
                  sx={{
                    height: isMobile ? "34px" : "42px",
                    paddingTop: isMobile ? "2px" : "4px",
                    color: "white",
                    width: "auto",
                    
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Desktop navigation */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    href={item.path}
                    sx={{
                      mx: 0.5,
                      px: 2,
                      py: 1,
                      color: "white",
                      fontWeight: 500,
                      borderRadius: 1,
                      textTransform: "none",
                      fontSize: "1rem",
                      letterSpacing: 0.5,
                      transition: "all 0.2s ease",
                      backgroundColor:
                        location.pathname === item.path
                          ? "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.25)",
                      },
                    }}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Call to action button */}
                <Button
                  variant="contained"
                  onClick={scrollToForm}
                  sx={{
                    ml: 2,
                    px: 2.5,
                    py: 1,
                    backgroundColor: "white",
                    color: colors.normal,
                    fontWeight: 600,
                    borderRadius: 1,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Register Now
                </Button>
              </Box>
            )}

            {/* Mobile menu button */}
            {isMobile && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  onClick={scrollToForm}
                  size="small"
                  sx={{
                    mr: 1.5,
                    backgroundColor: "white",
                    color: colors.normal,
                    fontWeight: 600,
                    borderRadius: 1,
                    textTransform: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                  }}
                >
                  Register
                </Button>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                    borderRadius: 1,
                    p: 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile navigation drawer - Updated design */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          anchor="right" // Changed to slide from right
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
              backgroundColor: colors.normal,
              color: "white",
              borderRadius: "16px 0 0 16px",
            },
          }}
        >
          {/* Updated mobile drawer content */}
          <Box
            onClick={handleDrawerToggle}
            sx={{ textAlign: "center", height: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 3,
                backgroundColor: "white",
              }}
            >
              <Box 
                component="img"
                src="/Images/SUB.svg"
                alt="SUB Logo"
                sx={{
                  height: "32px",
                  width: "auto",
                }}
              />
              <Box 
                component="img"
                src="/Images/CSE.svg"
                alt="CSE Logo"
                sx={{
                  height: "32px",
                  width: "auto",
                  mr: 2,
                }}
              />
            </Box>

            <List sx={{ p: 2 }}>
              {menuItems.map((item) => (
                <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component="a"
                    href={item.path}
                    onClick={handleNavigation}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      backgroundColor:
                        location.pathname === item.path
                          ? "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ mr: 2 }}>{item.icon}</Box>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Box
              sx={{
                mt: "auto",
                p: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={scrollToForm}
                sx={{
                  py: 1.5,
                  backgroundColor: "white",
                  color: colors.normal,
                  fontWeight: 600,
                  borderRadius: 1,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: colors.light,
                  },
                }}
              >
                Register Now
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Box>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Routes>
              <Route path="/" element={<LandingPage formRef={formRef} />} />
              <Route path="/confirmation/:id" element={<ConfirmationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Fade>
      </Box>

      {/* Scroll to Top Button */}
      <Zoom in={showScrollTop}>
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            boxShadow: "0 4px 12px rgba(37, 34, 101, 0.25)",
            backgroundColor: colors.normal,
            "&:hover": {
              backgroundColor: colors.normalHover,
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>

      {/* Enhanced Footer */}
      <Box
        component="footer"
        sx={{
          py: 6, // Increased vertical padding
          mt: "auto",
          backgroundColor: "#f8f8fc", // Slightly colored background that works with violet theme
          borderTop: "1px solid",
          borderColor: `${colors.light}`,
          boxShadow: "0 -4px 20px rgba(13, 12, 35, 0.05)", // Subtle shadow for depth
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4, // Added gap for better spacing
            }}
          >
            {/* Logo and Description */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                mb: { xs: 3, md: 0 },
                maxWidth: { xs: "100%", md: "40%" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                {/* Replaced icon with SVG logos in footer */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 1.5,
                  }}
                >
                  <Box 
                    component="img"
                    src="/Images/SUB.svg"
                    alt="SUB Logo" 
                    sx={{
                      height: "50px",
                      width: "auto",
                      // I want to change the svg color to #252265
                      filter: "invert(0.5) sepia(1) saturate(0) hue-rotate(180deg)",
                    }}
                  />
                  <Box 
                    component="img"
                    src="/Images/CSE.svg"
                    alt="CSE Logo" 
                    sx={{
                      height: "60px",
                      marginLeft: "16px",
                      paddingTop: "8px",
                      width: "auto",
                      mr: 1.5,
                    }}
                  />
                </Box>
                {/* <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 700, fontSize: "1.3rem" }}
                >
                  Tea Gathering
                </Typography> */}
              </Box>
              <Typography
                variant="body1" // Changed from body2 for better readability
                color="text.secondary"
                align={isMobile ? "center" : "left"}
                sx={{ maxWidth: "90%" }} // Added max-width for better text wrapping
              >
                Join us for a delightful evening of networking and refreshments
                at Stamford University Bangladesh's Alumni CSE Tea Gathering event.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                mb: { xs: 3, md: 0 },
              }}
            >
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ mb: 2.5, fontWeight: 700, fontSize: "1.1rem" }} // Enhanced heading
              >
                Quick Links
              </Typography>

              <Button
                href="/"
                sx={{
                  color: colors.normal, // Changed to primary color for better visibility
                  mb: 1.5, // Increased spacing between buttons
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: `${colors.light}50`,
                  },
                }}
                startIcon={<HomeIcon fontSize="small" />}
              >
                Home
              </Button>

              <Button
                href="/admin"
                sx={{
                  color: colors.normal, // Changed to primary color for better visibility
                  mb: 1.5, // Increased spacing
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: `${colors.light}50`,
                  },
                }}
                startIcon={<AdminPanelSettingsIcon fontSize="small" />}
              >
                Admin
              </Button>
            </Box>

            {/* Contact Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                minWidth: { xs: "auto", md: "200px" }, // Added min-width for better alignment
              }}
            >
              <Typography
                variant="subtitle1"
                color="primary"
                sx={{ mb: 2.5, fontWeight: 700, fontSize: "1.1rem" }} // Enhanced heading
              >
                Contact
              </Typography>

              {/* Updated to make the URL clickable */}
              <Button
                href="https://cse.stamforduniversity.edu.bd/"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={
                  <LanguageIcon
                    sx={{
                      color: colors.normal,
                    }}
                  />
                }
                sx={{
                  mb: 2,
                  color: colors.normalHover,
                  textTransform: "none",
                  fontWeight: 400,
                  fontSize: "1rem",
                  justifyContent: isMobile ? "center" : "flex-start",
                  padding: 0,
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                cse.stamforduniversity.edu.bd
              </Button>

              <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                <IconButton
                  size="medium"
                  sx={{
                    color: colors.normal,
                    backgroundColor: `${colors.light}60`, // Added background
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  size="medium"
                  sx={{
                    color: colors.normal,
                    backgroundColor: `${colors.light}60`, // Added background
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  size="medium"
                  sx={{
                    color: colors.normal,
                    backgroundColor: `${colors.light}60`, // Added background
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  size="medium"
                  sx={{
                    color: colors.normal,
                    backgroundColor: `${colors.light}60`, // Added background
                    "&:hover": {
                      backgroundColor: colors.light,
                    },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: `${colors.lightActive}` }} />{" "}
          {/* Enhanced divider */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              © {new Date().getFullYear()} CSE Tea Gathering | Stamford University
              Bangladesh
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1.5, display: "block", fontSize: "0.8rem" }} // Increased margin and font size
            >
              Designed with 💜 by the Stamford University Dev Team
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <CustomCursor />
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
