# PERN-Docker-Project - ED Server branch

A nodejs backend meant to service and manage concurrent edge devices, cleaned up version of rabbitmq-to-threejs_project branch.
This branch is part of a proof of concept implementation that shows inter-project communication.
This project serves as a backend server in a 4-part communication line. It serves as a conduit 
with state-saving management properties for multiple frontend devices, constructs rabbitMQ queues
and binds edge devices to them. Creates a buffer between edge devices and rabbitMQ to introduce
failsafe functions and overall durability.

Inter-project communication POC
frontend edge device: https://github.com/tristan1672/sveltekit-starter/tree/ED-Web - running locally

backend conduit server: https://github.com/tristan1672/PERN-Docker-Project/tree/ED-Server - ran on docker

rabbit mq - ran on docker

event input interface: https://github.com/tristan1672/threejs_starter/tree/simple_backend_example - ran locally

Description:
*Branch specific
-frontend client registration (POST)
-SSE event routing to clients (GET)
-client management
-consumer management, queue construction and client mapping to queue

Database:
PostgreSQL

Backend:
Express + Node

Frontend:
React

Prerequisites
-Node.js
-npm or yarn
-PostgreSQL
-Docker

How to Run:
- clone this repository
- npm install or yarn install in /backend and /frontend directories
- npm run build in folders /backend and /frontend
- Run Docker desktop
- in the source directory /pern, run docker compose up --build

  *Branch Specific
- Ensure rabbitMQ is running on docker. install rabbitmq and run with docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
- Since runnning on docker, check ipconfg in cmd for public address
- Populate amqp.connect("amqp:<your public address>:5672"); ensure formatting, example: "amqp://192.168.6.122:5672"
- Ensure backend connects to rabbitMQ
- clone sveltekit-starter and run locally, ensure .env file backend_url=http://<your public address>:5000 as this current project is ran on docker



**Diagram**
![image](https://github.com/user-attachments/assets/52519737-529b-437e-a032-d8a0bda3b943)
