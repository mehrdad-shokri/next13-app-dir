# Next.js Notes

* [What is this](#what-is-this)
* [Demo](#demo)
* [Setup](#setup)
* [Known Limitation](#known-limitation)
* [Learn More](#learn-more)
* [License](#license)


## What is this?
Exploring Next.js new ``app`` dir and Server Components. Watch it on [YouTube](https://youtube.com)

## Demo

|                                                       |                                                     |
|:-----------------------------------------------------:|:---------------------------------------------------:|
|  ![Alt text](./demo/notes1.png?raw=true "Note List")  | ![Alt text](./demo/notes2.png?raw=true "New  Note") |
| ![Alt text](./demo/notes3.png?raw=true "Note Detail") | ![Alt text](./demo/notes4.png?raw=true "Note Edit") |

## Setup

### Frontend

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend
All backend file is located  inside ``server`` directory.  
You will need to have nodejs >=14.9.0 in order to run this demo. [Node 14 LTS](https://nodejs.org/en/about/releases/) is a good choice! (If you use `nvm`, run `nvm i` before running `npm install` to install the recommended Node version.)

  ```
  cd server
  npm install
  npm start
  ```

(Or `npm run start:prod` for a production build.)

Then open http://localhost:4000.

The app won't work until you set up the database, as described below.

<details>
  <summary>Setup with Docker (optional)</summary>
  <p>You can also start dev build of the app by using docker-compose.</p>
  <p>⚠️ This is <b>completely optional,</b> and is only for people who <i>prefer</i> Docker to global installs!</p>
  <p>If you prefer Docker, make sure you have docker and docker-compose installed then run:</p>
  <pre><code>docker-compose up</code></pre>
  <h4>Running seed script</h4>
  <p>1. Run containers in the detached mode</p>
  <pre><code>docker-compose up -d</code></pre>
  <p>2. Run seed script</p>
  <pre><code>docker-compose exec notes-app npm run seed</code></pre>
  <p>If you'd rather not use Docker, skip this section and continue below.</p>
</details>

## DB Setup

This demo uses Postgres. First, follow its [installation link](https://wiki.postgresql.org/wiki/Detailed_installation_guides) for your platform.

Alternatively, you can check out this [fork](https://github.com/pomber/server-components-demo/) which will let you run the demo app without needing a database. However, you won't be able to execute SQL queries (but fetch should still work). There is also [another fork](https://github.com/prisma/server-components-demo) that uses Prisma with SQLite, so it doesn't require additional setup.

The below example will set up the database for this app, assuming that you have a UNIX-like platform:

### Step 1. Create the Database

```
psql postgres

CREATE DATABASE notesapi;
CREATE ROLE notesadmin WITH LOGIN PASSWORD 'password';
ALTER ROLE notesadmin WITH SUPERUSER;
ALTER DATABASE notesapi OWNER TO notesadmin;
\q
```

### Step 2. Connect to the Database

```
psql -d postgres -U notesadmin;

\c notesapi

DROP TABLE IF EXISTS notes;
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  title TEXT,
  body TEXT
);

\q
```

### Step 3. Run the seed script

Finally, run 
```  
cd server
npm run seed
``` 
to populate some data.

And you're done!

## Known Limitation  
- Currently, returning an Async component inside a server component causes ``Typescript`` errors which can be worked around with with ``fn as (arg: T) => R`` but this is a workaround and we'll have official support in the future 
- Pages are [wrapped](https://github.com/vercel/next.js/discussions/41745#discussioncomment-3964086) inside another ``div`` in the layout's ``children`` place. an that causes styling problems
- Async ``head.tsx`` return without the desired ``title`` 

## Learn More
Watch me on [YouTube](https://youtube) for a complete walkthrough of the new routing system and file conventions.  
Also visit Next.js [New Docs](https://beta.nextjs.org/docs) for more info.

## License
This demo is MIT licensed.
