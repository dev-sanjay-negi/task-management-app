# Task management app 
https://task-management-app-demo.netlify.app/

This web app is created using react-js and json-server for database. You can easily add,delete,update and view tasks.For better management, you can use filters and search. To check the full details of a particular task, you can go through the "check full details" link on the card.

# Deployment
The front-end (reactJS) is deployed live on the Netlify at (https://task-management-app-demo.netlify.app/)

The database is deployed on the glitch.me at (https://task-db.glitch.me/data)

# CRUD Operations (Endpoints)
-- GET - https://task-db.glitch.me/data 

-- POST - https://task-db.glitch.me/data

-- PUT - https://task-db.glitch.me/data/${id} (replace id with the task_ID) { https://task-db.glitch.me/data/1 }

-- DELETE - https://task-db.glitch.me/data/${id} (replace id with the task_ID) { https://task-db.glitch.me/data/18 }

# Database
To view the database, please refer to https://task-db.glitch.me/data.

Database repository can be found at https://github.com/dev-sanjay-negi/task-management-database

## Database schema

```
 {
    "id": "11", 
    "task_title": "Implement payment gateway integration",
    "task_desc": "Integrate payment gateway for accepting online payments in the application.",
    "task_duedate": "2024-04-15",
    "task_priority": "high",
    "task_assgined_to": "Olivia Martin",
    "task_tags": "payment integration, frontend, backend, finance",
    "task_status": "pending",
    "created_at": "2024-03-11T11:55:00",
    "updated_at": "2024-03-11T11:55:00"
  }

```
# Packages
- Bootstrap (grid)
- react-bootstrap (modal and offcontainer canvas)
- react-toastify (notifications)
- Formik (form handling)
- Json server (hosting database on local server)
- axios (server requests)
- yup (form validation)
  
