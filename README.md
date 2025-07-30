# Job Application Backend (MVP)

A backend for a job application platform featuring:
- JWT Authentication
- OAuth (Google)
- File uploads (resume)
- Mongoose populate
- HTTPS-ready
- CORS
- Modular MVC structure

## Getting Started
1. Clone and install dependencies
2. Set up `.env` file
3. Run with `nodemon app.js` or `node app.js`

## Tech Stack
- Node.js / Express
- MongoDB / Mongoose
- Passport.js
- Multer

## License
MIT

API Endpoints
Auth Endpoints
Method	URL	Description	Auth Needed
POST	/api/auth/register	        Register a new user
POST	/api/auth/login	            User login (returns JWT)

User Endpoints
Method	URL	Description	Auth Needed
GET	/api/users/me	                Get current user	    Yes (JWT)

Job Endpoints
Method	URL	Description	Auth Needed
GET	/api/jobs	                    List all job postings	
POST    /api/jobs	                Create new job posting	Yes (JWT)
GET	/api/jobs/:id	                Get a specific job post	

Application Endpoints
Method	URL	Description	Auth Needed
POST	/api/applications	        Apply for a job (upload resume)	Yes (JWT)
GET	/api/applications/user/:id	    Get applications for user	Yes (JWT)