Here's how you can create a To-Do list app using Django and Angular:

## Project Setup

1. **Create a Django Project:**

   ```bash
   django-admin startproject todo_app
   cd todo_app
   ```

2. **Create a Django App:**

   ```bash
   python manage.py startapp tasks
   ```

## Django Backend (API)

1. **`todo_app/settings.py`**: Add `rest_framework` and `corsheaders` (for handling CORS if needed).

   ```python
   INSTALLED_APPS = [
       # ...
       'rest_framework',
       'corsheaders',
       'tasks',  # Add your app
   ]

   MIDDLEWARE = [
       # ...
       'corsheaders.middleware.CorsMiddleware',
       # ...
   ]

   CORS_ORIGIN_ALLOW_ALL = True  # For development. Configure this properly in production.
   ```

2. **`tasks/models.py`**: Define the Task model.

   ```python
   from django.db import models

   class Task(models.Model):
       title = models.CharField(max_length=200)
       completed = models.BooleanField(default=False)

       def __str__(self):
           return self.title
   ```

3. **`tasks/serializers.py`**: Create a serializer for the Task model.

   ```python
   from rest_framework import serializers
   from .models import Task

   class TaskSerializer(serializers.ModelSerializer):
       class Meta:
           model = Task
           fields = ['id', 'title', 'completed']
   ```

4. **`tasks/views.py`**: Create API views for CRUD operations.

   ```python
   from rest_framework import viewsets
   from .models import Task
   from .serializers import TaskSerializer

   class TaskViewSet(viewsets.ModelViewSet):
       queryset = Task.objects.all()
       serializer_class = TaskSerializer
   ```

5. **`todo_app/urls.py`**: Include the API routes.

   ```python
   from django.contrib import admin
   from django.urls import path, include
   from rest_framework import routers
   from tasks import views

   router = routers.DefaultRouter()
   router.register(r'tasks', views.TaskViewSet)

   urlpatterns = [
       path('admin/', admin.site.urls),
       path('api/', include(router.urls)),  # API routes
   ]
   ```

6. **Migrate Database & Run Server:**

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py runserver
   ```

## Angular Frontend

1. **Create Angular Project (outside the Django directory):**

   ```bash
   ng new todo-frontend
   cd todo-frontend
   ```

2. **Install Necessary Packages:**

   ```bash
   npm install @angular/material @angular/cdk @angular/animations --save 
   ```

3. **Create Components (e.g., `task-list`, `task-form`) and Services:**
   ```bash
   ng generate component task-list
   ng generate component task-form
   ng generate service task 
   ```

4. **`src/app/task.service.ts`**: Create a service to interact with the Django API.

   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';

   interface Task {
     id: number;
     title: string;
     completed: boolean;
   }

   @Injectable({ providedIn: 'root' })
   export class TaskService {
     private apiUrl = 'http://localhost:8000/api/tasks/'; // Adjust if needed

     constructor(private http: HttpClient) {}

     getTasks(): Observable<Task[]> {
       return this.http.get<Task[]>(this.apiUrl);
     }

     addTask(task: Task): Observable<Task> {
       return this.http.post<Task>(this.apiUrl, task); 
     }

     updateTask(task: Task): Observable<Task> { 
       const url = `${this.apiUrl}${task.id}/`; 
       return this.http.put<Task>(url, task); 
     } 

     deleteTask(id: number): Observable<any> {
       const url = `${this.apiUrl}${id}/`; 
       return