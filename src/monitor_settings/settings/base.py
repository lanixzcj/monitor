# -*- coding: UTF-8 -*-
"""Django settings for monitor_settings project."""

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))  # remove /sswmain/settings to get base folder

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ajsdgas7&*kosdsa21[]jaksdhlka-;kmcv8l$#diepsm8&ah^'

DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.admin',

    'rest_framework',
    'rest_framework.authtoken',
    'django_extensions',

    'accounts',
    'base',
    'monitor',
)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'monitor_settings.urls'

WSGI_APPLICATION = 'monitor_settings.wsgi.application'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = 'accounts.User'

ACCOUNT_ACTIVATION_DAYS = 7  # days

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static_root')
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static_dist'),
)

# store static files locally and serve with whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ############# REST FRAMEWORK ###################

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ),
}

# ############ REST KNOX ########################
REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'USER_SERIALIZER': 'knox.serializers.UserSerializer'
}

# TIME_RANGE

TIME_RANGE = {
    'hour': (3600, u'小时'),
    '2hr': (7200, u'2小时'),
    '4hr': (14400, u'4小时'),
    'day': (86400, u'1天'),
    'week': (604800, u'1周'),
    'month': (2419200, u'1月'),
    'year': (31449600, u'1年'),
}


# graph size: tuple of width, height
GRAPH_SIZE = {
    'small': (200, 65),
    'medium': (300, 95),
    'large': (480, 150),
    'xlarge': (650, 300),
    'default': (400, 125)
}

# gateway ip
GATEWAY_IP = '192.168.3.254'
INTERFACE = 'ens33'

# net threshold(KB)
BYTES_IN = 2000
BYTES_OUT = 500

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
RRD_DIR = os.path.join(BASE_DIR, 'rrd')

# MIDDLEWARE

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

## CORS
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

CACHES = {
    'default': {
        'BACKEND': 'redis_cache.RedisCache',
        'LOCATION': 'localhost:6379',
    },
}

# email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.163.com'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'monitor_platform@163.com'
EMAIL_HOST_PASSWORD = 'zcj654321'
DEFAULT_FROM_EMAIL = 'monitor_platform@163.com'

# celery
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'