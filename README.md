# PERN-Docker-Project - rabbitMQ-to-threeJs_starter branch

A PERN stack with docker delivery.
This branch is part of a proof of concept implementation that shows inter-project communication.
This project serves as a backend server in a 4-part communication line. It serves as a conduit 
with state-saving management properties for multiple frontend devices, constructs rabbitMQ queues
and binds edge devices to them. Creates a buffer between edge devices and rabbitMQ to introduc
failsafe functions and overall durability.

Inter-project communication POC
frontend edge device: https://github.com/tristan1672/sveltekit-starter - running locally

backend conduit server: https://github.com/tristan1672/PERN-Docker-Project/tree/rabbitMQ-to-threeJS_project

event input interface: https://github.com/tristan1672/threejs_starter/tree/simple_backend_example

Description:
*Branch specific
-frontend client registration (POST)
-SSE event routing to clients (GET)
-client management
-consumer management, queue construction and client mapping to queue

*pre-existing
-accepts CSV file upload
-data display with pagination
-search function

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
- Ensure rabbitMQ in threejs-starter project is running on docker
- Since runnning on docker, check ipconfg in cmd for public address
- Populate amqp.connect("amqp:<your public address>:5672"); ensure formatting, example: "amqp://192.168.6.122:5672"
- Ensure backend connects to rabbitMQ
- clone sveltekit-starter and run locally, ensure .env file backend_url=http://<your public address>:5000 as this current project is ran on docker


Diagram

![image](https://github.com/user-attachments/assets/5201e57c-79a1-4973-b05e-02a37828b8a1)

