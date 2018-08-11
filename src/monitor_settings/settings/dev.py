from monitor_settings.settings.base import *  # NOQA (ignore all errors on this line)


DEBUG = True

PAGE_CACHE_SECONDS = 1

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'monitor',
        'STORAGE_ENGINE': 'MyISAM / INNODB / ETC',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'sql_mode': 'TRADITIONAL',
            'charset': 'utf8',
            'init_command': 'SET '
                # 'storage_engine=INNODB,'
                'character_set_connection=utf8,'
                'collation_connection=utf8_bin'
        }
    },
    #'supervision': {
    #    'ENGINE': 'django.db.backends.mysql',
    #    'NAME': 'supervision',
    #    'STORAGE_ENGINE': 'MyISAM / INNODB / ETC',
    #    'USER': 'root',
    #    'PASSWORD': 'root',
    #    'HOST': '127.0.0.1',
     #   'PORT': '3306',
     #   'OPTIONS': {
     #       'sql_mode': 'TRADITIONAL',
     #       'charset': 'utf8',
     #       'init_command': 'SET '
     #           # 'storage_engine=INNODB,'
     #           'character_set_connection=utf8,'
     #           'collation_connection=utf8_bin'
      #  }
    #}
}

#DATABASE_ROUTERS = ['monitor_settings.database_router.DatabaseAppsRouter']
#DATABASE_APPS_MAPPING = {
#    'data_mining': 'supervision',
#}

REST_FRAMEWORK['EXCEPTION_HANDLER'] = 'django_rest_logger.handlers.rest_exception_handler'  # NOQA (ignore all errors on this line)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'DEBUG',
        'handlers': ['django_rest_logger_handler'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s '
                      '%(process)d %(thread)d %(message)s'
        },
    },
    'handlers': {
        'django_rest_logger_handler': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
        'django_rest_logger': {
            'level': 'DEBUG',
            'handlers': ['django_rest_logger_handler'],
            'propagate': False,
        },
    },
}

DEFAULT_LOGGER = 'django_rest_logger'

LOGGER_EXCEPTION = DEFAULT_LOGGER
LOGGER_ERROR = DEFAULT_LOGGER
LOGGER_WARNING = DEFAULT_LOGGER
