# Tattoo Studio backend

<details>
  <summary>Content 📝</summary>
  <ol>
    <li><a href="#about-the-project">About the project</a></li>
    <li><a href="#goal">Goal</a></li>
    <li><a href="#deployment-🚀">Deployment</a></li>
    <li><a href="#stack">Stack</a></li>
    <li><a href="#db-diagram">DB Diagram</a></li>
    <li><a href="#local-installation">Installation</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#author">Authort</a></li>
  </ol>
</details>

## About the project
This was the fourth project for an FSD bootcamp at GeeksHubs Academy. The project consisted in making a backend app with both the api and the database for a tattoo studio.    

## Goal
The project required us to make a database with four tables: roles, users, services and appointments. 

This had to be connected to the api and the api was required to include at least the following endpoints: 

- POST /api/auth/register 
- POST /api/auth/login
- GET /api/users
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/appointments
- PUT /api/appointments
- GET /api/appointments/{id}
- GET /api/appointments
- GET /api/services

## Deployment 🚀
<div align="center">
    Comming Soon
</div>

## Stack
Technologies employed:
<div align="center">
<a href="https://www.mysql.com/">
    <img src= "https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white"/>
</a>
<a href="https://www.expressjs.com/">
    <img src= "https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
</a>
<a href="https://nodejs.org/es/">
    <img src= "https://img.shields.io/badge/node.js-026E00?style=for-the-badge&logo=node.js&logoColor=white"/>
</a>
<a href="https://www.typescriptlang.org/">
    <img src= "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
</a>
 </div>


## DB Diagram
!['imagen-db'](./img/tattoo_studio_relations.PNG)

## Installation
1. Clone the repo: ` $ git clone https://github.com/Eryhnar/tattoo-studio.git`
2. ` $ npm install `
3. Set the .env file and adjust the params for the database.
4. Connect to the database.
5. ``` $ npm run migrations-run ``` 
6. ``` $  ``` Run the seeders.
7. ``` $ npm run dev ``` Start the server.
8. ``` $ npm run migrations-revert ``` If you ever need to revert them.

## Endpoints
<details>
<summary>Endpoints</summary>
    

- AUTH
    - register

            POST http://localhost:4000/api/register
        body:
        ``` js
            {
                "name": "David", 
                "surname": "surname",
                "email": "david@david.com", 
                "password": "princes"
            }
        ```
        name: single word name with no numbers
        surname: single word name with no numbers
        email: something@something.domain
        password: minimum one capital letter, one lowercase and a number. Length 8-14.

    - login

            POST http://localhost:4000/api/login  
        body:
        ``` js
            {
                "email": "david@david.com",
                "password": "princes"
            }
        ```
        email: something@something.domain
        password: minimum one capital letter, one lowercase and a number. Length 8-14.
- ROLES
    - getRoles

            GET http://localhost:4000/api/roles
- USERS
    - getProfile

            GET http://localhost:4000/api/users/profile  
        auth:
        ``` js
            token
        ```
    - updateProfile

            POST http://localhost:4000/api/users/profile  
        auth:
        ``` js
            token
        ```
        body:
        ``` js
            {
                "email": "optional",
                "name": "optional",
                "surname": "optional"
            }
        ```
        You may include 1-3 of the fields.
        name: single word name with no numbers
        surname: single word name with no numbers
        email: something@something.domain

    ### Update User Password

**Endpoint:** `/api/users/profile/password`

**Method:** `PUT`

