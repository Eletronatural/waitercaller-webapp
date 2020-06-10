# waitercaller-webapp
The web page for monitoring push botton events

Running MOSQUITTO MQTT Server local container:

```cd ~/tmp```

```mkdir mosquitto```

```cp src/conf/external/mosquitto.conf ~/tmp/mosquitto```

```cp src/conf/external/pwfile ~/tmp/mosquitto```

If you have not pulled mosquitto image, do this: ```docker pull eclipse-mosquitto```

```docker run --name mqtt_server -d --restart=always -p 1883:1883 -p 1884:1884 -p 9001:9001 -v ~/tmp/mosquitto:/mosquitto/config:ro eclipse-mosquitto```

If you have not builded waitercaller image, do this: 

```cd <waitercaller-project-directory```

```docker build -t eletronatural/waitercaller .```

And create and run a container:

```docker run -d --name waitercaller --network="host" --restart=always eletronatural/waitercaller:latest```
