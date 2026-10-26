# Student Mark Evaluation System

A full-stack web application for managing college laboratory
evaluations, student marks, teams, departments, sections, faculty, and
labs. The project also includes a student-facing portal with a
leaderboard and individual score viewing.

## Project Overview

The system has three main parts:

1.  **Backend API** --- Node.js, Express.js, and MongoDB.
2.  **Admin Dashboard** --- Vite + React application used by
    administrators and staff to manage academic data and evaluate
    student performance.
3.  **Student Portal** --- Next.js application where visitors can view
    the top five scores and authenticated students can view their own
    scores.

## Tech Stack

### Backend

-   Node.js
-   Express.js
-   MongoDB
-   JWT authentication
-   Environment variables using `.env`

### Admin Dashboard --- Vite + React

-   React with Vite
-   Tailwind CSS
-   TanStack Query
-   Axios
-   Mantine React Table

### Student Portal --- Next.js

-   Next.js
-   Tailwind CSS
-   TanStack Query
-   Axios
-   JWT-based authentication

## Main Features

### Admin Dashboard

-   Secure login for administrators.
-   Manage departments and sections.
-   Manage students, faculty, teams, and labs.
-   Record and manage student lab evaluation marks.
-   Organize student and team information.
-   Use protected API routes for authenticated operations.

### Student Portal

-   Public leaderboard displaying the top five scores without requiring
    login.
-   Student login.
-   Authenticated students can view their individual evaluation scores.
-   Student-focused interface built with Next.js and Tailwind CSS.

### Authentication and Security

-   JWT-based authentication.
-   Protected API routes for restricted operations.
-   Database connection and secrets configured through environment
    variables.
-   Do not commit `.env` files or publish credentials.

## Repository Structure

The exact folder names may differ in your local clone. The project
contains a backend, a Vite-based admin dashboard, and a Next.js student
portal. Update the example paths below to match the actual folder names
in this repository.

``` text
Students-mark-evaluation-system/
├── backend/                 # Node.js + Express API
├── front-end/               # Vite + React admin dashboard
├── student-portal/           # Next.js student-facing portal
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

-   Node.js and npm
-   MongoDB database (local MongoDB or a hosted MongoDB instance)
-   Git
-   Postman (for creating the initial administrator account and testing
    APIs)

## Environment Configuration

Create a `.env` file in the **backend directory**. Add the following
variables:

``` env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SCRECT=your_long_random_jwt_secret
```

**Important:** - `PORT` is the port used by the Express server. Use the
port expected by your backend configuration. - `DB_URL` should contain
your MongoDB connection string. - `JWT_SCRECT` is written exactly as
requested; your backend code must use this same spelling. If your code
uses `JWT_SECRET` instead, update either the variable name or the code
so they match. - Replace the example values with your own values. -
Never upload the real `.env` file to GitHub. Add `.env` to `.gitignore`.

Example `.gitignore` entry:

``` gitignore
.env
.env.*
!.env.example
node_modules/
dist/
.next/
```

You can optionally commit an `.env.example` containing placeholder
values only:

``` env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SCRECT=replace_with_a_secure_random_secret
```

## Installation and Setup

Run each application from its own directory. The paths below are
examples; use the actual directory names in your clone.

### 1. Start the Backend

``` bash
cd backend
npm install
```

Create and configure the backend `.env` file as described above, then
start the server using the script defined in the backend's
`package.json`. Common examples are:

``` bash
npm run dev
```

or:

``` bash
npm start
```

Use the command that is actually available in your backend
`package.json`.

### 2. Create the First Administrator Account

The application uses authentication and protected API routes. Before
logging in to the admin dashboard, create the initial administrator
account using **Postman**.

1.  Start the backend.
2.  Open Postman.
3.  Send a `POST` request to the user-registration or account-creation
    endpoint implemented by your backend.
4.  Provide the required account fields, such as name, email, password,
    and role.
5.  Set the role to `admin` when creating the initial administrator
    account.
6.  Check the API response and confirm that the account was created
    successfully.
7.  Use that account's email and password to log in to the admin
    dashboard.

> **Endpoint note:** Use the exact registration/account-creation URL and
> request-body field names defined in your backend. Do not expose the
> administrator password or JWT secret in this README. If public
> registration allows users to choose their own `admin` role, restrict
> that behavior before deploying the application.

### 3. Run the Admin Dashboard (Vite + React)

``` bash
cd front-end
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal (commonly
`http://localhost:5173`).

The admin dashboard uses Tailwind CSS, TanStack Query, Axios, and
Mantine React Table. Install the project's dependencies with
`npm install` before running it.

Log in using the administrator email and password created through
Postman.

### 4. Run the Student Portal (Next.js)

``` bash
cd student-portal
npm install
npm run dev
```

Open the local URL printed by Next.js in the terminal (commonly
`http://localhost:3000`).

The student portal uses Next.js, Tailwind CSS, TanStack Query, and
Axios. Visitors can view the public top-five leaderboard. Students must
log in to view their own scores.

If the frontend requires an API base URL environment variable, configure
it according to the variable name used in that application's code. For
Vite, client-side environment variables commonly use the `VITE_` prefix;
for Next.js, browser-exposed variables commonly use the `NEXT_PUBLIC_`
prefix. Do not put private secrets in frontend environment variables.

## Typical Workflow

1.  Configure the backend environment variables.
2.  Start the backend and verify that it connects to MongoDB.
3.  Create the first administrator account with Postman.
4.  Start the Vite admin dashboard and log in.
5.  Add departments, sections, labs, faculty, students, and teams.
6.  Record and manage student evaluation marks.
7.  Start the Next.js student portal.
8.  View the public top-five leaderboard or log in as a student to see
    individual scores.

## Security Notes

-   Keep `.env` files and real credentials out of source control.
-   Use a strong, unique JWT secret.
-   Validate and sanitize incoming API data.
-   Protect administrator account creation; do not allow unrestricted
    public admin registration.
-   Ensure protected endpoints verify the authenticated user's identity
    and role.
-   Configure CORS for only the frontend origins you trust.
-   Use HTTPS in production.
-   Never place MongoDB credentials or JWT signing secrets in frontend
    code.

## Troubleshooting

-   **MongoDB connection fails:** Check `DB_URL`, network access,
    database credentials, and the MongoDB service.
-   **JWT authentication fails:** Confirm that the backend reads the
    correct environment variable spelling and that the frontend sends
    authentication data as expected.
-   **Admin login fails:** Verify that the initial account was created
    with the expected role and that the login request uses the backend's
    required field names.
-   **Frontend cannot reach the API:** Check the API base URL, backend
    status, CORS configuration, and environment variable names.
-   **Missing package or script:** Run `npm install` in the relevant
    application directory and check that directory's `package.json` for
    available scripts.

## Contributing

1.  Fork the repository.
2.  Create a feature branch.
3.  Make and test your changes.
4.  Submit a pull request describing the changes.

## Author

**Joseph Vinson Samuel**

-   GitHub: [vinson1906](https://github.com/vinson1906)

## Repository

[Students Mark Evaluation
System](https://github.com/vinson1906/Students-mark-evaluation-system)
