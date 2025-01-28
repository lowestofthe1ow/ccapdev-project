## Gacha/mobile gaming forum

Developed by:

-   Marqueses, Lorenz Bernard B.
-   Cesar, Jusper Angelo M.
-   Silva, Paulo Grane Gabriel C.

CCAPDEV S18

### Contributing

~~The project will be using [Svelte](https://svelte.dev/) (we will not be using SvelteKit)~~ **We will be using raw
HTML/CSS**. Remember to create a new branch for new features and to keep commits as concise as possible.

When writing HTML, try to ensure tags are **semantically meaningful**. For CSS, we will follow
[BEM](https://css-tricks.com/bem-101/). CSS file structure will more or less follow the
[flat](https://en.bem.info/methodology/filestructure/#flat) style suggested by BEM.

> [!important]
> Use the predefined colors in `css/colors.css` instead of manually inputting hex codes.

Backend will be using Node.js and Express. Note we will be using ES6 module syntax by default, instead of CommonJS.

### MongoDB

Ensure you have an instance of MongoDB server (probably 8.0) with a database named `shinosawa`. Place the URI in a
`.env` file at the root directory:

```
MONGODB_URI=mongodb://your-URI
```

### Testing

As of Phase 2, a test command has been defined in `package.json`:

```
npm test
```

#### Pre-phase 2

Set up a simple HTTP server at the root directory. If you have Python, something like this should work:

```
python3 -m http.server
```

### Important dates

**Update** (as of January 26, 2025): **All** deadlines were moved to earlier dates.

-   ~~February 14, 2025~~ &rarr; **February 6, 2025**: Phase 1 deadline
-   ~~March 14, 2025~~ &rarr; **March 10, 2025**: Phase 2 deadline
-   ~~April 4, 2025~~ &rarr; **April 3, 2025**: Phase 3 deadline

([Super secret sidequest event](https://www.ticketmax.ph/events/cosplay-carnival-2024-day-1/) on **March 23-24, 2025**)

### Resources

-   [Svelte tutorial](https://svelte.dev/tutorial/svelte/welcome-to-svelte)
-   [CCAPDEV reference sheet](https://docs.google.com/spreadsheets/d/1ehfGsFsHNGMHuj-pvkTnjSU1ZDOUt5VOGOHjGiaKVJU/edit?usp=sharing)
-   [Project specifications](https://drive.google.com/file/d/1az8mfMGD-BdeF6clC_3BacXEFRigEDLX/view?usp=sharing)
-   [BEM quickstart](https://css-tricks.com/bem-101/)
-   [BEM filestructure](https://en.bem.info/methodology/filestructure/)
-   [BEM 101](https://css-tricks.com/bem-101/)
-   [Node.js guide](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
-   [Express.js guide](https://expressjs.com/en/starter/hello-world.html)
