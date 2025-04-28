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
    InputAdornment,
    Collapse,
} from '@mui/material';
import {
    Add as AddIcon,
    Folder as FolderIcon,
    FolderOpen as FolderOpenIcon,
    Key as KeyIcon,
    Close as CloseIcon,
    Refresh as RefreshIcon,
    ExpandLess,
    ExpandMore,
    Share as ShareIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RecordCard } from '../components/RecordCard';
import { recordsAPI, directoriesAPI, passwordAPI } from '../services/api';
import { Record, Directory } from '../types';
import { PasswordCheckForm } from '../components/PasswordCheckForm';

export const Records: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [records, setRecords] = useState<Record[]>([]);
    const [directories, setDirectories] = useState<Directory[]>([]);
    const [currentDirectory, setCurrentDirectory] = useState<number>(0);
    const [directoryPath, setDirectoryPath] = useState<Directory[]>([]);
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
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [shareData, setShareData] = useState<{ token: string; expirationDate: string } | null>(null);
    const [useTokenDialogOpen, setUseTokenDialogOpen] = useState(false);
    const [token, setToken] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
    const [expirationDateDialogOpen, setExpirationDateDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string>('');
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const defaultPasswordParams = {
        length: 8,
        upper: 2,
        lower: 2,
        digit: 2,
        special: 2,
    };
    const [passwordParams, setPasswordParams] = useState(defaultPasswordParams);
    const [expandedDirectories, setExpandedDirectories] = useState<Set<number>>(new Set());
    const [passwordCheckOpen, setPasswordCheckOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }
        fetchData();
    }, [isAuthenticated, currentDirectory]);

    const handleError = (error: Error) => {
        setError(error.message);
        setErrorDialogOpen(true);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [recordsResponse, rootResponse] = await Promise.all([
                recordsAPI.getAll(currentDirectory),
                directoriesAPI.getRoot(),
            ]);
            setRecords(recordsResponse.data);
            
            // Get the full path to current directory
            if (currentDirectory !== 0) {
                const parentsResponse = await directoriesAPI.getParents(currentDirectory);
                const parents = parentsResponse.data ? 
                    (Array.isArray(parentsResponse.data) ? parentsResponse.data : [parentsResponse.data]) 
                    : [];
                // Get current directory from children of its parent
                const parentId = parents[parents.length - 1]?.id || 0;
                const childrenResponse = await directoriesAPI.getChildren(parentId);
                const currentDir = childrenResponse.data.find(dir => dir.id === currentDirectory);
                if (currentDir) {
                    setDirectoryPath([...parents, currentDir]);
                }
            } else {
                // When in root directory, show empty path
                setDirectoryPath([]);
            }

            // Get directories for the current view
            if (currentDirectory === 0) {
                setDirectories([rootResponse.data]);
            } else {
                const childrenResponse = await directoriesAPI.getChildren(currentDirectory);
                setDirectories(childrenResponse.data);
            }
        } catch (error) {
            handleError(error as Error);
        } finally {
            setLoading(false);
        }
    };

    const handleDirectoryClick = async (directoryId: number) => {
        setCurrentDirectory(directoryId);
        // The directory path and children will be updated by the useEffect hook
        // when currentDirectory changes
    };

    const handleCreateRecord = async () => {
        try {
            await recordsAPI.create(newRecord, currentDirectory);
            setOpenNewRecord(false);
            setNewRecord({ name: '', login: '', password: '', url: '' });
            fetchData();
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleCreateDirectory = async () => {
        try {
            await directoriesAPI.create(newDirectoryName, currentDirectory);
            setOpenNewDirectory(false);
            setNewDirectoryName('');
            fetchData();
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleEditRecord = async (record: Record) => {
        try {
            await recordsAPI.update(record.id, record);
            fetchData();
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleDeleteRecord = async (id: number) => {
        try {
            await recordsAPI.delete(id);
            fetchData();
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleShareRecord = async (record: Record) => {
        setSelectedRecord(record);
        setExpirationDateDialogOpen(true);
    };

    const handleExpirationDateSelect = async (minutes: number) => {
        if (!selectedRecord) return;
        
        try {
            const expirationDate = new Date(Date.now() + (minutes + 180) * 60 * 1000).toISOString();
            const response = await recordsAPI.share(selectedRecord.id, expirationDate);
            setShareData({
                token: response.data.token,
                expirationDate: new Date(response.data.expirationDate).toLocaleString()
            });
            setExpirationDateDialogOpen(false);
            setShareDialogOpen(true);
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleMoveRecord = async (recordId: number, directoryId: number) => {
        try {
            await recordsAPI.move(recordId, directoryId);
            fetchData();
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleUseToken = async () => {
        try {
            const response = await recordsAPI.useToken(token, currentDirectory);
            setRecords([...records, response.data]);
            setUseTokenDialogOpen(false);
            setToken('');
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const validatePasswordParams = () => {
        if (passwordParams.length < 4) {
            handleError(new Error('Password length must be at least 4 characters'));
            return false;
        }
        if (passwordParams.upper < 1 || passwordParams.lower < 1 || 
            passwordParams.digit < 1 || passwordParams.special < 1) {
            handleError(new Error('Each character type must have at least 1 character'));
            return false;
        }
        const totalChars = passwordParams.upper + passwordParams.lower + 
                          passwordParams.digit + passwordParams.special;
        if (totalChars > passwordParams.length) {
            handleError(new Error('Total number of characters exceeds password length'));
            return false;
        }
        return true;
    };

    const handleGeneratePassword = async () => {
        if (!validatePasswordParams()) return;
        
        try {
            const password = await passwordAPI.generatePassword(
                passwordParams.length,
                passwordParams.upper,
                passwordParams.lower,
                passwordParams.digit,
                passwordParams.special
            );
            setGeneratedPassword(password);
            setPasswordDialogOpen(true);
        } catch (error) {
            handleError(error as Error);
        }
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(generatedPassword);
    };

    const isPasswordParamsValid = () => {
        if (passwordParams.length < 4) return false;
        if (passwordParams.upper < 1 || passwordParams.lower < 1 || 
            passwordParams.digit < 1 || passwordParams.special < 1) return false;
        const totalChars = passwordParams.upper + passwordParams.lower + 
                          passwordParams.digit + passwordParams.special;
        return totalChars <= passwordParams.length;
    };

    const handleClosePasswordDialog = () => {
        setPasswordDialogOpen(false);
        setPasswordParams(defaultPasswordParams);
        setGeneratedPassword('');
    };

    const toggleDirectory = async (directoryId: number) => {
        const newExpanded = new Set(expandedDirectories);
        if (newExpanded.has(directoryId)) {
            newExpanded.delete(directoryId);
        } else {
            try {
                const childrenResponse = await directoriesAPI.getChildren(directoryId);
                const newDirectories = [...directories];
                childrenResponse.data.forEach(child => {
                    if (!newDirectories.find(d => d.id === child.id)) {
                        newDirectories.push(child);
                    }
                });
                setDirectories(newDirectories);
                newExpanded.add(directoryId);
            } catch (error) {
                handleError(error as Error);
            }
        }
        setExpandedDirectories(newExpanded);
    };

    const renderDirectoryItem = (directory: Directory, level: number = 0) => {
        const hasChildren = expandedDirectories.has(directory.id);
        const isSelected = currentDirectory === directory.id;
        const isRoot = directory.parentId === 0;

        return (
            <React.Fragment key={`${directory.id}-${level}`}>
                <ListItem
                    sx={{
                        cursor: 'pointer',
                        bgcolor: isSelected ? 'action.selected' : 'inherit',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                        pl: level * 2 + 2,
                    }}
                    onClick={() => handleDirectoryClick(directory.id)}
                >
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary={directory.name} />
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleDirectory(directory.id);
                        }}
                    >
                        {hasChildren ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                </ListItem>
                {hasChildren && (
                    <Collapse in={hasChildren} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {directories
                                .filter(dir => dir.parentId === directory.id)
                                .map(child => renderDirectoryItem(child, level + 1))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Password Manager
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* Left Panel */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenNewRecord(true)}
                                >
                                    New Record
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<FolderIcon />}
                                    onClick={() => setOpenNewDirectory(true)}
                                >
                                    New Directory
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<KeyIcon />}
                                    onClick={handleGeneratePassword}
                                >
                                    Generate Password
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<ShareIcon />}
                                    onClick={() => setUseTokenDialogOpen(true)}
                                >
                                    Use Share Token
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<SecurityIcon />}
                                    onClick={() => setPasswordCheckOpen(true)}
                                >
                                    Check Password Security
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Paper>

                        {/* Directory Path */}
                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                {directoryPath.map((dir, index) => (
                                    <React.Fragment key={dir.id}>
                                        {index > 0 && <Typography>/</Typography>}
                                        <Typography
                                            sx={{
                                                cursor: 'pointer',
                                                color: dir.id === currentDirectory ? 'primary.main' : 'inherit',
                                                '&:hover': { textDecoration: 'underline' }
                                            }}
                                            onClick={() => handleDirectoryClick(dir.id)}
                                        >
                                            {dir.name}
                                        </Typography>
                                    </React.Fragment>
                                ))}
                            </Box>
                        </Paper>

                        {/* Directories List */}
                        <Paper>
                            <List>
                                {directories
                                    .filter(dir => dir.parentId === currentDirectory)
                                    .map(directory => renderDirectoryItem(directory))}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Records Content */}
                    <Grid item xs={12} md={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h5">
                                {currentDirectory === 0 ? 'All Records' : 'Directory Records'}
                            </Typography>
                        </Box>

                        {records.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    No records here
                                </Typography>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    Would you like to add a new record?
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenNewRecord(true)}
                                >
                                    Add New Record
                                </Button>
                            </Paper>
                        ) : (
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
                        )}
                    </Grid>
                </Grid>

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

                {/* Share Dialog */}
                <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
                    <DialogTitle>Share Record</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                Share these details with others to give them access to this record:
                            </Typography>
                            <TextField
                                label="Share Record Token"
                                value={shareData?.token || ''}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                            <TextField
                                label="Expiration Date"
                                value={shareData?.expirationDate || ''}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Expiration Date Selection Dialog */}
                <Dialog open={expirationDateDialogOpen} onClose={() => setExpirationDateDialogOpen(false)}>
                    <DialogTitle>Select Expiration Time</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => handleExpirationDateSelect(15)}
                                fullWidth
                            >
                                15 minutes
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleExpirationDateSelect(60)}
                                fullWidth
                            >
                                1 hour
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleExpirationDateSelect(24 * 60)}
                                fullWidth
                            >
                                1 day
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleExpirationDateSelect(7 * 24 * 60)}
                                fullWidth
                            >
                                1 week
                            </Button>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExpirationDateDialogOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>

                {/* Use Token Dialog */}
                <Dialog open={useTokenDialogOpen} onClose={() => setUseTokenDialogOpen(false)}>
                    <DialogTitle>Use Share Token</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <TextField
                                fullWidth
                                label="Share Token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUseTokenDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUseToken} variant="contained">
                            Use Token
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Password Generation Dialog */}
                <Dialog 
                    open={passwordDialogOpen} 
                    onClose={handleClosePasswordDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Password Generator
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleClosePasswordDialog}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            <TextField
                                label="Password Length"
                                type="number"
                                value={passwordParams.length}
                                onChange={(e) => setPasswordParams({ ...passwordParams, length: parseInt(e.target.value) })}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 4, max: 32 }
                                }}
                                error={passwordParams.length < 4}
                                helperText={passwordParams.length < 4 ? "Password length must be at least 4 characters" : ""}
                            />
                            <TextField
                                label="Uppercase Letters"
                                type="number"
                                value={passwordParams.upper}
                                onChange={(e) => setPasswordParams({ ...passwordParams, upper: parseInt(e.target.value) })}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 1, max: passwordParams.length }
                                }}
                                error={passwordParams.upper < 1}
                                helperText={passwordParams.upper < 1 ? "Must have at least 1 uppercase letter" : ""}
                            />
                            <TextField
                                label="Lowercase Letters"
                                type="number"
                                value={passwordParams.lower}
                                onChange={(e) => setPasswordParams({ ...passwordParams, lower: parseInt(e.target.value) })}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 1, max: passwordParams.length }
                                }}
                                error={passwordParams.lower < 1}
                                helperText={passwordParams.lower < 1 ? "Must have at least 1 lowercase letter" : ""}
                            />
                            <TextField
                                label="Digits"
                                type="number"
                                value={passwordParams.digit}
                                onChange={(e) => setPasswordParams({ ...passwordParams, digit: parseInt(e.target.value) })}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 1, max: passwordParams.length }
                                }}
                                error={passwordParams.digit < 1}
                                helperText={passwordParams.digit < 1 ? "Must have at least 1 digit" : ""}
                            />
                            <TextField
                                label="Special Characters"
                                type="number"
                                value={passwordParams.special}
                                onChange={(e) => setPasswordParams({ ...passwordParams, special: parseInt(e.target.value) })}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: 1, max: passwordParams.length }
                                }}
                                error={passwordParams.special < 1}
                                helperText={passwordParams.special < 1 ? "Must have at least 1 special character" : ""}
                            />
                            {passwordParams.upper + passwordParams.lower + passwordParams.digit + passwordParams.special > passwordParams.length && (
                                <Typography color="error" variant="caption">
                                    Total number of characters exceeds password length
                                </Typography>
                            )}
                            <TextField
                                label="Generated Password"
                                value={generatedPassword}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        <Button 
                            startIcon={<RefreshIcon />}
                            onClick={handleGeneratePassword}
                            variant="contained"
                            disabled={!isPasswordParamsValid()}
                        >
                            Regenerate Password
                        </Button>
                        <Button onClick={handleCopyPassword}>Copy to Clipboard</Button>
                    </DialogActions>
                </Dialog>

                {/* Error Dialog */}
                <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2 }}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <PasswordCheckForm
                    open={passwordCheckOpen}
                    onClose={() => setPasswordCheckOpen(false)}
                />
            </Box>
        </Container>
    );
}; 