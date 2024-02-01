# Secrets Web App


The Secrets web app allows users to anonymously share their secrets. It provides both local authentication (using Passport.js with bcrypt for password hashing) and Google OAuth for easy login and registration.

## Table of Contents

- [Secrets Web App](#secrets-web-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Authentication Strategies](#authentication-strategies)
  - [License](#license)

## Features

- **Anonymous Secret Sharing:** Users can share their secrets without revealing their identity.
- **Local Authentication:** Secure user authentication with bcrypt for password hashing.
- **Google OAuth:** Register and log in with Google for a seamless authentication experience.
- **Easy to Use:** Simple and intuitive user interface.

## Installation

To run the Secrets web app locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/ishwarashid/secrets-web-app.git
   ```

2. Install dependencies:

   ```bash
   cd secrets-web-app
   npm install
   ```

3. Configure environment variables:

   - Create a .env file based on the provided .env.example template.
   - Obtain Google OAuth credentials and update the .env file with the necessary information.

4. Run the app:

   ```bash
   npm start
   ```
   Visit http://localhost:3000 in your browser to view the app.

## Usage

1. Register/Login:
   - Create an account using the local registration form or log in with your Google account.

2. Share a Secret:
   - Once logged in, you can anonymously share your secrets on the platform.

3. Explore Secrets:
   - Browse and discover secrets shared by other users.

4. Logout:
   - Log out securely when you're done using the app.

## Authentication Strategies
1. Local Authentication
   - Local authentication is handled using Passport.js with bcrypt for password hashing.

2. Google OAuth
   - Google OAuth allows users to log in and register using their Google accounts. Passport.js simplifies the integration.

3. Contributing
   - Contributions are welcome! If you have ideas for improvements or new features, please open an issue to discuss them.

## License
This project is licensed under the [MIT License](LICENSE.md).