**Description:** This endpoint allows a user to update their password.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Example Headers:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```

**Request Body:**

- `oldPassword`: The user's current password.
- `newPassword`: The user's new password.
- `newPasswordRepeat`: Confirmation of the user's new password.

**Responses:**

- `200 OK`: The password was successfully updated. Returns a success message.
- `400 Bad Request`: The new passwords do not match or the old password is incorrect. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to update the password. Returns an error message.

**Example Request:**

```json
{
    "oldPassword": "oldPassword123",
    "newPassword": "newPassword123",
    "newPasswordRepeat": "newPassword123"
}
```
**Example Response:** 
```json
{
    "success": true,
    "message": "User password updated successfully"
}
```

### Deactivate User

**Endpoint:** `/api/users/profile/delete`

**Method:** `DELETE`

**Description:** This endpoint allows a user to deactivate their account. Once deactivated, the user's account will no longer be active.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Request Body:**

- `password`: The user's current password.

**Responses:**

- `200 OK`: The account was successfully deactivated. Returns a success message.
- `400 Bad Request`: The provided password is incorrect. Returns an error message.
- `404 Not Found`: The user was not found. This should be redundant and not trigger. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to deactivate the account. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### UPDATE USER BY ID

**Endpoint:** `/api/users/:id`

**Method:** `PUT`

**Description:** This endpoint allows a super admin to update a user.

**Headers:**

- `Authorization`: Bearer token for authenticating the super admin. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the user to be updated.

**Responses:**

- `200 OK`: The request was successful. 
- `401 Unauthorized`: The user is not authenticated or not a super admin. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to update the user. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Delete User by ID

**Endpoint:** `/api/users/:id`

**Method:** `DELETE`

**Description:** This endpoint allows a super admin to delete a user by their ID.

**Headers:**

- `Authorization`: Bearer token for authenticating the super admin. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the user to be deleted.

**Responses:**

- `200 OK`: The user was successfully deleted. Returns a success message.
- `404 Not Found`: The user with the specified ID was not found. Returns an error message.
- `401 Unauthorized`: The user is not authenticated or not a super admin. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to delete the user. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Get All Users with Optional Filters

**Endpoint:** `/api/users`

**Method:** `GET`

**Description:** This endpoint allows a super admin to retrieve users. Optional query parameters can be provided to filter the users by name and email.

**Headers:**

- `Authorization`: Bearer token for authenticating the super admin. This should be included in all requests to this endpoint.

**Query Parameters:**

- `name`: (Optional) A string to filter users by name.
- `email`: (Optional) A string to filter users by email.

**Responses:**

- `200 OK`: The request was successful. Returns a list of all users that match the provided filters.
- `401 Unauthorized`: The user is not authenticated or not a super admin. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to retrieve the users. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Create a Service

**Endpoint:** `/api/services`

**Method:** `POST`

**Description:** This endpoint allows an authenticated user to create a new service.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Request Body:**

- `name`: The name of the service. This is a required field.
- `description`: (Optional) A description of the service.
- `photo`: (Optional) A URL to a photo of the service.

**Responses:**

- `201 Created`: The service was successfully created. Returns a success message.
- `400 Bad Request`: The service name already exists or the name was not provided. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to create the service. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Get All Services

**Endpoint:** `/api/services`

**Method:** `GET`

**Description:** This endpoint retrieves all services.

**Responses:**

- `200 OK`: The request was successful. Returns a list of all services.
- `404 Not Found`: No services were found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to retrieve the services. Returns an error message.

### Update a Service

**Endpoint:** `/api/services/:id`

**Method:** `PUT`

**Description:** This endpoint allows an authenticated user to update an existing service.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the service to be updated.

**Request Body:**

- `name`: (Optional) The new name of the service.
- `description`: (Optional) The new description of the service.
- `photo`: (Optional) The new URL to a photo of the service.

**Responses:**

- `200 OK`: The service was successfully updated. Returns a success message.
- `404 Not Found`: The service with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to update the service. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```

### Delete a Service

**Endpoint:** `/api/services/:id`

**Method:** `DELETE`

**Description:** This endpoint allows an authenticated user to delete an existing service.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the service to be deleted.

**Responses:**

- `200 OK`: The service was successfully deleted. Returns a success message.
- `404 Not Found`: The service with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to delete the service. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Create a Catalogue Entry

**Endpoint:** `/api/catalogue`

**Method:** `POST`

**Description:** This endpoint allows an authenticated user to create a new catalogue entry.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Request Body:**

- `name`: The name of the catalogue entry. This is a required field.
- `description`: (Optional) A description of the catalogue entry.
- `artistId`: The ID of the artist. This is a required field.
- `serviceId`: The ID of the service. This is a required field.
- `price`: The price of the catalogue entry. This is a required field.
- `beforeImage`: (Optional) A URL to a before image of the catalogue entry.
- `afterImage`: A URL to an after image of the catalogue entry. This is a required field.

**Responses:**

- `201 Created`: The catalogue entry was successfully created. Returns a success message and the created catalogue entry.
- `400 Bad Request`: The request body is missing required fields or contains invalid data. Returns an error message.
- `404 Not Found`: The artist or service with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to create the catalogue entry. Returns an error message.

**Example Request:**

```json
header auth
{
    "Authorization": "Bearer your_token_here"
}
body
{
    "name": "Catalogue Entry Name",
    "description": "Catalogue Entry Description",
    "artistId": 1,
    "serviceId": 1,
    "price": 100,
    "beforeImage": "http://example.com/before_image.jpg",
    "afterImage": "http://example.com/after_image.jpg"
}
```
### Update a Catalogue Entry

**Endpoint:** `/api/catalogue/:id`

**Method:** `PUT`

**Description:** This endpoint allows an authenticated user to update an existing catalogue entry.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the catalogue entry to be updated.

**Request Body:**

