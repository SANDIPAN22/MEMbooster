# Advanced Note-Taking Application

An advanced note-taking application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with TypeScript. This application includes features such as authentication, rich text editing, tagging, and more.


## Features

- User Authentication (JWT & RSA) with access and refresh token
- Forgot password, email verification setup, persistent /non-persistent login
- Create, Read, Update, Delete (CRUD) Notes
- Rich Text Editing
- Tagging and Filtering Notes
- Responsive Design with Material UI with dark and light theme switching
- Type-safe code with TypeScript with custom react hooks
- Code Quality with ESLint, Prettier, and Husky
- Resource validation using Zod
- Utilizing Redux for robust store management

## Local Setup 

1. **Clone the repository:**

  ```sh
   git clone https://github.com/yourusername/advanced-note-taking-app.git
   cd advanced-note-taking-app
  ```
   
2. **Backend setup:**

 ```sh
cd backend-membooster
npm ci
// create the .env file as per the given environment template
npm run locally
```

3. **frontend setup:**

 ```sh
cd frontend-membooster
npm ci --force
// create the .env file as per the given environment template
npm run dev
```

## Git commit 
* As it is a mono-repo, please come back to the root folder before doing any git commit.
* The Git commit command will ask you "Which part of the repo do you want to scan".
* Possible answers will be "back" / "front" / "both".
* As per your answer Eslint and Prettier will do their job to analyze possible errors.

