📚 Course Selling App - Backend
This is the backend for a course-selling platform built using Node.js, Express, and MongoDB. It allows admins to create courses and users to sign up, purchase, and view courses.

⚙️ Tech Stack
Backend Framework: Node.js + Express.js

Database: MongoDB (with Mongoose ODM)

Authentication: JWT (JSON Web Tokens)

Validation: Zod 

Environment Variables: Managed via .env

Deployment: Ready for platforms like Render, Railway, or Vercel functions

🚀 Features

👨‍🏫 Admin:
POST /admin/signup – Admin registration

POST /admin/signin – Admin login

POST /admin/courses – Create a new course

GET /admin/courses – Get all created courses

👨‍🎓 User:
POST /user/signup – User registration

POST /user/signin – User login

GET /user/courses – View all available courses

POST /user/purchase – Purchase a course

GET /user/purchases – View purchased courses

🔐 Authentication
JWT tokens are issued on login (/signin) and must be sent in headers as:
token: token

Use adminMiddleware and userMiddleware to protect routes

🌱 Environment Variables (.env)
env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/yourdb
JWT_ADMIN_SECRET=youradminjwtsecret
JWT_USER_SECRET=youruserjwtsecret
Note: Keep .env in .gitignore

🛠️ Setup Instructions

git clone https://github.com/Saikrishna2k05/Course-selling-app-Backend-.git
cd Course-selling-app-Backend-
npm install
Add your own .env file with appropriate values

Start the server:

node server.js
✅ To Do
✅ Add role-based auth middleware

✅ Purchase system

⏳ Add course ratings/reviews

⏳ Add Razorpay/Stripe payment integration
