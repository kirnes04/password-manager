import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    TextField,
    Button,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Record } from '../types';

interface RecordCardProps {
    record: Record;
    onEdit: (record: Record) => void;
    onDelete: (id: number) => void;
    onShare: (record: Record) => void;
    onMove: (recordId: number, directoryId: number) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({
    record,
    onEdit,
    onDelete,
    onShare,
    onMove,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecord, setEditedRecord] = useState(record);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setIsEditing(true);
        handleMenuClose();
    };

    const handleSave = () => {
        onEdit(editedRecord);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedRecord(record);
        setIsEditing(false);
    };

    const handleDelete = () => {
        onDelete(record.id);
        handleMenuClose();
    };

    const handleShare = () => {
        onShare(record);
        handleMenuClose();
    };

    if (isEditing) {
        return (
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button variant="contained" onClick={handleSave}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">{record.name}</Typography>
                        <Typography color="textSecondary">{record.login}</Typography>
                        <Typography color="textSecondary">
                            {showPassword ? record.password : '••••••••'}
                        </Typography>
                        <Typography color="textSecondary">{record.url}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <IconButton onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} /> Edit
                </MenuItem>
                <MenuItem onClick={handleShare}>
                    <ShareIcon sx={{ mr: 1 }} /> Share
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Card>
    );
}; 