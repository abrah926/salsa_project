# This is a salsa dance app 

- this is a work in progress for an mvp.



# road map

frontend/
├── public/
│   ├── index.html        # Root HTML file
│   ├── favicon.ico       # App icon (e.g., a salsa dance logo)
│   └── assets/           # Static assets (images, fonts, etc.)
│       ├── images/       # Event flyers, icons, etc.
│       └── fonts/        # Custom fonts for salsa styling
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── EventCard.js  # Card for displaying event details
│   │   ├── Navbar.js     # Navigation bar
│   │   ├── Footer.js     # Footer section
│   │   └── Calendar.js   # Calendar component for event scheduling
│   ├── pages/            # Pages of the app
│   │   ├── HomePage.js   # Landing page
│   │   ├── EventsPage.js # Lists all upcoming events
│   │   ├── EventDetailPage.js # Detailed view of a single event
│   │   ├── AboutPage.js  # About the salsa community or app
│   │   └── ContactPage.js # Contact information and forms
│   ├── styles/           # CSS or SCSS files
│   │   ├── index.css     # Global styles
│   │   └── components.css # Component-specific styles
│   ├── utils/            # Helper functions or constants
│   │   ├── api.js        # API calls to back-end for events data
│   │   └── constants.js  # Constants for app settings
│   ├── App.js            # Main application file
│   ├── index.js          # ReactDOM render entry point
│   └── router.js         # Routing configuration
├── .gitignore            # Git ignore file
├── package.json          # NPM dependencies
└── README.md             # App documentation
