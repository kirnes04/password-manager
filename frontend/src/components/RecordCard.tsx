import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import { Record } from '../types';
import { RecordDetails } from './RecordDetails';

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
    const [showDetails, setShowDetails] = useState(false);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        onDelete(record.id);
        handleMenuClose();
    };

    const handleShare = () => {
        onShare(record);
        handleMenuClose();
    };

    return (
        <>
            <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={() => setShowDetails(true)}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6">{record.name}</Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                handleMenuClick(e);
                            }}>
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
                    <MenuItem onClick={handleShare}>
                        <ShareIcon sx={{ mr: 1 }} /> Share
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                </Menu>
            </Card>
            <RecordDetails
                record={record}
                open={showDetails}
                onClose={() => setShowDetails(false)}
                onSave={onEdit}
            />
        </>
    );
}; 