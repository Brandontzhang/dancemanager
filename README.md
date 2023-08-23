# dancemanager

## Lessons Learned
- Getting the project started
    - Configuring package.json
        - ts-node-dev has errors, so modified to use nodemon and ts-node
        - wanted to use modules (type='modules') in package.json which was causing issues with imports
            - fixed by pointing some fiels to the dist directory (compiled javascript files)

- Implementing the object structures in Schema and Models
    - The schema represents the object structure to be presented to the client side
    - The models represent the structure of the data returned from the database

- Implementing the connection to the PostgreSQL database
    - Creating a new datasource
        - Creating custom datasource using pg (node-postgres) to create a pool connection to the db
        - setting the environment variables using dotenv in .env
            - dotenv needs to be started before the server using config()
        - Addtional tasks include cache optimization
            - implemented by Apollo for REST API through RESTDataSource
            - Additional considerations for custom data source (as I've implemented)
                - initialization function
                - check number of open connections (not sure if this is handled by pool connection, since this class is initialized every time a new request is made)
                - caching (N+1 problem, one additional query on top of every single query, one level deeper)
    - Adding a new datasource to contextValue in GraphQL
        - Creating and accessing the db connection class in the server startup context function

- Authentication and Authorization
    - Authentication is verifying that the user has an account on the platform
    - Authorization is then verifying that the user's account has different priveliges based on roles/security
    - Creating user accounts
        - using bcrypt - saves a hash of the password on the database. 
            - The hash is created using the password and a salt
            - The stored hash acts as a reference for the password + salt (so no need to store salt separately)
            - On authentication, the salt is retrieved from the hash, and used to compare the input password and password_hash
    - Authentication occurs on a login request
        - bcrypt is used to verify the password. Upon verification, the user information (- pw/any sensitive info) is provided from the db
        - A token is generated (using JWT)
            - The token takes in non-sensitive information about the user (id, username, email, permissions, etc.) and creates a token with a secret (complex string defined in .env), as well as an algorithm (using the default one right now)
            - The token is sent to the client
        - The client sends a request with the token in the header
            - GraphQL catches it and provides it to the database connection
            - Whenever the db attempts to make a query, a check is made to:
                1. Verify the token
                2. Verify the roles -> goes into Authorization
        - TODO:
            - Implement token refresh
    - Authorization
        - Handled with tokens
            - When the token is generated, the role of the user is added into the token
            - As the token is sent back during a request, the role is also parsed from the token during verification