import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
} from '@mui/material';
import {
    Add as AddIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RecordCard } from '../components/RecordCard';
import { recordsAPI, directoriesAPI } from '../services/api';
import { Record, Directory } from '../types';

export const Records: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [records, setRecords] = useState<Record[]>([]);
    const [directories, setDirectories] = useState<Directory[]>([]);
    const [currentDirectory, setCurrentDirectory] = useState<number>(0);
    const [openNewRecord, setOpenNewRecord] = useState(false);
    const [openNewDirectory, setOpenNewDirectory] = useState(false);
    const [newRecord, setNewRecord] = useState({
        name: '',
        login: '',
        password: '',
        url: '',
    });
    const [newDirectoryName, setNewDirectoryName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }
        fetchData();
    }, [isAuthenticated, currentDirectory]);

    const fetchData = async () => {
        try {
            const [recordsResponse, directoriesResponse] = await Promise.all([
                recordsAPI.getAll(currentDirectory),
                directoriesAPI.getAll(currentDirectory),
            ]);
            setRecords(recordsResponse.data);
            setDirectories(directoriesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRecord = async () => {
        try {
            await recordsAPI.create(newRecord, currentDirectory);
            setOpenNewRecord(false);
            setNewRecord({ name: '', login: '', password: '', url: '' });
            fetchData();
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };

    const handleCreateDirectory = async () => {
        try {
            await directoriesAPI.create(newDirectoryName, currentDirectory);
            setOpenNewDirectory(false);
            setNewDirectoryName('');
            fetchData();
        } catch (error) {
            console.error('Error creating directory:', error);
        }
    };

    const handleEditRecord = async (record: Record) => {
        try {
            await recordsAPI.update(record.id, record);
            fetchData();
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const handleDeleteRecord = async (id: number) => {
        try {
            // Implement delete functionality
            fetchData();
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleShareRecord = async (record: Record) => {
        try {
            const response = await recordsAPI.share({
                recordId: record.id,
                expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            });
            // Handle sharing (e.g., show dialog with share link)
        } catch (error) {
            console.error('Error sharing record:', error);
        }
    };

    const handleMoveRecord = async (recordId: number, directoryId: number) => {
        try {
            await recordsAPI.move(recordId, directoryId);
            fetchData();
        } catch (error) {
            console.error('Error moving record:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Directories Sidebar */}
                <Paper sx={{ width: 240, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Directories</Typography>
                        <IconButton onClick={() => setOpenNewDirectory(true)}>
                            <AddIcon />
                        </IconButton>
                    </Box>
                    <List>
                        <ListItem
                            disablePadding
                            sx={{ cursor: 'pointer' }}
                            onClick={() => setCurrentDirectory(0)}
                        >
                            <ListItemIcon>
                                <FolderOpenIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Root" 
                                sx={{ 
                                    color: currentDirectory === 0 ? 'primary.main' : 'inherit'
                                }}
                            />
                        </ListItem>
                        {directories.map((directory) => (
                            <ListItem
                                key={directory.id}
                                disablePadding
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setCurrentDirectory(directory.id)}
                            >
                                <ListItemIcon>
                                    <FolderIcon />
                                </ListItemIcon>
                                <ListItemText 
                                    primary={directory.name}
                                    sx={{ 
                                        color: currentDirectory === directory.id ? 'primary.main' : 'inherit'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                {/* Records Content */}
                <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h5">
                            {currentDirectory === 0 ? 'All Records' : 'Directory Records'}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenNewRecord(true)}
                        >
                            New Record
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {records.map((record) => (
                            <Grid item xs={12} sm={6} md={4} key={record.id}>
                                <RecordCard
                                    record={record}
                                    onEdit={handleEditRecord}
                                    onDelete={handleDeleteRecord}
                                    onShare={handleShareRecord}
                                    onMove={handleMoveRecord}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            {/* New Record Dialog */}
            <Dialog open={openNewRecord} onClose={() => setOpenNewRecord(false)}>
                <DialogTitle>Create New Record</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Name"
                            value={newRecord.name}
                            onChange={(e) =>
                                setNewRecord({ ...newRecord, name: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Login"
                            value={newRecord.login}
                            onChange={(e) =>
                                setNewRecord({ ...newRecord, login: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={newRecord.password}
                            onChange={(e) =>
                                setNewRecord({ ...newRecord, password: e.target.value })
                            }
                            fullWidth
                        />
                        <TextField
                            label="URL"
                            value={newRecord.url}
                            onChange={(e) =>
                                setNewRecord({ ...newRecord, url: e.target.value })
                            }
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewRecord(false)}>Cancel</Button>
                    <Button onClick={handleCreateRecord} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* New Directory Dialog */}
            <Dialog open={openNewDirectory} onClose={() => setOpenNewDirectory(false)}>
                <DialogTitle>Create New Directory</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Directory Name"
                        fullWidth
                        value={newDirectoryName}
                        onChange={(e) => setNewDirectoryName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewDirectory(false)}>Cancel</Button>
                    <Button onClick={handleCreateDirectory} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}; 