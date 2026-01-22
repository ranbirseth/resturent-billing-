# Restaurant Billing System

A comprehensive web-based application designed to streamline restaurant operations by managing menus, generating instant customer bills, and enabling seamless invoice sharing via WhatsApp. Built with modern web technologies for reliability, scalability, and ease of use. 

# Live link
https://secondwife.netlify.app/
## Features

- **Category-wise Menu Management**: Organize menu items by categories for better accessibility and management
- **Menu Item Operations**: Add, edit, delete, enable/disable menu items with ease
- **Auto Bill Calculation**: Automatic computation of total amounts with tax calculations
- **Instant Bill Generation**: Generate professional bills in real-time
- **WhatsApp Bill Sharing**: Share invoices directly to customers via WhatsApp using their phone number
- **Order & Billing History**: Maintain complete records of orders and billing transactions
- **Responsive Admin Dashboard**: Intuitive interface that works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant synchronization across the application

## Tech Stack

### Frontend
- React.js - UI framework
- Vite - Build tool and development server
- Tailwind CSS - Utility-first CSS framework
- Axios - HTTP client for API requests
- ESLint - Code quality tool

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB Atlas - Cloud database
- Mongoose - MongoDB object modeling

### Deployment
- Backend: Render
- Frontend: Netlify

## Project Structure

```
Restaurant-Billing-System/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── menu/
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   ├── MenuForm.jsx
│   │   │   │   └── MenuList.jsx
│   │   │   ├── BillingScreen.jsx
│   │   │   └── PrintableBill.jsx
│   │   ├── services/
│   │   │   └── api.js               # API integration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── README.md
│
├── server/                          # Express backend application
│   ├── controllers/
│   │   ├── menu.controller.js       # Menu operations logic
│   │   └── orderController.js       # Order operations logic
│   ├── models/
│   │   ├── MenuItem.js              # Menu item schema
│   │   └── Order.js                 # Order schema
│   ├── routes/
│   │   ├── api.js                   # General API routes
│   │   └── menu.routes.js           # Menu-specific routes
│   ├── scripts/
│   ├── server.js                    # Main server file
│   ├── seed.js                      # Database seeding script
│   └── package.json
│
└── README.md                        # Project documentation
```

## Application Workflow

1. **Menu Management Phase**
   - Admin accesses the dashboard and manages menu items
   - Categories are configured for organized menu display
   - Menu items can be added with details (name, price, description, category)
   - Items can be enabled/disabled based on availability

2. **Billing Phase**
   - User selects items from the menu to create a bill
   - System automatically calculates totals with tax
   - Bill is generated with order details and timestamp

3. **Invoice Sharing Phase**
   - Customer provides phone number
   - Bill is formatted and shared via WhatsApp
   - Customer receives invoice link for payment or reference

4. **History & Tracking**
   - All orders and bills are logged in the system
   - Historical data available for analysis and record-keeping

## Environment Variables Setup

### Backend (.env file in server directory)

```
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173

# WhatsApp Integration (if using WhatsApp API)
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Other configurations
API_BASE_URL=http://localhost:5000
```

### Frontend (.env file in client directory)

```
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Restaurant Billing System
```

## Local Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)
- Git

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory and add the environment variables listed above.

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory and add the environment variables listed above.

4. Start the development server:
   ```bash
   npm run dev
   ```
   
   The application will run on `http://localhost:5173`

## API Endpoints

### Menu Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all menu items |
| GET | `/api/menu/:id` | Get menu item by ID |
| POST | `/api/menu` | Create new menu item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |
| GET | `/api/menu/category/:category` | Get items by category |
| PATCH | `/api/menu/:id/toggle` | Enable/disable menu item |

### Order Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/:id` | Get order by ID |
| POST | `/api/orders` | Create new order |
| PUT | `/api/orders/:id` | Update order |
| DELETE | `/api/orders/:id` | Delete order |
| POST | `/api/orders/:id/share-whatsapp` | Share bill via WhatsApp |

## Deployment Details

### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure environment variables in Render dashboard
5. Deploy with build command: `npm install && npm start`

### Frontend Deployment (Netlify)

1. Build the React application:
   ```bash
   cd client
   npm run build
   ```

2. Deploy using Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Configure environment variables in Netlify dashboard
   - Deploy

3. Update VITE_API_BASE_URL to point to your Render backend URL

## Usage

### Managing Menu Items

1. Access the admin dashboard
2. Navigate to Menu Management
3. Add new categories or items
4. Update prices, descriptions, and availability
5. Changes are reflected in real-time

### Creating and Sharing Bills

1. Select items from the menu
2. Verify quantities and prices
3. Review auto-calculated total
4. Enter customer phone number
5. Click "Share on WhatsApp" to send invoice
6. View bill in printable format if needed

## Future Improvements

- Payment gateway integration (Stripe, Razorpay)
- Multi-location support for restaurant chains
- Advanced analytics and reporting dashboard
- Inventory management system
- Staff role-based access control
- Reservation and table management
- Multi-language support
- Mobile app (React Native)
- Real-time order tracking for kitchen display
- Customer loyalty program
- Integration with restaurant delivery platforms

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Ranbir Seth**
- GitHub: [https://github.com/ranbirseth](https://github.com/ranbirseth)
- Email: [Contact via GitHub]

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the author directly.

---

**Last Updated**: January 2026
