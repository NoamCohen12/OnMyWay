
# 🚐 OnMyWay – Ride Management & Parent Confirmation System  
**Full-Stack Web Application (MVP)**

**OnMyWay** is a full-stack web application designed to help a **ride escort / driver** manage child pickups efficiently and in the correct order.

Parents confirm whether their child will participate in the ride, and the escort receives a **clear, visual platform** showing:
- Which children need to be picked up
- Their pickup locations
- The correct pickup order for the ride

The system combines parent confirmation, geolocation, and interactive map visualization.

---

## 🎯 Project Goal

The main goal of this system is to provide a **ride escort** with a reliable tool that answers two key questions:

1. **Which children should be picked up today?**
2. **In what order should they be collected?**

Parents only confirm participation, while the escort sees an aggregated and ordered route.

---
## 🧩 System Architecture (High Level)

The system follows a classic client-server architecture:
- React frontend communicates with a RESTful Express backend
- Backend handles business logic, database access, and geocoding
- MySQL stores persistent passenger, address, and confirmation data
This separation allows clear responsibility boundaries and easy future scaling.



---

## 👥 Authors

Developed collaboratively by:

- **Noam Cohen**
- **Yair Margalit**

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6)
- Fetch API
- **Leaflet** + **OpenStreetMap**
- CSS

### Backend
- Node.js (ES Modules)
- Express
- MySQL (mysql2)
- Axios (external API calls)
- dotenv
- Nodemon (development)

---

## 🖼️ Application Screens

### Attendant Dashboard - main view
![Ride-ant-Dashboard](./images/attendant-dashboard.png)

### Login Screen (Role Selection)

![Login Screen](./images/login.png)

### Parent Confirmation Screen
![Parent-Confirmation Screen](./images/parent-confirmation.png)

### Add Passenger Screen
![attendant-Verification Screen](./images/attendant-verification.png)







---
## 👤 User Roles

- **Attendant**
  - Manages passengers
  - Views full route and pickup order
  - Sees real-time confirmation status

- **Parent**
  - Confirms or declines child participation
  - Has access only to their child’s status



---

## 🗺️ Map & Visualization

The application uses **Leaflet** with **OpenStreetMap** tiles to visualize:

- Ride starting point (bus icon)
- Passenger pickup locations
- Color-coded markers:
  - 🟢 Green – Child is going
  - 🔴 Red – Child is not going
  - 🔵 Blue – Selected / highlighted passenger
- Ordered pickup route list synchronized with map markers

Passenger addresses are automatically geocoded using the **OpenStreetMap Nominatim API** when a new passenger is added.
Routing is calculated dynamically using OSRM and rendered directly on the map.


---
## ✨ UX Highlights

- Live route visualization synced with passenger list
- Clear visual feedback for ride status (colors & icons)
- Minimal interactions for parents (single confirmation action)
- Designed for tablet / mobile use by attendants during rides

---

## 🗄️ Database Design (MySQL)

### Tables

#### Address
- id (PK)
- x_coordinate
- y_coordinate
- full_address

#### Person
- id (PK)
- f_name
- l_name
- address_id (FK)

#### Confirmation
- id (PK)
- person_id (FK)
- status_ride (BOOLEAN)

#### attendant
- id (PK)
- f_name
- l_name
- address_id (FK)

The schema is normalized to avoid duplication of address data.

---

## 🔌 Backend API Endpoints

- `GET /users` – Get all passengers (escort view)
- `GET /users/:id` – Get single child (parent view)
- `PUT /users/:id/status` – Update ride status
- `POST /addUser` – Add passenger
- `DELETE /deleteUser/:id` – Delete passenger
- `GET /route` – Get ordered ride route

---

## 🔐 Environment Variables (.env)

Create a `.env` file inside `Backend/`:

```
DB_HOST=localhost
DB_USER=onmyway_app
DB_PASSWORD=your_password_here
DB_NAME=onmyway
DB_PORT=3306
```

Do not commit this file to GitHub.

---

## 🛠️ Database Initialization

```
cd Backend/DB_SQL
mysql -u onmyway_app -p onmyway < schema.sql
```

---

## ▶️ Running the Project

### Backend
```
cd Backend
npm install
npm run dev
```

### Frontend
```
cd Frontend
npm install
npm run dev
```
## ⚠️ Known Limitations (MVP)

- Route optimization is order-based, not time-optimized
- No authentication layer (planned for future version)
- OSRM public demo server is used for routing

---
## 🚀 Future Improvements

- Authentication & role-based access control
- Real-time updates using WebSockets
- Advanced route optimization (time, traffic, constraints)
- Mobile-first UI improvements

---

## 📌 Project Status

This project is a **full-stack MVP**, built to model a real-world ride management system with parent confirmation and map-based route visualization.
The project is actively evolving and serves as a foundation for future production-ready features.

