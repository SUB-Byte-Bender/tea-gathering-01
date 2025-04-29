import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Fade,
  Tooltip,
  Zoom,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RegistrationFormData } from "../../types";
import { addAttendee } from "../../utils/dataUtils";
import { colors } from "../../styles/theme";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface RegistrationFormProps {
  buttonStyles?: React.CSSProperties | any;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ buttonStyles = {} }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<{
    [key: string]: boolean;
  }>({});

  // Create batch options from 011 to 076
  const batchOptions = Array.from({ length: 66 }, (_, i) => 
    `${String(i + 11).padStart(3, '0')}`
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty, dirtyFields },
    setValue,
    watch,
  } = useForm<RegistrationFormData>({
    defaultValues: {
      fullName: "",
      contactNumber: "",
      companyName: "",
      currentPosition: "",
      batch: "",
      studentId: "",
      email: "",
      address: "",
    },
    mode: "onChange",
  });

  // Watch form values for live validation feedback
  const watchedValues = watch();

  // Update validation status when form fields change
  React.useEffect(() => {
    const newValidationStatus: { [key: string]: boolean } = {};

    if (dirtyFields.fullName && !errors.fullName)
      newValidationStatus.fullName = true;
    if (dirtyFields.contactNumber && !errors.contactNumber)
      newValidationStatus.contactNumber = true;
    if (dirtyFields.email && !errors.email) newValidationStatus.email = true;
    if (dirtyFields.companyName && !errors.companyName)
      newValidationStatus.companyName = true;
    if (dirtyFields.currentPosition && !errors.currentPosition)
      newValidationStatus.currentPosition = true;
    if (dirtyFields.batch && !errors.batch) newValidationStatus.batch = true;
    if (dirtyFields.studentId && !errors.studentId)
      newValidationStatus.studentId = true;
    if (dirtyFields.address && !errors.address)
      newValidationStatus.address = true;

    setValidationStatus(newValidationStatus);
  }, [watchedValues, errors, dirtyFields]);

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.includes("image/")) {
        setError("Please upload an image file");
        return;
      }

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size should be less than 2MB");
        return;
      }

      setError(null);
      setValue("profilePicture", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setLoading(true);
    setError(null);

    try {
      // Add the attendee to storage
      const newAttendee = await addAttendee(data);

      // Navigate to confirmation page with the attendee ID
      navigate(`/confirmation/${newAttendee.id}`);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAdornment = (field: string) => {
    const icons = {
      fullName: <PersonIcon color="primary" />,
      contactNumber: <PhoneIcon color="primary" />,
      companyName: <BusinessIcon color="primary" />,
      currentPosition: <BadgeIcon color="primary" />,
      batch: <SchoolIcon color="primary" />,
      studentId: <SchoolIcon color="primary" />,
      email: <EmailIcon color="primary" />,
      address: <HomeIcon color="primary" />,
    };

    const key = field as keyof typeof icons;
    return icons[key];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Fade in={!!error}>
        <Box mb={2}>
          {error && (
            <Alert
              severity="error"
              variant="filled"
              sx={{
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(211, 47, 47, 0.2)",
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid component="div" item xs={12}>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: "Full name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name *"
                placeholder="Enter your full name"
                variant="outlined"
                fullWidth
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("fullName")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.fullName && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="contactNumber"
            control={control}
            rules={{
              required: "Contact number is required",
              pattern: {
                value: /^[0-9+-]+$/,
                message: "Please enter a valid phone number",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Number *"
                placeholder="e.g: +8801234567891"
                variant="outlined"
                fullWidth
                error={!!errors.contactNumber}
                helperText={errors.contactNumber?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("contactNumber")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.contactNumber && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address *"
                placeholder="your.email@example.com"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("email")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.email && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="companyName"
            control={control}
            rules={{ required: "Company name is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Present Company Name *"
                placeholder="Your current workplace"
                variant="outlined"
                fullWidth
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("companyName")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.companyName && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="currentPosition"
            control={control}
            rules={{ required: "Current position is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Current Position *"
                placeholder="e.g: Senior Software Engineer"
                variant="outlined"
                fullWidth
                error={!!errors.currentPosition}
                helperText={errors.currentPosition?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("currentPosition")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.currentPosition && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="batch"
            control={control}
            rules={{ required: "Batch is required" }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={batchOptions}
                freeSolo
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                onInputChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Batch *"
                    placeholder="e.g: 033"
                    variant="outlined"
                    fullWidth
                    error={!!errors.batch}
                    helperText={errors.batch?.message}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            {getAdornment("batch")}
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                      endAdornment: (
                        <>
                          {validationStatus.batch && (
                            <InputAdornment position="end">
                              <CheckCircleOutlineIcon color="success" />
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Controller
            name="studentId"
            control={control}
            rules={{
              pattern: {
                value: /^\d+$/,
                message: "Please enter a valid student ID (numbers only)",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Student ID"
                placeholder="e.g: 08514"
                variant="outlined"
                fullWidth
                error={!!errors.studentId}
                helperText={errors.studentId?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("studentId")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.studentId && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                placeholder="Enter your current address"
                variant="outlined"
                fullWidth
                multiline
                rows={1}
                error={!!errors.address}
                helperText={errors.address?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {getAdornment("address")}
                    </InputAdornment>
                  ),
                  endAdornment: validationStatus.address && (
                    <InputAdornment position="end">
                      <CheckCircleOutlineIcon color="success" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 4px rgba(37, 34, 101, 0.1)",
                    },
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid component="div" item xs={12}>
          <Box
            sx={{
              border: `2px dashed ${colors.lightActive}`,
              borderRadius: 2,
              p: 3,
              backgroundColor: `${colors.light}50`,
              textAlign: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              fontWeight="500"
              color="primary"
            >
              Profile Picture *
            </Typography>

            <input
              accept="image/*"
              id="profile-picture-upload"
              type="file"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
            />

            <label htmlFor="profile-picture-upload">
              <Tooltip
                title="Upload a casual picture of yourself that could be featured on the event banner"
                placement="top"
                TransitionComponent={Zoom}
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      textAlign: 'center',
                    }
                  }
                }}
              >
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  startIcon={<PhotoCameraIcon />}
                  sx={{
                    borderWidth: "2px",
                    borderColor: colors.normal,
                    "&:hover": {
                      borderWidth: "2px",
                      backgroundColor: `${colors.light}80`,
                    },
                  }}
                >
                  {profilePreview
                    ? "Change Profile Picture"
                    : "Upload Profile Picture"}
                </Button>
              </Tooltip>
            </label>

            {profilePreview && (
              <Box
                mt={2}
                display="flex"
                justifyContent="center"
                sx={{
                  animation: "fadeIn 0.5s ease-out",
                  "@keyframes fadeIn": {
                    "0%": {
                      opacity: 0,
                      transform: "scale(0.9)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "scale(1)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: "50%",
                    overflow: "hidden",
                    width: 150,
                    height: 150,
                    border: `3px solid ${colors.normal}`,
                    boxShadow: "0 4px 12px rgba(37, 34, 101, 0.2)",
                  }}
                >
                  <img
                    src={profilePreview}
                    alt="Profile preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid component="div" item xs={12} mt={isMobile ? 2 : 3} sx={buttonStyles}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            disabled={loading || !isDirty}
            sx={{
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "0 4px 14px rgba(37, 34, 101, 0.3)",
              transition: "all 0.3s ease",
              "&:not(:disabled):hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 20px rgba(37, 34, 101, 0.4)",
              },
              "&:not(:disabled):active": {
                transform: "translateY(-1px)",
                boxShadow: "0 3px 10px rgba(37, 34, 101, 0.3)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={28} color="inherit" />
            ) : (
              "Register for Tea Gathering"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegistrationForm;
