import React, { useState } from 'react';
import { checkPassword, PasswordCheckResult } from '../services/hibpService';
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
      const result = await checkPassword(password);
      setResult(result);
    } catch (err) {
      setError('Failed to check password. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color={result.isCompromised ? 'error' : 'success'}>
                {result.isCompromised
                  ? 'This password has been compromised!'
                  : 'This password has not been found in any known data breaches.'}
              </Typography>
              {result.isCompromised && result.count && (
                <Typography variant="body2" color="text.secondary">
                  This password has been found {result.count} times in data breaches.
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
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