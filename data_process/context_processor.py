from django.conf import settings


def time_range(request):
    times = sorted(settings.TIME_RANGE.iteritems(), key=lambda item: item[1][0])

    return {'time_range': times}
