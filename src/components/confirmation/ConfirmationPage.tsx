import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Grid,
  styled,
  useMediaQuery,
  useTheme,
  Divider,
  Fade,
  Slide,
} from "@mui/material";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Attendee } from "../../types";
import { getAttendees } from "../../utils/dataUtils";
import { formatDate, generateTicketNumber } from "../../utils/pdfUtils";
import { colors } from "../../styles/theme";
import DownloadIcon from "@mui/icons-material/Download";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";

// Styled components with improved design
const TicketContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: "0 12px 32px rgba(13, 12, 35, 0.15)",
  background: `linear-gradient(135deg, ${colors.light} 0%, #ffffff 100%)`,
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `radial-gradient(circle at 90% 10%, ${colors.light}99 0%, transparent 40%), 
                     radial-gradient(circle at 10% 90%, ${colors.light}80 0%, transparent 40%)`,
    zIndex: 0,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

const TicketHeader = styled(Box)(({ theme }) => ({
  backgroundColor: colors.normal,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: "8px 8px 50% 50% / 8px 8px 30px 30px",
  textAlign: "center",
  color: "white",
  position: "relative",
  boxShadow: "0 4px 20px rgba(13, 12, 35, 0.2)",
  backgroundImage: `linear-gradient(135deg, ${colors.normal} 0%, ${colors.normalHover} 100%)`,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "10%",
    width: "80%",
    height: 10,
    borderBottomLeftRadius: "50%",
    borderBottomRightRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const QRCodeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
  backgroundColor: "white",
  borderRadius: 16,
  boxShadow: "0 8px 16px rgba(13, 12, 35, 0.1)",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    border: `2px dashed ${colors.lightActive}`,
    borderRadius: 10,
    zIndex: 0,
    pointerEvents: "none",
  },
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

const TicketInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: 12,
  position: "relative",
  zIndex: 1,
  boxShadow: "0 4px 16px rgba(13, 12, 35, 0.06)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const ConfirmationBanner = styled(Box)(({ theme }) => ({
  backgroundColor: colors.normal,
  padding: theme.spacing(4, 0),
  color: "white",
  borderRadius: "0 0 30% 30% / 0 0 30px 30px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  marginBottom: theme.spacing(4),
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(60deg, ${colors.normalHover} 0%, ${colors.normal} 100%)`,
    opacity: 0.9,
    zIndex: 0,
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  boxShadow: "0 4px 20px rgba(13, 12, 35, 0.2)",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3, 0),
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(1.5),
  "& svg": {
    color: colors.normal,
    marginRight: theme.spacing(1.5),
    marginTop: theme.spacing(0.3),
  },
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  borderColor: `${colors.lightActive}80`,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 6px 20px rgba(13, 12, 35, 0.15)",
  },
}));

// Confirmation page component
const ConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid registration ID");
      setLoading(false);
      return;
    }

    // Fetch the attendee data
    const attendees = getAttendees();
    const foundAttendee = attendees.find((a) => a.id === id);

    if (foundAttendee) {
      setAttendee(foundAttendee);
    } else {
      setError("Registration not found");
    }

    setLoading(false);
  }, [id]);

  // Generate the QR code content
  const qrCodeContent = attendee
    ? JSON.stringify({
        id: attendee.id,
        name: attendee.fullName,
        studentId: attendee.studentId,
        batch: attendee.batch,
        ticketNumber: generateTicketNumber(attendee.id),
      })
    : "";

  // Handle downloading the ticket as PDF
  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;

    try {
      setPdfGenerating(true);

      // Convert the ticket container to a PNG with better quality
      const dataUrl = await toPng(ticketRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });

      // Create a new PDF document
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });

      // Add a title
      pdf.setFontSize(24);
      pdf.setTextColor(37, 34, 101); // colors.normal
      pdf.text("Tea Gathering - Event Ticket", 105, 15, { align: "center" });

      pdf.setDrawColor(187, 186, 207); // colors.lightActive
      pdf.line(20, 20, 190, 20);

      // Calculate dimensions to fit the image properly
      const imgWidth = 190; // A4 width - margins
      const imgHeight =
        ticketRef.current.offsetHeight *
        (imgWidth / ticketRef.current.offsetWidth);

      // Add some margin from the title
      const yPos = 25;

      // Add the image to the PDF
      pdf.addImage(dataUrl, "PNG", 10, yPos, imgWidth, imgHeight);

      // Add some footer text
      const footerYPos = yPos + imgHeight + 10;
      pdf.setFontSize(10);
      pdf.setTextColor(70, 70, 70);
      pdf.text(
        "This ticket was generated on " +
          formatDate(new Date()) +
          " for the Tea Gathering event.",
        105,
        footerYPos,
        { align: "center" }
      );

      // Add contact information
      pdf.text(
        "For any inquiries, please contact: tea-gathering@stamford.edu",
        105,
        footerYPos + 5,
        { align: "center" }
      );

      // Save the PDF
      pdf.save(`tea-gathering-ticket-${attendee?.studentId}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF ticket. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ my: 8, textAlign: "center" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} sx={{ color: colors.normal }} />
          <Typography
            variant="h5"
            sx={{ mt: 3, color: colors.normal, fontWeight: 500 }}
          >
            Loading your registration details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !attendee) {
    return (
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="50vh"
        >
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              p: 2,
              mb: 4,
              width: "100%",
              borderRadius: 2,
              borderWidth: 2,
              "& .MuiAlert-icon": {
                fontSize: 28,
              },
            }}
          >
            <Typography variant="h6" component="div" gutterBottom>
              {error || "An unexpected error occurred"}
            </Typography>
            <Typography variant="body1">
              We couldn't find your registration details. Please try again or
              contact the event organizers.
            </Typography>
          </Alert>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            startIcon={<HomeIcon />}
            sx={{ minWidth: 200 }}
          >
            Back to Registration
          </ActionButton>
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <ConfirmationBanner>
        <Slide direction="down" in={true} timeout={800}>
          <Box>
            <CheckCircleOutlineIcon
              sx={{ fontSize: 60, mb: 1, opacity: 0.9 }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? "1.8rem" : "2.5rem",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              Registration Confirmed!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                opacity: 0.9,
                maxWidth: 700,
                mx: "auto",
                px: 2,
                fontSize: isMobile ? "1rem" : "1.25rem",
              }}
            >
              Thank you for registering for the Tea Gathering event
            </Typography>
          </Box>
        </Slide>
      </ConfirmationBanner>

      <Container maxWidth="md">
        <Fade in={true} timeout={1000}>
          <Box mb={5}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Your Event Ticket
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Please keep this ticket safe - you'll need to present it at the
              entrance.
            </Typography>

            {/* Ticket that will be converted to PDF */}
            <Box ref={ticketRef}>
              <TicketContainer elevation={4}>
                <TicketHeader>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "1.8rem" : "2.2rem",
                    }}
                  >
                    Tea Gathering
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 1,
                    }}
                  >
                    <EventIcon
                      sx={{ mr: 1, fontSize: isMobile ? "1.2rem" : "1.4rem" }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
                    >
                      19th July, 2025 | 5:00 PM
                    </Typography>
                    <Box component="span" sx={{ mx: 1, opacity: 0.7 }}>
                      •
                    </Box>
                    <LocationOnIcon
                      sx={{ mr: 0.5, fontSize: isMobile ? "1.2rem" : "1.4rem" }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: isMobile ? "0.9rem" : "1rem" }}
                    >
                      Auditorium, SUB
                    </Typography>
                  </Box>
                </TicketHeader>

                <Grid container spacing={isMedium ? 3 : 4}>
                  <Grid component="div" item xs={12} md={4}>
                    <QRCodeContainer>
                      <QRCode
                        value={qrCodeContent}
                        size={isMobile ? 130 : 170}
                        fgColor={colors.dark}
                        bgColor="white"
                        level="H"
                      />
                    </QRCodeContainer>

                    <Box textAlign="center" mt={2}>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{
                          fontWeight: 600,
                          fontSize: isMobile ? "0.9rem" : "1.1rem",
                          backgroundColor: `${colors.light}80`,
                          py: 0.5,
                          px: 2,
                          borderRadius: 4,
                          display: "inline-block",
                        }}
                      >
                        Ticket #{generateTicketNumber(attendee.id)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1, opacity: 0.7 }}
                      >
                        Generated on {formatDate(new Date())}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid component="div" item xs={12} md={8}>
                    <TicketInfo>
                      <Typography
                        variant="h4"
                        gutterBottom
                        color="primary"
                        sx={{
                          fontWeight: 700,
                          fontSize: isMobile ? "1.5rem" : "1.8rem",
                        }}
                      >
                        {attendee.fullName}
                      </Typography>

                      <StyledDivider />

                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid component="div" item xs={12} sm={6}>
                          <InfoItem>
                            <SchoolIcon />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Student ID
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {attendee.studentId}
                              </Typography>
                            </Box>
                          </InfoItem>
                        </Grid>

                        <Grid component="div" item xs={12} sm={6}>
                          <InfoItem>
                            <SchoolIcon />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Batch
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {attendee.batch}
                              </Typography>
                            </Box>
                          </InfoItem>
                        </Grid>

                        <Grid component="div" item xs={12} sm={6}>
                          <InfoItem>
                            <PhoneIcon />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Contact
                              </Typography>
                              <Typography variant="body1" fontWeight={500}>
                                {attendee.contactNumber}
                              </Typography>
                            </Box>
                          </InfoItem>
                        </Grid>

                        <Grid component="div" item xs={12} sm={6}>
                          <InfoItem>
                            <EmailIcon />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Email
                              </Typography>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: isMobile ? "180px" : "220px",
                                }}
                              >
                                {attendee.email}
                              </Typography>
                            </Box>
                          </InfoItem>
                        </Grid>
                      </Grid>

                      <StyledDivider />

                      <Box
                        mt={2}
                        p={2}
                        bgcolor={`${colors.light}80`}
                        borderRadius={2}
                        border={`1px solid ${colors.lightActive}`}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="500"
                          color="text.secondary"
                        >
                          This ticket must be presented at the entrance. Please
                          keep it safe and easily accessible on your phone or as
                          a printout.
                        </Typography>
                      </Box>
                    </TicketInfo>
                  </Grid>
                </Grid>

                <Box mt={4} textAlign="center">
                  <Typography variant="caption" color="text.secondary">
                    For any queries, please contact the organizers at
                    tea-gathering@stamford.edu
                  </Typography>
                </Box>
              </TicketContainer>
            </Box>

            <Box
              mt={4}
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              <ActionButton
                variant="contained"
                size="large"
                color="primary"
                onClick={handleDownloadPDF}
                startIcon={<DownloadIcon />}
                disabled={pdfGenerating}
                sx={{
                  minWidth: 220,
                  boxShadow: "0 4px 14px rgba(37, 34, 101, 0.3)",
                }}
              >
                {pdfGenerating ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Generating PDF...
                  </>
                ) : (
                  "Download PDF Ticket"
                )}
              </ActionButton>

              <ActionButton
                variant="outlined"
                size="large"
                onClick={() => navigate("/")}
                startIcon={<HomeIcon />}
                sx={{ minWidth: 220 }}
              >
                Back to Home
              </ActionButton>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default ConfirmationPage;
