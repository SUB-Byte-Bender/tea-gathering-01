import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  styled,
  useMediaQuery,
  useTheme,
  Divider,
  Fab,
  Zoom,
} from "@mui/material";
import { colors } from "../../styles/theme";
import RegistrationForm from "../registration/RegistrationForm";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Styled components for the landing page with improved animations and styling
const HeroSection = styled(Box)(({ theme }) => ({  // Hero Section Of Landing Page
  backgroundColor: colors.normal,
  color: "white",
  padding: theme.spacing(14, 0, 12),
  borderRadius: "0",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${colors.normal} 0%, ${colors.normalHover} 100%)`,
    zIndex: 0,
  },
}));

const HeroContentWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  maxWidth: "900px",
  margin: "0 auto",
  padding: theme.spacing(0, 2),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const CircleDecoration = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.1)",
  filter: "blur(1px)",
  "&.circle1": {
    width: 120,
    height: 120,
    top: -60,
    right: "20%",
  },
  "&.circle2": {
    width: 80,
    height: 80,
    bottom: 40,
    left: "10%",
  },
  "&.circle3": {
    width: 150,
    height: 150,
    top: "40%",
    right: "5%",
  },
  zIndex: 0,
}));

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  animation: "fadeInDown 1.2s ease-out",
  "@keyframes fadeInDown": {
    "0%": {
      opacity: 0,
      transform: "translateY(-30px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const AnimatedSubtitle = styled(Typography)(({ theme }) => ({
  animation: "fadeInUp 1.2s ease-out 0.3s forwards",
  opacity: 0,
  "@keyframes fadeInUp": {
    "0%": {
      opacity: 0,
      transform: "translateY(20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const TeaCupShape = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.05)",
  border: "2px solid rgba(255, 255, 255, 0.1)",
  bottom: "-90px",
  left: "15%",
  zIndex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "40px",
    left: "40px",
    width: "100px",
    height: "50px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.1)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100px",
    height: "100px",
    bottom: "-50px",
    left: "10%",
    "&::before": {
      top: "25px",
      left: "25px",
      width: "50px",
      height: "25px",
    },
  },
}));

const EventDetails = styled(Paper)(({ theme }) => ({ // Event Details Section
  padding: theme.spacing(2.5,4,4,4), //  2.5 for top, 3 for right, 2 for bottom, 1 for left

  marginTop: theme.spacing(0),
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(13, 12, 35, 0.1)",
  zIndex: 2,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  // background: `linear-gradient(to bottom, ${colors.light}, #ffffff)`, // Background Gradient
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(13, 12, 35, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: theme.spacing(0),
    padding: theme.spacing(3),
  },
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    marginRight: theme.spacing(1.5),
    color: colors.normal,
    fontSize: "1.8rem",
  },
}));

const FormSection = styled(Paper)(({ theme }) => ({ // Registration Form Section
  // padding: theme.spacing(4),
  padding: theme.spacing(2.5,4,4,4), //  2.5 for top, 3 for right, 2 for bottom, 1 for left

  marginTop: theme.spacing(0),
  borderRadius: 16,
  boxShadow: "0 8px 30px rgba(13, 12, 35, 0.1)",
  background: "white",
  position: "relative",
  height: "100%",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "150px",
    height: "150px",
    bottom: "-75px",
    right: "-75px",
    borderRadius: "50%",
    background: `linear-gradient(to bottom right, ${colors.light}, #ffffff)`,
    opacity: 0.6,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const ScrollToTopButton = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
  backgroundColor: colors.normal,
  color: "white",
  boxShadow: "0 4px 14px rgba(37, 34, 101, 0.25)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: colors.normalHover,
    transform: "translateY(-5px)",
    boxShadow: "0 6px 20px rgba(37, 34, 101, 0.35)",
  },
  [theme.breakpoints.down("sm")]: {
    bottom: theme.spacing(3),
    right: theme.spacing(3),
  },
}));

interface LandingPageProps {
  formRef?: React.RefObject<HTMLDivElement>;
}

