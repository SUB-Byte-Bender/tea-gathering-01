import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  styled,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton,
  Switch,
  Divider,
  Alert,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import { Attendee, ColumnConfig } from "../../types";
import { getAttendees, exportToExcel } from "../../utils/dataUtils";
import { colors } from "../../styles/theme";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 7), // Further increased padding
  borderRadius: 28, // More rounded corners
  boxShadow: "0 20px 60px rgba(13, 12, 35, 0.15)",
  background: "linear-gradient(145deg, white, #f5f9ff)",
  marginTop: theme.spacing(3), // Reduced from 7 to 3
  marginBottom: theme.spacing(7), // Increased margin
  overflow: "hidden",
  position: "relative",
  transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  "&::after": {
    content: '""',
    position: "absolute",
    width: "300px",
    height: "300px",
    top: "-150px",
    right: "-150px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
    opacity: 0.7,
    zIndex: 0,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    width: "220px",
    height: "220px",
    bottom: "-110px",
    left: "-110px",
    borderRadius: "50%",
    background: `radial-gradient(circle, ${colors.light} 0%, transparent 70%)`,
    opacity: 0.6,
    zIndex: 0,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4.5),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    borderRadius: 24,
  },
}));

const AdminHeading = styled(Box)(({ theme }) => ({
  backgroundColor: colors.normal,
  color: "white",
  padding: theme.spacing(12, 7, 6, 7), // Reduced bottom padding from 10 to 6
  borderRadius: "0 0 40px 40px", // More pronounced curved bottom corners
  marginTop: 0,
  marginBottom: 0,
  backgroundImage: `linear-gradient(135deg, ${colors.normal} 0%, ${colors.normalHover} 100%)`,
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 15px 35px rgba(13, 12, 35, 0.35)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "url('/assets/pattern.png') repeat",
    opacity: 0.15,
    zIndex: 0,
    animation: "pulse 15s infinite alternate",
    "@keyframes pulse": {
      "0%": { opacity: 0.1 },
      "100%": { opacity: 0.2 },
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    width: "450px",
    height: "450px",
    top: "-225px",
    right: "-225px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(9, 3.5, 7, 3.5), // Increased padding for mobile view
    borderRadius: "0 0 30px 30px",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(13, 12, 35, 0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.875rem",
    padding: theme.spacing(0.5, 1),
  },
}));

const SearchBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const StatsCard = styled(Box)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: 16,
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 120,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  boxShadow: "0 8px 16px rgba(13, 12, 35, 0.1)",
  border: "1px solid rgba(220, 230, 240, 0.8)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 25px rgba(13, 12, 35, 0.15)",
    borderColor: `${colors.light}`,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100px",
    height: "100px",
    borderRadius: "50% 0 0 0",
    backgroundColor: "rgba(240, 245, 255, 0.7)",
    zIndex: 0, // Keeping this at 0 or lower
  },
  "& .MuiTypography-h4, & .MuiTypography-h3, & .MuiTypography-body1, & .MuiTypography-body2":
    {
      position: "relative", // Make text positioned elements
      zIndex: 1, // Ensure text stays above the decorative elements
    },
  "& .MuiTypography-h4": {
    fontWeight: 700,
    marginBottom: theme.spacing(1),
    transition: "transform 0.3s ease",
    color: colors.dark,
  },
  "& .MuiTypography-body1, & .MuiTypography-body2": {
    color: "rgba(0, 0, 0, 0.6)",
    fontWeight: 500,
    position: "relative", // Explicit position
    zIndex: 1, // Ensure it's above decorative elements
  },
  "&:hover .MuiTypography-h4": {
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: 100,
    padding: theme.spacing(2),
  },
}));

const AdminPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { field: "fullName", headerName: "Full Name", width: 180, selected: true },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      width: 150,
      selected: true,
    },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 180,
      selected: true,
    },
    {
      field: "currentPosition",
      headerName: "Current Position",
      width: 180,
      selected: true,
    },
    { field: "batch", headerName: "Batch", width: 100, selected: true },
    {
      field: "studentId",
      headerName: "Student ID",
      width: 130,
      selected: true,
    },
    { field: "email", headerName: "Email", width: 220, selected: true },
    { field: "address", headerName: "Address", width: 200, selected: false },
    {
      field: "registrationDate",
      headerName: "Registration Date",
      width: 180,
      selected: true,
      valueFormatter: (params) => {
        const date = new Date(params.value as string);
        return date.toLocaleString();
      },
    },
    {
      field: "profilePicture",
      headerName: "Profile",
      width: 100,
      selected: true,
      renderCell: (params: GridRenderCellParams) => {
        const hasProfilePicture = !!params.value;

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {hasProfilePicture ? (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: `2px solid ${colors.normal}`,
                }}
              >
                <img
                  src={params.value as string}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ) : (
              <PersonIcon
                sx={{
                  width: 36,
                  height: 36,
                  padding: 0.5,
                  borderRadius: "50%",
                  color: colors.normal,
                  backgroundColor: colors.light,
                }}
              />
            )}
          </Box>
        );
      },
    },
  ]);

  useEffect(() => {
    // Load attendees data from storage
    const loadedAttendees = getAttendees();
    setAttendees(loadedAttendees);
    setFilteredAttendees(loadedAttendees);
  }, []);

  // Handle column visibility change
  const handleColumnToggle = (field: string) => {
    setColumns(
      columns.map((column) =>
        column.field === field
          ? { ...column, selected: !column.selected }
          : column
      )
    );
  };

  // Get visible columns for DataGrid
  const getVisibleColumns = (): GridColDef[] => {
    return columns
      .filter((column) => column.selected)
      .map((column) => ({
        field: column.field,
        headerName: column.headerName,
        width: column.width,
        valueFormatter: column.valueFormatter,
        flex: 1,
        renderCell: column.renderCell,
      }));
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredAttendees(attendees);
      return;
    }

    const filtered = attendees.filter(
      (attendee) =>
        attendee.fullName.toLowerCase().includes(term) ||
        attendee.email.toLowerCase().includes(term) ||
        attendee.studentId.toLowerCase().includes(term) ||
        attendee.batch.toLowerCase().includes(term) ||
        attendee.contactNumber.toLowerCase().includes(term)
    );

    setFilteredAttendees(filtered);
  };

  // Handle export to Excel
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const selectedFields = columns
        .filter((column) => column.selected)
        .map((column) => column.field);

      // Use the filtered attendees if search is active
      const dataToExport = searchTerm ? filteredAttendees : attendees;

      await exportToExcel(dataToExport, selectedFields);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Box>
      <AdminHeading>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: isMobile ? "1.8rem" : "2.5rem",
            color: "white",
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            opacity: 0.9,
            maxWidth: 600,
          }}
        >
          Manage Tea Gathering event registrations and analyze attendance data
        </Typography>
      </AdminHeading>

      <Container maxWidth="xl">
        <StyledPaper elevation={3}>
          {/* Stats section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid component="div" item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {attendees.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Registrations
                </Typography>
              </StatsCard>
            </Grid>
            <Grid component="div" item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {new Set(attendees.map((a) => a.batch)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Batches
                </Typography>
              </StatsCard>
            </Grid>
            <Grid component="div" item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {new Set(attendees.map((a) => a.companyName)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Companies
                </Typography>
              </StatsCard>
            </Grid>
            <Grid component="div" item xs={12} sm={6} md={3}>
              <StatsCard>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {attendees.filter((a) => a.profilePicture).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  With Profile Pictures
                </Typography>
              </StatsCard>
            </Grid>
          </Grid>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={isMobile ? "flex-start" : "center"}
            mb={3}
            flexDirection={isMobile ? "column" : "row"}
            gap={isMobile ? 2 : 0}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, fontSize: isMobile ? "1.5rem" : "2rem" }}
            >
              Registered Attendees
              {filteredAttendees.length !== attendees.length && (
                <Chip
                  label={`${filteredAttendees.length} of ${attendees.length}`}
                  color="primary"
                  size="small"
                  sx={{ ml: 1, fontWeight: 500 }}
                />
              )}
            </Typography>

            <ActionButton
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={exportLoading || attendees.length === 0}
              sx={{
                width: isMobile ? "100%" : "auto",
                boxShadow: "0 4px 14px rgba(37, 34, 101, 0.3)",
              }}
            >
              {exportLoading ? "Exporting..." : "Export to Excel"}
            </ActionButton>
          </Box>

          <SearchBox>
            <TextField
              placeholder="Search by name, email, ID..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: `${colors.light}40`,
                },
              }}
              sx={{
                flexGrow: 1,
                mr: isMobile ? 0 : 2,
                mb: isMobile ? 2 : 0,
              }}
            />

            <Box display="flex" alignItems="center">
              <Tooltip title="Toggle column filters">
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? "primary" : "default"}
                  sx={{ mr: 1 }}
                >
                  <FilterListIcon />
                </IconButton>
              </Tooltip>

              {!isMobile && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mr: 1 }}
                >
                  Show Filters
                </Typography>
              )}

              <Switch
                checked={showFilters}
                onChange={() => setShowFilters(!showFilters)}
                color="primary"
              />
            </Box>
          </SearchBox>

          {filteredAttendees.length === 0 && searchTerm && (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              No attendees match your search for "{searchTerm}". Try different
              keywords.
            </Alert>
          )}

          {showFilters && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                backgroundColor: `${colors.light}40`,
                border: `1px solid ${colors.lightActive}`,
              }}
              elevation={0}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                color="primary"
                fontWeight={500}
              >
                Select columns to display and export:
              </Typography>

              <Divider
                sx={{ my: 1.5, borderColor: `${colors.lightActive}80` }}
              />

              <FormGroup row>
                <Grid container spacing={1}>
                  {columns.map((column) => (
                    <Grid
                      component="div"
                      item
                      key={column.field}
                      xs={6}
                      sm={4}
                      md={3}
                      lg={2}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={column.selected}
                            onChange={() => handleColumnToggle(column.field)}
                            color="primary"
                            size="small"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            {column.headerName}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Paper>
          )}

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredAttendees}
              columns={getVisibleColumns()}
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              sx={{
                border: `1px solid ${colors.light}`,
                borderRadius: 2,
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: colors.light,
                  "&:focus": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-toolbarContainer": {
                  padding: theme.spacing(2),
                },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: `${colors.light}40`,
                  borderTop: `1px solid ${colors.light}`,
                },
                "& .MuiTablePagination-root": {
                  color: colors.normal,
                },
              }}
            />
          </Box>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default AdminPage;
