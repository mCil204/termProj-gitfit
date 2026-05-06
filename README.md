# termProj-gitfit

Deployed App: https://termproj-gitfit.onrender.com/
disclaimer: Don't use like personal emails/info. use a burner google account or something

setup:
Node.js

PostgreSQL

A Google Cloud project with OAuth 2.0 credentials

1. Clone the repository

2. Install dependencie: npm install

3. Set up environment variables

Create a .env file in the root directory with the following:

DATABASE_URL='postgre connection string'

SESSION_SECRET='your_personal_string'

PORT= 'if local run, then 3000'

clientID= 'google auth credentials'

clientSecret='google auth cred'

ExerciseAPI_Key='from ExerciseDB by Justin H.'

4. Set up the database

Run your SQL schema to initialize the PostgreSQL database

5. Start the server

node server.js

or

npm run dev

http://localhost:3000

http://localhost:3000/auth/google/callback


Reflection:

Design Choices
Frontend: EJS was chosen for the frontend because I wanted to try something new and different rather than just our usual web vanilla development method.

Backend: Node.js + Express. This was the natural choice given that they things I was familiar with.

PostgreSQL was the same. Most of my choices were framed around familiarity.

Authentication: Google Auth.


Challenges
Nearly every part of this project presented a real challenge.
Google OAuth setup had me dealing with URIs, client credentials, and a whole bunch of mismatches caused failures that were difficult to debug.
Deployment on Render required understanding how environment variables are injected at runtime, how Render detects the start command, and how to troubleshoot startup crashes from missing config.


Learning Outcomes
This project provided hands-on experience with nearly every layer of full-stack development, whetehr I wanted it or not. Things like:

-How OAuth 2.0 flows work in practice, including redirect handling, token exchange, and session persistence

-The importance of .gitignore before making a repository public

-How to render and deployment environments. I had to understand how they differ from local development, and how to configure apps to run correctly in both


Future Work
Progress tracking & charts with animated graphs showing volume, frequency, and personal records. Notifications and reminders are something I would also like to add. The light/dark mode I never implemented... yeah, I forgot.
