import dj_database_url  # noqa
from pathlib import Path
from decouple import config
import os
from corsheaders.defaults import default_headers

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

RENDER_EXTERNAL_HOSTNAME = os.getenv('RENDER_EXTERNAL_HOSTNAME', '127.0.0.1')
ALLOWED_HOSTS = ['salsa-backend.onrender.com', '127.0.0.1', 'localhost', 'ed15-66-9-164-229.ngrok-free.app']


ROOT_URLCONF = 'salsa.urls'


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'drf_yasg',
    'django_filters',
    'django_extensions',
    'django_q',
    'events',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    "http://0.0.0.0:5000",
    "http://0.0.0.0:8000",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:8000",
    'http://localhost:5173',  # Add this for Vite
    'http://127.0.0.1:5173',  # Add this for Vite
    'https://salsa-events.netlify.app',
    "https://salsa-frontend.onrender.com",
    'https://ed15-66-9-164-229.ngrok-free.app',
]


#Allow specific headers if needed
CORS_ALLOW_HEADERS = list(default_headers) + [
    'Content-Type',
]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'salsadb',
        'USER': 'abrah926',
        'PASSWORD': 'KEbP5I9Rdj0M9Gh4u13WrkvrMfo9EUKp',
        'HOST': 'dpg-ctippotumphs73f5jbsg-a.virginia-postgres.render.com',
        'PORT': '5432',
    }
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Specify a templates directory
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # Required by Django admin
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

Q_CLUSTER = {
    'name': 'Django-Q',
    'workers': 4,
    'recycle': 500,
    'timeout': 60,  # Execution timeout (seconds)
    'retry': 120,   # Retry interval (must be larger than timeout)
    'compress': True,
    'save_limit': 250,
    'queue_limit': 500,
    'label': 'Django Q',
}


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
