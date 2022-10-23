# RadioFM

RadioFM is a publicly available website radio which hosts a manages a queue of songs 24/7. People from all over the world can tune into RadioFM and chat via the text chat, like songs, create accounts, and chill out.

## Listen To RadioFM

The production server for RadioFM is available at https://radio-fm.fly.dev

The dev server for RadioFM is available at https://radio-fm-dev.fly.dev

### Hosting and Deployment

We have chosen Fly.io as our deployment service as it is quick and easy to setup. Both our dev and prod deployments are running through Fly.io.

## Run your own RadioFM

1. Install NodeJS https://nodejs.org/en/
2. Install Yarn: `npm install --global yarn`
3. Install PostgreSQL: https://www.postgresql.org/download/
4. Install pgAdmin: https://www.pgadmin.org/download/
5. Create a database within pgAdmin
6. Create a `.env` file within `src/server/src/prisma`
   1. Add a `DATABASE_URL` environmental variable with the following format `postgresql://USER:PASSWORD@HOST:PORT/DATABASE` replacing all uppercase words with your database's identity.
      1. E.g. `DATABASE_URL=postgresql://postgres:pass123@localhost:5432/RadioFM`
7. Run `yarn`
8. Run `yarn prisma generate`
9. Run `yarn prisma migrate dev`
10. Run `yarn server seed`
11. Run `yarn web build && yarn web export`
    1.  There is an issue with Windows and one of our configurations. This command will only work on Linux or MacOS machines.
    2. There is a workaround: Find the `src/web/next.config.js` file and remove the `..` from `../server` on the first line.
    3. Rerun the command.
12. Run `yarn server start` and access your website via a browser at `http://localhost:8080`

