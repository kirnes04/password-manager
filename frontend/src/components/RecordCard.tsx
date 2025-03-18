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
    Delete as DeleteIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import { Record } from '../types';
import { RecordDetails } from './RecordDetails';
import { recordsAPI } from '../services/api';

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
    const [detailedRecord, setDetailedRecord] = useState<Record | null>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleShare = (event: React.MouseEvent) => {
        event.stopPropagation();
        onShare(record);
        handleMenuClose();
    };

    const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(record.id);
        handleMenuClose();
    };

    const handleCardClick = async () => {
        try {
            const response = await recordsAPI.getById(record.id);
            setDetailedRecord(response.data);
            setShowDetails(true);
        } catch (error) {
            console.error('Error fetching record details:', error);
        }
    };

    return (
        <>
            <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={handleCardClick}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="h6">{record.name}</Typography>
                        </Box>
                        <Box>
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
                    <MenuItem onClick={handleShare}>
                        <ShareIcon sx={{ mr: 1 }} /> Share
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <DeleteIcon sx={{ mr: 1 }} /> Delete
                    </MenuItem>
                </Menu>
            </Card>
            {detailedRecord && (
                <RecordDetails
                    record={detailedRecord}
                    open={showDetails}
                    onClose={() => {
                        setShowDetails(false);
                        setDetailedRecord(null);
                    }}
                    onSave={onEdit}
                />
            )}
        </>
    );
}; 