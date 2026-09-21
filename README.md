# Event Management System

A full-stack web application for managing events, user registrations, bookings, and administrative operations.

The Event Management System provides separate interfaces for users and administrators. Users can browse and book events, while administrators can create and manage events, categories, users, and bookings.

---

## Project Overview

The Event Management System is developed using a modern full-stack architecture with a separate frontend and backend.

### User Side

Users can:

- Register and create an account
- Login securely
- View upcoming events
- Search for events
- Filter events
- View event details
- Register or book an event
- View their bookings
- Cancel bookings
- Manage their profile

### Admin Side

Administrators can:

- Login through the admin panel
- View system statistics
- Add new events
- Edit events
- Delete events
- Manage event categories
- View all bookings
- Approve or reject registrations
- Manage users
- Monitor event and booking activity

---

## Features

### User Authentication

- User registration
- User login
- JWT-based authentication
- Password encryption
- Protected routes
- User profile management

### Event Management

- Create events
- Edit events
- Delete events
- View upcoming events
- View detailed event information
- Event categories
- Event images
- Seat availability

### Event Search and Filtering

Users can search and filter events based on:

- Event name
- Category
- Date
- Location
- Price

### Booking Management

- Book an event
- Check available seats
- View booking history
- Cancel bookings
- Track booking status
- Admin approval and rejection

### Admin Dashboard

The admin dashboard provides information such as:

- Total users
- Total events
- Total bookings
- Upcoming events
- Booking statistics
- Event statistics

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt.js
- Middleware-based authentication

### Database

- MongoDB
- Mongoose

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- MongoDB Compass

---

## Project Architecture

```text
                    +----------------------+
                    |        User          |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   React Frontend     |
                    |       Vite           |
                    +----------+-----------+
                               |
                         REST API
                               |
                               v
                    +----------------------+
                    |   Node.js + Express  |
                    |       Backend        |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |       MongoDB        |
                    |       Database       |
                    +----------------------+
