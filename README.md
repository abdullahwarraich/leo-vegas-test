# Project Overview

This project utilizes the [Nest](https://github.com/nestjs/nest) framework, leveraging the power of TypeScript for development.

## Prerequisites for Setup
 - Install NodeJs version > `21` 
 - Install MySQL service
 - Install NestJs CLI globally using `npm i -g @nestjs/cli`

## Project Setup
Follow these steps to set up the project:
 - Update the MySQL database path in the `.env` file.
 - Install the required packages using:
    ```bash
    $ npm install
    ```
 - If migration hasn't been created, run the following command:
    ```bash
    $ npx prisma migrate dev --name init
    ```
 - If migration already exists, execute the following command to run the database migration:
    ```bash
    $ npx prisma migrate dev
    ```
 - Generate DB types for Prisma client with:
    ```bash
    $ npx prisma generate
    ```
 - Add initial seed for users using:
    ```bash
    $ npx prisma db seed
    ```

## Running the Application
Use these commands to run the application:
```bash
# Start in development mode
$ npm run start

# Start in watch mode
$ npm run start:dev
```

### The application will run on that port
```http://localhost:3000```

## Testing
Execute the following command to run tests:
```bash
# Run unit tests
$ npm run test
```

## Project Structure
The project is structured as follows:
 - **_Prisma folder_**: Contains the database schema.
 - **_src folder_**:  Houses various subfolders related to the application:
    - **Guards**: Responsible for endpoint authorization, ensuring user permissions.
    - **Middlewares**: Perform authentication checks to validate user tokens.
    - **Modules**: Holds feature-specific or business logic:
        - **Auth Module**: Generates user access tokens.
        - **User Module**: Manages user-related routes (e.g., retrieve all users, get user by ID, create, update, or delete user).
    - **Pipes**: Validate API request parameters.
    - **Services**: Manage database connections and perform JWT validation checks.
    - **Utils**: Contains common functions used across the application.


#### API-related documentation can be found [here](./API.md).

### Author
 - **_Abdullah Warraich_**