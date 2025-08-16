A full-stack Quiz Web Application built with Node.js, Express.js, EJS, and PostgreSQL.
Users can register, take quizzes, view results, and admins can manage quizzes and track performance.

🚀 Features

🔐 User authentication (students & admin)

📝 Take quizzes with multiple-choice questions

📊 View results & track past attempts

🎓 Admin panel to manage quizzes & monitor performance

💬 Student feedback collection

🛡 Secure with bcrypt, sessions, helmet & CSRF protection

🛠 Tech Stack

Backend: Node.js, Express.js

Database: PostgreSQL

Frontend: EJS + TailwindCSS

Auth & Security: bcrypt, express-session, connect-pg-simple, helmet, csurf

Validation & Utils: express-validator, dotenv, morgan

⚡ Setup

Clone repo & install dependencies:

git clone https://github.com/your-username/quiz-website.git
cd quiz-website
npm install


Setup PostgreSQL & run schema.sql.

Create .env:

DATABASE_URL=postgres://user:password@localhost:5432/quizdb
SESSION_SECRET=your_secret
PORT=5000


Run app:

npm run dev


Visit → http://localhost:5000

📂 Main Tables

users → user accounts (student/admin)

quizzes → quiz info

questions → linked to quizzes

attempts → user scores

feedback → suggestions from students

session → login sessions

🌐 Deployment

Backend: Heroku / Render / Railway

DB: PostgreSQL (cloud or local)

📜 License

MIT License.
