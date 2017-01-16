## 环境搭建 && 依赖

以ubuntu14.04为例

1. mysql  <br>
    python-mysql所需要的`mysql_config`文件在`libmysqlclient-dev`库里

    ```sh
    sudo apt-get install mysql-server-5.5 libmysqlclient-dev
    ```

2. redis  <br>
    ```sh
    sudo apt-get install redis-server
    ```

3. rrdtool  <br>
    ubuntu14.04源中`rrdtool`是1.4.7版本,默认的api不是线程安全的,所以用源码安装1.6.0版本
    * 先安装`rrdtool`开发包,里面包含了源码安装所需要的依赖包
        ```sh
        sudo apt-get install librrd-dev
        ```

    * 下载源码
        ```sh
        wget http://oss.oetiker.ch/rrdtool/pub/rrdtool-1.6.0.tar.gz
        ```

    * 解压并安装,安装需要`sudo`权限
        ```sh
        ./configure && make && make install
        ```

    * 进行软连接,之前已经有的要先`rm`
        ```sh
        sudo ln -s /opt/rrdtool-1.6.0/bin/rrdtool /usr/bin
        sudo ln -s /opt/rrdtool-1.6.0/lib/librrd.so /usr/lib
        sudo ln -s /opt/rrdtool-1.6.0/lib/librrd.so.8 /usr/lib
        ```

4. python
    * python相关的依赖包用`pip`安装
        ```sh
        sudo apt-get install python-pip python-dev
        ```

    * 搭建虚拟环境   <br>
        可以搭建多个互不干扰的开发环境
        ```sh
        sudo pip install virtualenv virtualenvwrapper
        ```

        在`.bashrc`后再入
        ```sh
        export WORKON_HOME=$HOME/.virtualenvs
        export PROJECT_HOME=$HOME/workspace
        source /usr/local/bin/virtualenvwrapper.sh
        ```

        使其生效
        ```sh
        source .bashrc
        ```

        可以创建一个虚拟环境,在虚拟环境中安装依赖包
        ```sh
        # 创建运行环境server
        mkvirtualenv server
        # 切换到环境server
        workon server
        #退出环境
        deactivate
        ```

    * 安装依赖包  <br>
        `requirements.txt`在项目中
        ``` sh
        pip install -r requirements.txt
        ```

5. 服务器  <br>
    可以先用`django`的测试服务器进行开发

## django

1. 创建数据库与表  <br>
    先在mysql中创建`monitor`数据库,再通过`django`同步表,工作目录为与`manage.py`同级
    ``` sh
    create database monitor;


    python manage.py makemigrations
    python manage.py makemigrations data_process
    python manage.py migrate
    ```

2. 开启开发用测试服务器
    ``` sh
    python manage.py runserver
    ```

## celery
一些异步任务和周期任务可以通过`celery`执行,现在监听客户端的TCP服务端就用`celery`执行

1. 使用方法  <br>
    一般的使用方法为把需要异步或者耗时的操作函数放在`task.py`中,并使用`@shared_task`装饰器,以便注册到`celery`.需要调用的时候,把该函数`import`并用`delay()`调用,需要进行周期调用的则加入到`celery.py`中`beat_schedule`字典中
2. 启动`celery`  <br>
    需要使用`scapy`的时候需要`sudo`权限
    
    ``` sh
    celery -A monitor worker -B -l info
    ```














