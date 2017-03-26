# -*- coding: UTF-8 -*-
import os
import rrdtool
import time
import threading
import traceback
from django.conf import settings

lock = threading.Lock()


def xport(host):
    rrd_dir = settings.RRD_DIR

    try:
        print rrdtool.xport("DEF:a=%s/%s/cpu_wio.rrd:sum:AVERAGE" % (rrd_dir, host),
                            'XPORT:a:"out bytes"', '--json')
    except rrdtool.OperationalError, e:
        print str(e)



def get_grapn_command(graph_type, title, color, max_title_size, def_name):
    def_pos = def_name + '_pos'
    def_last = def_name + '_last'
    def_min = def_name + '_min'
    def_avg = def_name + '_avg'
    def_max = def_name + '_max'
    command = [
        str('%s:%s#%s:%-*s' % (graph_type, def_name, color, max_title_size, title)),
        str('CDEF:%s=%s,0,INF,LIMIT' % (def_pos, def_name)),
        str('VDEF:%s=%s,LAST' % (def_last, def_pos)), str('VDEF:%s=%s,MINIMUM' % (def_min, def_pos)),
        str('VDEF:%s=%s,AVERAGE' % (def_avg, def_pos)), str('VDEF:%s=%s,MAXIMUM' % (def_max, def_pos)),
        str('GPRINT:%s:Now\:%%5.1lf%%s' % def_last), str('GPRINT:%s:Min\:%%5.1lf%%s' % def_min),
        str('GPRINT:%s:Avg\:%%5.1lf%%s' % def_avg), str('GPRINT:%s:Max\:%%5.1lf%%s\l' % def_max)
    ]

    return command


def get_net_graph_command(host, time_range):
    rrd_dir = settings.RRD_DIR
    command = [
        '--title', str(host + ' Network last ' + time_range),
        '--vertical-label', 'Bytes/sec',
        '--lower-limit', '0', '--slope-mode',
        str('DEF:a0=%s/%s/bytes_in.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:a1=%s/%s/bytes_out.rrd:sum:AVERAGE' % (rrd_dir, host)),
    ]
    command.extend(get_grapn_command('LINE2', 'In', '33cc33', 4, 'a0'))
    command.extend(get_grapn_command('LINE2', 'Out', '5555cc', 4, 'a1'))

    return command


def get_cpu_graph_command(host, time_range):
    rrd_dir = settings.RRD_DIR

    command = [
        '--title', str(host + ' cpu last ' + time_range),
        '--vertical-label', 'Percent',
        '--lower-limit', '0', '--upper-limit', '100',
        '--slope-mode', '--font', 'LEGEND:7', '--rigid',
        str('DEF:cpu_user=%s/%s/cpu_user.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_system=%s/%s/cpu_system.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_idle=%s/%s/cpu_idle.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_wio=%s/%s/cpu_wio.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_nice=%s/%s/cpu_nice.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_steal=%s/%s/cpu_steal.rrd:sum:AVERAGE' % (rrd_dir, host)),
        str('DEF:cpu_sintr=%s/%s/cpu_sintr.rrd:sum:AVERAGE' % (rrd_dir, host)),
    ]

    command.extend(get_grapn_command('AREA', 'User', '3333bb', 6, 'cpu_user'))
    command.extend(get_grapn_command('STACK', 'Nice', 'ffea00', 6, 'cpu_nice'))
    command.extend(get_grapn_command('STACK', 'Sytem', 'dd0000', 6, 'cpu_system'))
    command.extend(get_grapn_command('STACK', 'Wait', 'ff8a60', 6, 'cpu_wio'))
    command.extend(get_grapn_command('STACK', 'Steal', '990099', 6, 'cpu_steal'))
    command.extend(get_grapn_command('STACK', 'Sintr', '009933', 6, 'cpu_sintr'))
    command.extend(get_grapn_command('STACK', 'Idle', 'e2e2f2', 6, 'cpu_idle'))

    return command


