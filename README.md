# Privacy focused framework based on Solid.

In order to setup the project, each of the services must be setup.

-----------------------------------------------------------------------------------------------------------------
# Web services: Auth service, Pod and Third-party.

## Requirements:
Node.js - v8.9.3.
MongoDB - v4.0.5.
@angular/cli - v7.3.


## Database
To setup the database - create 2 databases (this can be done via the MongoDB Compass interface) named: 'pod' and 'oauth'.
Start mongo (Windows Community Edition) in a command prompt.
```
mongod
```

## Back-end
Then to begin each services back-end.
```
npm install
nodemon app.js
```
Run each service in a seperate command prompt.

## Front-end
The Pod and Third-party require a front-end. This is an Angular application.
Open both of the repositories for the front-ends.

Setup the Third-party application.
```
npm install
ng serve
```

The Pod requires a unique port otherwise it will clash with the Third-party.
```
npm install
ng serve --port 4444
```
-------------------------------------------------------------------------------------------------------------
# Fitness App
The repository contains just the source code for the fitness app. It must be built and run within an IDE.

Requirements: Android Studio.

Open the project in Android Studio. 
The ip address must be changed to match the ip for the computer running the web services. Finding this out is
explained below. Once the ip is found - update the ip address located in the activities/charts/ChartActivity.java on line 223. 
Build the application. Connect an android phone to the laptop and then run the application.

------------------------------------------------------------------------------------------------------------
# Establish a connection between mobile and web services
There are alternative ways to do this but below is the manner in which I achieved this.

1. Setup a hotspot on the mobile phone with the fitness app.
2. Connect the computer to the hotspot.
3. On the computer find the ip by running `ipconfig` in a command prompt
4. Find the section titled 'Wireless LAN adapter Wi-Fi'.
5. The ip address to use is the 'IPv4 Address'.
6. Update the ip in the fitness app.
---------------------------------------------------------------------------------------------------------------
# Opening the applications
1. The fitness app is simply opened on the mobile application it has been run on.
2. The pod is accessed by opening http://localhost:4444 in a browser.
3. The third-party is accessed by opening http://localhost:4200 in a browser.



