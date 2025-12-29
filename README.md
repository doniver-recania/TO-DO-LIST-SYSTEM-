# TO-DO-LIST-SYSTEM-
Name: Doniver D. Recania
Section: BSCS 2A
Subjects: DC 101 and CC 105
2025

Title: To-Do List

Introduction
This project is a web-based Task List Management System developed and built using MySQL for database management and HTML, CSS, JavaScript, and PHP for the web interface. It allows users to manage tasks efficiently while keeping a complete activity history for tracking and accountability.



1. Project Concept

Real-World Problem
People often forget tasks, lose track of completed work, and have no record of past actions. Traditional to-do lists usually lack tracking features and do not show what actions were performed over time.

Proposed Solution
This project implements a Task List Management System that allows users to:
- Add tasks  
- Mark tasks as done or pending  
- Favorite important tasks  
- Delete tasks  
- Track all actions through a history log  

Why the System is Useful
- Helps users organize daily activities  
- Favorite tasks highlight priorities  
- History logs provide accountability and transparency  


2. Database Design (MySQL)
The system uses three related tables with proper normalization, primary keys, and foreign key constraints.

ER Diagram
An ER diagram was created showing the relationship between tasks, history, and favorites tables. One task can have multiple history records, and a task may have zero or one favorite record. History records remain even after a task is deleted.

Tables Overview

1. tasks
   
| Column     | Description    
| ---------- | -------------- 
| id (PK)    | Unique task ID 
| title      | Task name      
| status     | pending / done 
| created_at | Creation time  

2. history
   
| Column                 | Description                        
| ---------------------- | ---------------------------------- 
| id (PK)                | History log ID                     
| task_id (FK, nullable) | Related task                       
| action                 | Added, Updated, Deleted, Favorited 
| title                  | Task title snapshot                
| status                 | Task status                        
| timestamp              | Action time                       
 
3. favorites
   
| Column       | Description    
| ------------ | -------------- 
| id (PK)      | Favorite ID    
| task_id (FK) | Linked task    
| favorited_at | Date favorited 

Primary Keys and Foreign Keys

- `tasks.id` → Primary Key  
- `history.task_id` → Foreign Key → `tasks.id` (ON DELETE SET NULL)  
- `favorites.task_id` → Foreign Key → `tasks.id` (ON DELETE CASCADE)  

This design ensures referential integrity, proper normalization, and history preservation even after task deletion.

Sample Data with Task for Example
Sample tasks such as Finish assignment, Buy groceries, and Study for exam were added to demonstrate the system. Actions like updating status, favoriting, unfavoriting, and deleting tasks were performed to populate the history table.

CRUD Operations
All CRUD operations are implemented:
- Create – Add task  
- Read – Load tasks, favorites, and history  
- Update – Update task status  
- Delete – Delete task (history remains)  



3. Web Development (HTML, CSS, JavaScript)

Technologies Programming Language Used
HTML – Structure of the web pages  
CSS – Styling and layout  
JavaScript – Interactivity and dynamic updates  
PHP – Server-side logic  
MySQL – Database management  

Features Implemented
- Task input form  
- Dynamic task list  
- Favorite toggle (highlight important tasks)  
- Status toggle (mark done / pending)  
- Delete task option  
- History panel  
- Favorite tasks panel  
- Context menu action for deleting history logs  

JavaScript Interactivity

The system uses JavaScript for:
- Dynamic DOM manipulation  
- Fetch API (AJAX) for server communication  
- Button interactions  
- Real-time updates without page reload  



 4. System Functionality

The system allows users to:

- Add new tasks  
- View existing tasks  
- Edit task status  
- Delete tasks  
- Favorite and unfavorite tasks  
- View complete activity history  
- See icons or status change dynamically based on actions  

  Extra Feature

- History preservation after deletion (Audit Trail) – All task actions remain visible in history even if the task is deleted.  



5. Challenges and Learning

One of the main challenges was maintaining history records even after a task was deleted while still enforcing foreign key constraints. Another challenge was implementing the favorite and unfavorite logic correctly and ensuring the status updates were reflected accurately in the history panel. Through this project, I learned how to integrate MySQL, PHP, and JavaScript, design normalized databases, and build dynamic web applications using the Fetch API.



6. Screenshots

Screenshots are included showing in other folder:

- Dashboard of To-Do Task
- Task list interface  
- Favorite tasks panel  
- Activity history log  
- Database tables in phpMyAdmin  

---

Conclusion

This Task List Management System successfully integrates database management and web development concepts. It meets all the requirements of this project by providing a functional, interactive, and well-structured system with proper documentation and database design.
