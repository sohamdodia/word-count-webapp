A web application that return the number of word occurrences in its DOM.

# Prerequisite

- docker

OR

- node.js (14.16.1)
- redis

# Run Project

## 1. Via docker

1. clone this repo
2. cd into the folder
3. `docker-compose up --build`
4. go to: [http://localhost:3000](http://localhost:3000)

## 2. Run independently

### server

1. clone this repo
2. `cd backend`
3. `npm i`
4. `npm run start`
5. Server is running at [http://localhost:4000](http://localhost:4000)

For test cases and coverage:

- Test Cases: `npm run test`
- Test Covergage: `npm run coverage`

### client

1. `cd frontend`
2. `npm i`
3. `npm run start`
4. Client is running at [http://localhost:3000](http://localhost:3000)

For test cases and coverage:

> No test cases has been written for frontend

### Tech stack:

#### backend:

1. node.js
2. redis
3. puppeteer

#### frontend:

1. react.js using create-react-app

### Reasons for using above tech stack

#### Backend:

- Our final objective is to extract text from a web page, and the ideal language for that is javascript, and the language which I'm familiar with.
- There are a few packages that provide functionality to interact with the dom on the backend, such as js-dom, likedom, and others. However, because puppeteer replicates browser behaviour, we can use all of the same commands as a browser and simply extract text from webpages.
- Redis was also utilised to cache the response for a brief period of time.
- Also, because node.js is single-threaded, I've used worker thread to avoid blocking the main thread.

### Frontend:

- For single-page applications, react.js is the ideal framework to utilise right now since it's easy to write react if you know javascript.
- In comparison to vue.js and svelte.js, React.js provides a lot of developer support.
- I didn't use a state management library because we have a small project and state management would be excessive.
