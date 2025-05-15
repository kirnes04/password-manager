import React, { useState } from 'react';
import { checkPassword, PasswordCheckResult, PasswordCheckError } from '../services/hibpService';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

interface PasswordCheckFormProps {
  open: boolean;
  onClose: () => void;
  initialPassword?: string;
}

export const PasswordCheckForm: React.FC<PasswordCheckFormProps> = ({
  open,
  onClose,
  initialPassword = ''
}) => {
  const [password, setPassword] = useState(initialPassword);
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      const result = await checkPassword(password);
      setResult(result);
    } catch (err) {
      if (err instanceof PasswordCheckError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Check Password Security</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            error={!!error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Box sx={{ mt: 2 }}>
              <Alert severity={result.isCompromised ? 'error' : 'success'}>
                {result.isCompromised
                  ? 'This password has been compromised!'
                  : 'This password has not been found in any known data breaches.'}
                {result.isCompromised && result.count && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    This password has been found {result.count.toLocaleString()} times in data breaches.
                  </Typography>
                )}
              </Alert>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          onClick={handleCheck}
          variant="contained"
          color="primary"
          disabled={!password || loading}
        >
          Check Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 