## ReadMe
The Movie API is a web application that provides an API for managing movie data. It allows users to perform various operations such as browsing movies, adding movies to their favorites list, and searching for movies by genre, director, and actors.

**Table of Contents**
•	Built With
•	Getting Started
•	Prerequisites
•	Installation
•	Usage
•	API Endpoints
•	Contributing
•	License
•	Contact
•	Built With
## The Movie API is built using the following technologies:
Node.js
Express.js
MongoDB
Mongoose
React
Passport.js
bcrypt
JSON Web Tokens (JWT)
Getting Started
To run the Movie API locally, follow these steps:

## Prerequisites
**Make sure you have the following software installed on your machine:**

•	Node.js (with npm)
•	MongoDB
Installation
1.	Clone the repository:
git clone https://github.com/jmahanera/Movie_api.gitgit clone https://github.com/jmahanera/Movie_api.git
1.	Navigate to the project folder:
cd Movie_api
1.	Install dependencies:
npm install
1.	Set up environment variables:
Create a .env file in the root folder and add the following:
MOVIES_URI=const uri = 'mongodb+srv://jula:Myaccount1@moviecluster.1wliibn.mongodb.net/mymoviesDB?retryWrites=true&w=majority'; // Replaced with my MongoDB connection string
mongoose.connect(process.env.MOVIES_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
JWT_SECRET=your_jwt_secret

## 1.	Start the server:
npm start
Usage
Once the server is running, the Movie API will be accessible at http://localhost:3000. The API provides various endpoints to interact with movie data, including browsing movies, adding movies to favorites, and searching for movies by different criteria.



## API Endpoints
**Here are some of the main API endpoints:**

GET /movies: Get a list of all movies.
GET /movies/:id: Get details of a specific movie by ID.
POST /movies: Add a new movie.
PUT /movies/:id: Update details of a specific movie by ID.
DELETE /movies/:id: Delete a movie by ID.
GET /users/: Get the list of all users in the database.
POST /favorites/:id: Add a movie to favorites for the authenticated user.
DELETE /favorites/:id: Remove a movie from favorites for the authenticated user.
Please refer to the source code and documentation for a complete list of API endpoints and their usage.


## Contributing
Contributions to the Movie API are welcome! If you have any suggestions or improvements, feel free to fork the repository, make changes, and submit a pull request.

## License
This project is licensed under the CF License. See the LICENSE.txt file for details.

## Contact
For any inquiries or questions, please contact Jula Mahanera.

Project Link: https://github.com/jmahanera/Movie_api
