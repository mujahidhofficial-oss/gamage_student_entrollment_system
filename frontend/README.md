# Student Enrollment System (Full Stack)

A simple **full stack CRUD** application to manage student enrollments using:
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)

## Feartures 
✅ Add Student (with validation)  
✅ View Students list  
✅ Update Student  
✅ Delete Student  
✅ Search by **name**  
✅ Filter by **course**  
✅ Highlight **Pending** students  
✅ Error handling with try/catch (API)

## Validation Rules
- `name` is required  
- `email` must be a valid email format  
- `phone` must be **10 digits**  
- `course` is required  
- `status` is required  

## API Endpoints (Backend)
Base URL: `http://localhost:5000`

- **GET** `/students` → return all students  
- **POST** `/students` → create a student  
- **PUT** `/students/:id` → update a student by id  
- **DELETE** `/students/:id` → delete a student by id  

### Example POST body
```json
{
  "name": "Mujahidh",
  "email": "mujahidh@test.com",
  "phone": "0771234567",
  "course": "Full Stack",
  "status": "Pending"
}


## Project folder struture

student-enrollment-system/
  backend/
    src/
      config/
      controllers/
      models/
      routes/
    server.js
    .env
  frontend/
    src/
      api/
      components/
      pages/
    vite.config.js


