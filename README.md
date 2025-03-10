## Gacha/mobile gaming forum

Developed by:

-   Marqueses, Lorenz Bernard B.
-   Cesar, Jusper Angelo M.
-   Silva, Paulo Grane Gabriel C.

CCAPDEV S18

The project uses images and other assets from existing video games that are all owned by their respective authors. It
uses also assets from Google Fonts and Google Icons, and makes use of
[Normalize.css](https://necolas.github.io/normalize.css/) to minimize CSS rendering difference between browsers. We use
v8.0.1 (see `/css/normalize.css`). Removing this file should not greatly affect how the site is rendered.

CSS files are broken down into blocks following the [BEM](https://en.bem.info/methodology/quick-start/#block)
methodology to help organize class names and avoid collisions. These are all linked to `/css/master.css`.

**Note that some resources are fetched from the Internet**. This includes the aforementioned Google Fonts/Icons files,
as well as some images.

The [GitHub repository](https://github.com/lowestofthe1ow/ccapdev-project) is currently set to private. Please let us
know if we need to set it to public.

### Recreating the database

Ensure you have an instance of MongoDB server (probably 8.0) with a database. Place the URI in a
`.env` file at the root directory:

```
MONGODB_URI=mongodb://your-URI
MONGODB_DBNAME=your-DB-name
```

An example `.env` file is included in the directory. This uses the database name `shinosawa`. Initialize the database by
running the following command:

```
npm run initdb
```

A test command has been defined in `package.json`:

```
npm test
```

This will run an instance of [nodemon](https://www.npmjs.com/package/nodemon) to run the server on port 3000.

### References

-   [Svelte tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
-   [CCAPDEV reference sheet](https://docs.google.com/spreadsheets/d/1ehfGsFsHNGMHuj-pvkTnjSU1ZDOUt5VOGOHjGiaKVJU/edit?usp=sharing)
-   [Project specifications](https://drive.google.com/file/d/1az8mfMGD-BdeF6clC_3BacXEFRigEDLX/view?usp=sharing)
-   [BEM quickstart](https://css-tricks.com/bem-101/)
-   [BEM filestructure](https://en.bem.info/methodology/filestructure/)
-   [BEM 101](https://css-tricks.com/bem-101/)
-   [Node.js guide](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
-   [Express.js guide](https://expressjs.com/en/starter/hello-world.html)
-   [MDN Web Docs](https://developer.mozilla.org/en-US/)

### NPM packages used

-   `argon2`: "^0.41.1" (Password hashing)
-   `connect-mongo`: "^5.1.0" (MongoDB session store)
-   `cookie-parser`: "^1.4.7" (Cookies)
-   `express`: "^4.21.2"
-   `express-handlebars`: "^8.0.1"
-   `express-session`: "^1.18.1" (Sessions)
-   `express-validator`: "^7.2.1" (Request validation)
-   `markdown-it`: "^14.1.0" (Markdown rendering)
-   `mongodb`: "^6.12.0"
-   `nodemon`: "^3.1.9" (Auto-restart Node server)
