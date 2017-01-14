from django.conf import settings


def time_range(request):
    times = []
    for time_value in settings.TIME_ORDER:
        times.append((time_value, settings.TIME_RANGE[time_value][1]))

    return {'time_range': times}
