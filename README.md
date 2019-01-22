# This Project use Docker to run the application

## Go to your working directory and run the following command

The -t tag lets you tag your images so it's easier to find later using the docker images command:

````
docker build -t <your username>/node-web-app .
````
  
Running your image with -d runs the container in detached mode, leaving the container running in the background.

The -p flag redirects a public port to a private port inside the container.
````
docker run -p 49160:8080 -d <your username>/node-web-app
````

If you need to go inside the container you can use the exec command:

````
$ docker exec -it <container id> /bin/bash
````
See the list of running container

````
$ docker ps
````

Other docker commands
````
# Get container ID

$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080
````