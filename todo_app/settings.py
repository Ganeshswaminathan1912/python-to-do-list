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