const LandingPage: React.FC<LandingPageProps> = ({ formRef }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const heroHeight = heroSection.getBoundingClientRect().height;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box>
      <HeroSection className="hero-section">
        <CircleDecoration className="circle1" />
        <CircleDecoration className="circle2" />
        <CircleDecoration className="circle3" />
        <TeaCupShape />

        <HeroContentWrapper>
          <AnimatedTitle
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: isMobile ? "2.2rem" : "4rem",
              marginBottom: 3,
              color: "#ffffff",
              letterSpacing: "1px",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                width: isMobile ? "100px" : "150px",
                height: "4px",
                backgroundColor: "white",
                bottom: "-15px",
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: "4px",
              },
            }}
          >
            Tea Gathering
          </AnimatedTitle>
          <AnimatedSubtitle
            variant="h5"
            gutterBottom
            sx={{
              fontSize: isMobile ? "1.1rem" : "1.5rem",
              fontWeight: 400,
              maxWidth: "800px",
              margin: "0 auto",
              color: "#ffffff",
              mt: 3,
              px: 2,
              pb: 1,
              borderRadius: 2,
            }}
          >
            Join us for a delightful evening of networking and refreshments
          </AnimatedSubtitle>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 6,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              px: 3,
              py: 1.5,
              borderRadius: 3,
              backdropFilter: "blur(5px)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: "#ffffff",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
              }}
            >
              <EventIcon sx={{ mr: 1 }} /> 19th July, 2025 | 5:00 PM
              <Box component="span" sx={{ mx: 2, opacity: 0.7 }}>
                •
              </Box>
              <LocationOnIcon sx={{ mr: 1 }} /> Auditorium, SUB
            </Typography>
          </Box>
        </HeroContentWrapper>
      </HeroSection>

      <Container maxWidth="lg">
        <Box sx={{ my: 5 }}>
          <Grid container spacing={isMobile ? 3 : 4}>
            <Grid component="div" item xs={12} md={5}>
              <EventDetails elevation={3}>
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  color="primary"
                  align="center"
                  sx={{
                    fontWeight: 600,
                    fontSize: isMobile ? "1.8rem" : "2.2rem",
                    borderBottom: `2px solid ${colors.light}`,
                    paddingBottom: 1,
                    marginBottom: 3,
                    width: "100%",
                  }}
                >
                  Event Details
                </Typography>

                <DetailItem>
                  <EventIcon fontSize="large" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    <strong>Date:</strong> 19th July, 2025 | 5:00 PM
                  </Typography>
                </DetailItem>

                <DetailItem>
                  <LocationOnIcon fontSize="large" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    <strong>Venue:</strong> Auditorium, Stamford University
                    Bangladesh
                  </Typography>
                </DetailItem>

                <Box
                  mt={4}
                  p={3}
                  bgcolor={`${colors.light}80`}
                  borderRadius={3}
                  width="100%"
                  sx={{
                    border: `1px solid ${colors.lightActive}`,
                    position: "relative",
                  }}
                >
                  <InfoIcon
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: 12,
                      backgroundColor: "white",
                      padding: 0.5,
                      borderRadius: "50%",
                      color: colors.normal,
                      border: `1px solid ${colors.lightActive}`,
                    }}
                  />

                  <Typography variant="body1" sx={{ mt: 1 }} align="center">
                    We're excited to welcome you to our Tea Gathering event!
                    Please register using the form to secure your spot.
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: colors.lightActive }} />
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ fontWeight: 500, color: colors.normal }}
                  >
                    After registration, you'll receive a ticket with a QR code,
                    which will be required for entry.
                  </Typography>
                </Box>
              </EventDetails>
            </Grid>

            <Grid component="div" item xs={12} md={7}>
              <Box ref={formRef} id="registration-form">
                <FormSection elevation={3}>
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: isMobile ? "1.8rem" : "2.2rem",
                      borderBottom: `2px solid ${colors.light}`,
                      paddingBottom: 1,
                      marginBottom: 2,
                    }}
                  >
                    Registration Form
                  </Typography>
                  <Box sx={{ 
                    '& .MuiGrid-root:last-child': { 
                      marginTop: '-2px !important' 
                    }
                  }}>
                    <RegistrationForm />
                  </Box>
                </FormSection>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
