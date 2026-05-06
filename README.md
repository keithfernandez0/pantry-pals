# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

---

# Pantry Pal

**Food Inventory Management Application**
MySQL Database + Web-Based Front End

---

## Overview

**Pantry Pal** is a web-based food inventory management application designed to help users track, organize, and optimize their kitchen inventory. The system aims to reduce food waste, improve kitchen organization, and support efficient meal planning through structured data management and intelligent recipe matching.

This project is being developed as part of a senior capstone course over a six-week timeline.

---

## Team Members

* **Solange DePina-Veiga**
* **Nika Nareklishvili**
* **Keith Fernandez**

The team meets:

* In person during scheduled class time
* Via Google Meet 1–2 times per week

---

## Project Purpose

Pantry Pal is intended to help individuals manage their household kitchen inventory through:

* Structured food item tracking
* Expiration date monitoring
* Storage organization
* Inventory quantity management
* Recipe compatibility analysis

The system is focused on **individual household use**, not commercial restaurant or point-of-sale environments.

---

## Project Deliverables

The final deliverable will be a **fully functional web application** that includes:

* User account creation and authentication
* Secure login system
* Kitchen inventory dashboard
* Recipe recommendation functionality
* Backend MySQL database integration
* Front-end user interface for inventory visualization

---

## System Architecture

### Front End

* React (or similar modern JavaScript framework)
* NPM-based project configuration and dependency management
* UI/UX-focused design
* Optional deployment via Vercel or comparable hosting service

### Back End

* Server-side application layer
* API endpoints for database interaction
* Authentication logic
* Secure data transmission

### Database

* MySQL relational database
* Structured tables with descriptive column naming
* Transaction logging with timestamps
* Data normalization principles applied

---

## Security Features

* Basic user authentication system
* Unique account token generated upon registration
* Email-based account identity
* Password hashing and salting before database storage
* Timestamped database transactions for auditing

---

## Data Model (Planned Fields)

Each inventory record will include:

* Item Name
* Unit Type (grams, kilograms, pounds — potential auto-conversion support)
* Quantity in Inventory
* Storage Area (e.g., freezer, pantry, refrigerator)
* Expiration Date
* User ID (account owner)
* Timestamp (automatically generated per transaction)

---

## Core Features

### Inventory Dashboard

* Visual representation of a mock kitchen
* Submenus by storage area
* Item quantity tracking
* Expiration monitoring

### Recipes Module

* Dedicated recipe tab
* Database scan for compatible ingredients
* Verification of sufficient quantities
* Suggested meals based on current inventory

---

## Required Team Skills

* Front-end development (React, UI integration)
* Backend development (API, server logic)
* Database design and management (MySQL)
* User authentication implementation
* UI/UX design principles

### Role Alignment

* **Solange DePina-Veiga** – Front-end UI/UX design and interface development
* **Nika Nareklishvili** – Backend logic and application integration
* **Keith Fernandez** – Database architecture, backend networking logic, security implementation

---

## Project Timeline

**Estimated Completion Time:** 6 weeks

### High-Level Milestones:

1. Requirements finalization
2. Database schema design
3. Authentication implementation
4. Front-end interface development
5. Backend integration
6. Testing and deployment

---

## Resources

* MySQL Documentation: [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)
* React Documentation: [https://react.dev/](https://react.dev/)
* Node.js Documentation: [https://nodejs.org/](https://nodejs.org/)
* Vercel Deployment Platform: [https://vercel.com/](https://vercel.com/)

---

## Future Considerations

Potential enhancements beyond the capstone scope:

* Barcode scanning integration
* Mobile-responsive PWA support
* Push notifications for expiring items
* Nutritional tracking integration
* Machine learning–based meal recommendations

---

## Notes

The database schema is modeled conceptually after structured inventory systems used in industry purchasing environments, adapted specifically for household-scale inventory management.

---

**Pantry Pal — Reducing Food Waste Through Intelligent Inventory Management.**
>>>>>>> 378fb782a2ddd8de68ea6cb8f03364f4eb96e819
