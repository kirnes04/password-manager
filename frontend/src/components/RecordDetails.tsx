import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Record } from '../types';

interface RecordDetailsProps {
    record: Record;
    open: boolean;
    onClose: () => void;
    onSave: (record: Record) => void;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({
    record,
    open,
    onClose,
    onSave,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecord, setEditedRecord] = useState(record);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onSave(editedRecord);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedRecord(record);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Record</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Name"
                            value={editedRecord.name}
                            onChange={(e) =>
                                setEditedRecord({ ...editedRecord, name: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Login"
                            value={editedRecord.login}
                            onChange={(e) =>
                                setEditedRecord({ ...editedRecord, login: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={editedRecord.password}
                            onChange={(e) =>
                                setEditedRecord({ ...editedRecord, password: e.target.value })
                            }
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                ),
                            }}
                        />
                        <TextField
                            label="URL"
                            value={editedRecord.url}
                            onChange={(e) =>
                                setEditedRecord({ ...editedRecord, url: e.target.value })
                            }
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Record Details</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                            Name
                        </Typography>
                        <Typography variant="body1">{record.name}</Typography>
                    </Box>
                    {record.login && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Login
                            </Typography>
                            <Typography variant="body1">{record.login}</Typography>
                        </Box>
                    )}
                    {record.password && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                Password
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1">
                                    {showPassword ? record.password : '••••••••'}
                                </Typography>
                                <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    {record.url && (
                        <Box>
                            <Typography variant="subtitle2" color="textSecondary">
                                URL
                            </Typography>
                            <Typography variant="body1">{record.url}</Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEdit} variant="contained">
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 