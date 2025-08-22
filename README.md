This is a [Next.js](https://nextjs.org/) project to track your ability cards for the game FrostHaven.
The latest version of this application is hosted [here](https://frosthaven-cards.vercel.app).

The app now also supports **Jaws of the Lion** and can be served from a sub-path using `NEXT_PUBLIC_BASE_PATH`.

## Features

- Choose your class (Frosthaven and Envelope X)
- Choose your class ability cards
- Enhance cards
- Tracks Discard / Lost / Active Effects
- Allow short (with reroll) and long rests.
- Undo / Redo
- Gloomhaven secretary connection

## Getting Started

First, install then run the development server:

```bash
npm run install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You can use [http://localhost:3000/test](http://localhost:3000/test) to visualize the cards.

## Docker

Build the production image and run it (example with base path `/cards`):

```bash
docker build --build-arg NEXT_PUBLIC_BASE_PATH=/cards -t ability-cards .
docker run -p 3000:3000 -e PORT=3000 ability-cards
```

On Unraid, set `NEXT_PUBLIC_BASE_PATH` in the build args and map port `3000`. The app will then be available at `http://SERVER_IP:3000/cards`.

## JotL assets

Ability card metadata for Jaws of the Lion is included, but images are **not** bundled. Add your own legally obtained images under `public/jotl/` with the following structure:

```
public/
  jotl/
    jotl-logo.webp        # optional game logo
    hatchet/
      icon.webp           # class icon (user provided)
      cards.json
      abilities/
        jl-center-mass.png # ability card images (user provided)
    demolitionist/
      ...
    red-guard/
      ...
    voidwarden/
      ...
```

Without these images the app still runs, but JotL classes will show placeholders.

## [Gloomhaven Secretary](https://gloomhaven-secretary.de/)

You can connect to a Gloomhaven Secretary server.
It allows you to set your initiative and automatically end your turn on GHS when you click the "End Turn" button. This works for both Frosthaven and Jaws of the Lion classes.
