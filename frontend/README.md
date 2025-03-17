# Password Manager Frontend

A modern React frontend for the Password Manager application. This application allows users to securely store and manage their passwords, organize them in directories, and share them with others.

## Features

- User authentication (sign up and sign in)
- Secure password storage and management
- Directory organization for passwords
- Password sharing functionality
- Modern, responsive UI with Material-UI components
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running on `http://localhost:8080`

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (e.g., authentication)
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main application component
│   └── index.tsx      # Application entry point
├── public/            # Static files
├── package.json       # Project dependencies and scripts
└── README.md         # This file
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8080`. The following endpoints are used:

- Authentication:
  - POST `/auth/signin` - Sign in
  - POST `/auth/signup` - Sign up

- Records:
  - GET `/records` - Get all records
  - POST `/records` - Create a new record
  - PUT `/records/{id}` - Update a record
  - PATCH `/records/{id}` - Move a record to a different directory
  - POST `/records/share` - Share a record
  - GET `/records/useToken/{token}` - Use a shared record token

- Directories:
  - GET `/directory` - Get all directories
  - POST `/directory` - Create a new directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
