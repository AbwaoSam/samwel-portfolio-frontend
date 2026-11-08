# Samwel Abwao — Portfolio Frontend

A modern, editorial-style personal portfolio built to showcase my software engineering skills, projects, and experience. This is the React frontend for the application, designed to be visually striking, highly responsive, and fully dynamic.

🔗 **Live Site:** [https://samwel-abwao.vercel.app/](https://samwel-abwao.vercel.app/)

##  Features

- **Dynamic Project Showcase:** Projects are fetched directly from a MongoDB database via a custom Node.js API.
- **AI Assistant:** A custom floating chatbot integrated with the OpenAI API (`gpt-5.4-mini`) that answers questions about my skills, background, and experience.
- **Contact Form:** A fully functional contact form that sends emails directly to my inbox using the Resend API.
- **Admin Dashboard:** A hidden, password-protected route (`/admin`) that allows me to add and delete projects without touching the code.
- **Fully Responsive:** Carefully crafted mobile-first design with a custom hamburger menu, responsive grids, and smooth scrolling.
- **Modern Animations:** Subtle, high-performance animations using Framer Motion.

##  Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Custom editorial design)
- Framer Motion (Animations)
- React Router (For the hidden `/admin` dashboard)
- React Icons

**Backend (Separate Repo):**
- Node.js & Express
- MongoDB & Mongoose
- OpenAI API
- Resend (Email API)

##  Getting Started (Local Development)

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/AbwaoSam/samwel-portfolio-frontend.git
cd samwel-portfolio-frontend
```

### 2.  Install dependencies
```bash
npm install
```
### 3. Set up Environment Variables
Create a .env file in the root directory. Because the backend is deployed on Render, the frontend currently points directly to the live API. If you are running the backend locally, you will need to update the fetch URLs in App.jsx and Admin.jsx to point to http://localhost:5000.

### 4.  Run the development server
```bash
npm run dev
```