- `name`: (Optional) The new name of the catalogue entry.
- `description`: (Optional) The new description of the catalogue entry.
- `artistId`: (Optional) The new ID of the artist.
- `serviceId`: (Optional) The new ID of the service.
- `price`: (Optional) The new price of the catalogue entry.
- `beforeImage`: (Optional) The new URL to a before image of the catalogue entry.
- `afterImage`: (Optional) The new URL to an after image of the catalogue entry.

**Responses:**

- `200 OK`: The catalogue entry was successfully updated. Returns a success message.
- `400 Bad Request`: The request body is missing required fields or contains invalid data. Returns an error message.
- `404 Not Found`: The catalogue entry, artist, or service with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to update the catalogue entry. Returns an error message.

**Example Request:**

```json
header auth
{
    "Authorization": "Bearer your_token_here"
}
body
{
    "name": "New Catalogue Entry Name",
    "description": "New Catalogue Entry Description",
    "artistId": 2,
    "serviceId": 2,
    "price": 200,
    "beforeImage": "http://example.com/new_before_image.jpg",
    "afterImage": "http://example.com/new_after_image.jpg"
}
```
### Delete a Catalogue Entry

**Endpoint:** `/api/catalogue/:id`

**Method:** `DELETE`

**Description:** This endpoint allows an authenticated user to delete an existing catalogue entry.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the catalogue entry to be deleted.

**Responses:**

- `200 OK`: The catalogue entry was successfully deleted. Returns a success message and the deleted catalogue entry.
- `400 Bad Request`: The provided ID is invalid. Returns an error message.
- `404 Not Found`: The catalogue entry with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to delete the catalogue entry. Returns an error message.

**Example Request:**

```json
header auth
{
    "Authorization": "Bearer your_token_here"
}
body
{
    "success": true,
    "message": "Catalogue entry deleted successfully",
    "data": {
        "id": 1,
        "name": "Catalogue Entry Name",
        "description": "Catalogue Entry Description",
        "artistId": 1,
        "serviceId": 1,
        "price": 100,
        "beforeImage": "http://example.com/before_image.jpg",
        "afterImage": "http://example.com/after_image.jpg"
    }
}
```

### Get Catalogue Entries

**Endpoint:** `/api/catalogue`

**Method:** `GET`

**Description:** This endpoint allows users to retrieve catalogue entries. Users can filter the results by name, artist ID, service ID, artist name, and service name.

**Query Parameters:**

- `name`: (Optional) The name of the catalogue entry.
- `artistId`: (Optional) The ID of the artist.
- `serviceId`: (Optional) The ID of the service.
- `artistName`: (Optional) The name of the artist.
- `serviceName`: (Optional) The name of the service.

**Responses:**

- `200 OK`: The catalogue entries were successfully retrieved. Returns a success message and the retrieved catalogue entries.
- `500 Internal Server Error`: An error occurred on the server while trying to retrieve the catalogue entries. Returns an error message.

**Example Request:**

```http
GET /api/catalogue?name=Catalogue%20Entry%20Name&artistId=1&serviceId=1&artistName=Artist%20Name&serviceName=Service%20Name
```

### Create an Appointment

**Endpoint:** `/api/appointments`

**Method:** `POST`

**Description:** This endpoint allows an authenticated user to create a new appointment.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Request Body:**

- `serviceId`: The ID of the service for the appointment.
- `artistId`: (Optional) The ID of the artist for the appointment. Required if the user is a customer.
- `date`: The date and time of the appointment.
- `customerId`: (Optional) The ID of the customer for the appointment. Required if the user is an artist.
- `catalogueId`: The ID of the catalogue entry for the appointment.

**Responses:**

- `201 Created`: The appointment was successfully created. Returns a success message and the created appointment.
- `400 Bad Request`: The request body is missing required fields, contains invalid data, or the artist or customer already have an appointment at the same time. Returns an error message.
- `404 Not Found`: The user, artist, service, or catalogue entry with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to create the appointment. Returns an error message.

**Example Request**

```json
header auth
{
    "Authorization": "Bearer your_token_here"
}
body
{
    "serviceId": 1,
    "artistId": 2,
    "date": "2022-12-31T23:59:59Z",
    "catalogueId": 3
}
```

### Update an Appointment

**Endpoint:** `/api/appointments/:id`

**Method:** `PUT`

**Description:** This endpoint allows an authenticated user to update an existing appointment.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the appointment to be updated.

**Request Body:**

- `date`: (Optional) The new date and time of the appointment.
- `artistId`: (Optional) The new ID of the artist for the appointment.
- `serviceId`: (Optional) The new ID of the service for the appointment.
- `catalogueId`: (Optional) The new ID of the catalogue entry for the appointment.

**Responses:**