def get_mem_graph_command(host, time_range):
    rrd_dir = settings.RRD_DIR
    command = [
        '--title', str(host + ' Memory last ' + time_range),
        '--vertical-label', 'Bytes',
        '--lower-limit', '0', '--base', '1024',
        '--slope-mode', '--font', 'LEGEND:7',
        str('DEF:mem_shared=%s/%s/mem_shared.rrd:sum:AVERAGE' % (rrd_dir, host)),
        'CDEF:bmem_shared=mem_shared,1024,*',
        str('DEF:mem_buffers=%s/%s/mem_buffers.rrd:sum:AVERAGE' % (rrd_dir, host)),
        'CDEF:bmem_buffers=mem_buffers,1024,*',
        str('DEF:mem_total=%s/%s/mem_total.rrd:sum:AVERAGE' % (rrd_dir, host)),
        'CDEF:bmem_total=mem_total,1024,*',
        str('DEF:mem_free=%s/%s/mem_free.rrd:sum:AVERAGE' % (rrd_dir, host)),
        'CDEF:bmem_free=mem_free,1024,*',
        str('DEF:mem_cached=%s/%s/mem_cached.rrd:sum:AVERAGE' % (rrd_dir, host)),
        'CDEF:bmem_cached=mem_cached,1024,*',
        'CDEF:mem_used=bmem_total,bmem_free,-,bmem_cached,-,bmem_buffers,-,bmem_shared,-',
    ]
    command.extend(get_grapn_command('AREA', 'Used', '5555cc', 7, 'mem_used'))
    command.extend(get_grapn_command('STACK', 'Shared', '0000aa', 7, 'bmem_shared'))
    command.extend(get_grapn_command('STACK', 'Cached', '33cc33', 7, 'bmem_cached'))
    command.extend(get_grapn_command('STACK', 'Buffers', '99ff33', 7, 'bmem_buffers'))
    command.extend(get_grapn_command('STACK', 'Free', 'f0ffc0', 7, 'bmem_free'))
    command.extend(get_grapn_command('LINE2', 'Total', 'ff0000', 7, 'bmem_total'))

    return command


fun_dict = {
    'net': get_net_graph_command,
    'cpu': get_cpu_graph_command,
    'mem': get_mem_graph_command,
}


def graph_rrd(host, metric_name, time_range, size):
    time_dict = settings.TIME_RANGE
    size_dict = settings.GRAPH_SIZE
    if metric_name in fun_dict and host:
        if time_range in time_dict:
            start = time_dict[time_range]
        else:
            start = time_dict['hour']
            time_range = 'hour'

        if size in size_dict:
            graph_size = size_dict[size]
        else:
            graph_size = size_dict['default']

        command = [
            '-', '--start', '-' + str(start[0]) + 's', '--end', 'now',
            '--width', str(graph_size[0]), '--height', str(graph_size[1])
        ]
        command += fun_dict[metric_name](host, time_range)
        # print command

        try:
            lock.acquire()
            graph = rrdtool.graphv(command)
            lock.release()
            return graph['image']
        except rrdtool.OperationalError, e:
            lock.release()
            print str(e)


def fetch_rrd(host, metric_name, time_range, end=None, resolution=1):
    rrd_dir = settings.RRD_DIR
    time_dict = settings.TIME_RANGE
    if time_range in time_dict:
        start = time_dict[time_range]

        if end is None:
            end = int(time.time())

        end -= end % resolution

        time_span, ds, values = rrdtool.fetch(str('%s/%s/%s.rrd' % (rrd_dir, host, metric_name)), 'AVERAGE',
                                             '-s', '-' + str(start[0]) + 's', '-e', str(end), '-r', str(resolution))

        ts_start, ts_end, ts_res = time_span
        times = range(ts_start, ts_end, ts_res)

        index = ds.index('sum')

        values = zip(*values)[index]
        return zip(times, values)


def create_rrd(rrd_name, ds_type, is_summary, step, process_time):
    argv = [rrd_name, '--step', step, '--start', process_time]

    heart_beat = int(step) * 2
    ds_sum = 'DS:sum:%s:%d:U:U' % (ds_type, heart_beat)
    argv.append(ds_sum)

    if is_summary:
        ds_num = 'DS:num:GAUGE:%d:U:U' % heart_beat
        argv.append(ds_num)

    argv.append('RRA:AVERAGE:0.5:1:5856')
    argv.append('RRA:AVERAGE:0.5:4:20160')
    argv.append('RRA:AVERAGE:0.5:40:52704')

    print 'create', argv
    # lock.acquire()
    rrd = rrdtool.create(argv)
    # lock.release()
    if rrd:
        print()


def update_rrd(rrd_name, value, num, process_time):
    if num > 1:
        argv = [rrd_name, '%s:%s:%d' % (process_time, value, num)]
    else:
        argv = [rrd_name, '%s:%s' % (process_time, value)]

    # print 'update', argv
    # lock.acquire()
    try:
        update = rrdtool.updatev(argv)
    except rrdtool.OperationalError, e:
        print(e)

    # lock.release()
        # print(update)


def push_to_rrd(rrd_name, value, num, ds_type, step, process_time):
    is_summary = True if num > 1 else False

    if os.path.exists(rrd_name):
        update_rrd(rrd_name, value, num, process_time)
    else:
        create_rrd(rrd_name, ds_type, is_summary, step, process_time)


def write_to_rrd(host, metric, value, num, ds_type, step, process_time):
    rrd_name = settings.RRD_DIR

    if host:
        rrd_name += ('/' + host)
    else:
        rrd_name += '/summary'

    if not os.path.exists(rrd_name):
        os.makedirs(rrd_name, 0755)
    if metric:
        rrd_name += ('/' + metric + '.rrd')
    else:
        print(u'lost metric!')
        return

    push_to_rrd(rrd_name, value, num, ds_type, step, process_time)