- `200 OK`: The appointment was successfully updated. Returns a success message and the updated appointment.
- `400 Bad Request`: The request body contains invalid data, the new date is in the past, or the customer or artist already have an appointment at the new time. Returns an error message.
- `403 Forbidden`: The authenticated user is not authorized to update the appointment. Returns an error message.
- `404 Not Found`: The user, artist, service, catalogue entry, or appointment with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to update the appointment. Returns an error message.

**Example Request:**

```json
header auth
{
    "Authorization": "Bearer your_token_here"
}
body
{
    "date": "2022-12-31T23:59:59Z",
    "artistId": 2,
    "serviceId": 1,
    "catalogueId": 3
}
```
### Cancel an Appointment

**Endpoint:** `/api/appointments/:id/cancel`

**Method:** `PUT`

**Description:** This endpoint allows an authenticated user to cancel an existing appointment.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the appointment to be cancelled.

**Responses:**

- `200 OK`: The appointment was successfully cancelled. Returns a success message.
- `403 Forbidden`: The authenticated user is not authorized to cancel the appointment. Returns an error message.
- `404 Not Found`: The user or appointment with the specified ID was not found, or the appointment is not in the "pending" status. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to cancel the appointment. Returns an error message.

**Example Request:**

```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Get Appointments

**Endpoint:** `/api/appointments`

**Method:** `GET`

**Description:** This endpoint allows an authenticated user to retrieve appointments based on various filters.

**Headers:**

- `Authorization`: Bearer token for authenticating the user. This should be included in all requests to this endpoint.

**Query Parameters:**

- `date`: (Optional) The date of the appointments to retrieve.
- `serviceName`: (Optional) The name of the service of the appointments to retrieve.
- `artistName`: (Optional) The name of the artist of the appointments to retrieve.
- `customerName`: (Optional) The name of the customer of the appointments to retrieve.
- `catalogueEntry`: (Optional) The name of the catalogue entry of the appointments to retrieve.

**Responses:**

- `200 OK`: The appointments were successfully retrieved. Returns a success message and the retrieved appointments.
- `400 Bad Request`: The request query contains invalid data, such as an invalid date. Returns an error message.
- `403 Forbidden`: The authenticated user is not authorized to retrieve the appointments. Returns an error message.
- `404 Not Found`: The user, artist, service, or catalogue entry with the specified name was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to retrieve the appointments. Returns an error message.

**Example Request:**

```http
GET /api/appointments?date=2022-12-31&serviceName=Service%20Name&artistName=Artist%20Name&customerName=Customer%20Name&catalogueEntry=Catalogue%20Entry%20Name
```
```json
{
    "Authorization": "Bearer your_token_here"
}
```
### Get an Appointment by ID

**Endpoint:** `/api/appointments/:id`

**Method:** `GET`

**Description:** This endpoint allows an authenticated user to retrieve a specific appointment by its ID.

**Headers:**

- `Authorization`: Bearer token for authentic the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the appointment to be retrieved.

**Responses:**

- `200 OK`: The appointment was successfully retrieved. Returns a success message and the retrieved appointment.
- `404 Not Found`: The user or appointment with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to retrieve the appointment. Returns an error message.

**Example Request:**

```http
GET /api/appointments/1
```
```json
{
    "Authorization": "Bearer your_token_here"
}
```

### Delete an Appointment by ID

**Endpoint:** `/api/appointments/:id`

**Method:** `DELETE`

**Description:** This endpoint allows an authenticated user to delete a specific appointment by its ID.

**Headers:**

- `Authorization`: Bearer token for authentic the user. This should be included in all requests to this endpoint.

**URL Parameters:**

- `id`: The ID of the appointment to be deleted.

**Responses:**

- `200 OK`: The appointment was successfully deleted. Returns a success message.
- `403 Forbidden`: The authenticated user is not authorized to delete the appointment. Returns an error message.
- `404 Not Found`: The user or appointment with the specified ID was not found. Returns an error message.
- `500 Internal Server Error`: An error occurred on the server while trying to delete the appointment. Returns an error message.

**Example Request:**

```http
DELETE /api/appointments/1
```
```json
{
    "Authorization": "Bearer your_token_here"
}
```


</details>

## Roadmap
- finish the endpoints section of the README.
- check update methods have at least 1 param
- allow admins and super_admins to create appointments and users
- move middlewares and helpers onto their own files.
- add an option for random artist on appointment creation and update.
- add an updated_by field to all tables.
- add pagination.
- add a function to auto-update appointment status if their date has already passed.
- implement more conditional checks depending on user calling the endpoint like appointment does.

## Author 

- **Pedro Fernández** - Project Developer
  - [GitHub](https://github.com/Eryhnar) - [LinkedIn](https://www.linkedin.com/in/pedro-fernandez-bel-68a2b9155/)