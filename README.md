<img src="brand/marks/pilcrow-accent.svg" width="96" height="96" alt="pilcrow mark">

# pilcrow

A serif pilcrow (¶), knocked out of a square plate, built from [Joan](https://github.com/PaoloBiagini/Joan) (OFL). Doubles as a first initial.

## Build from source

```sh
npm install
npm run build
```

Runs the pipeline in order: fetch → marks → raster → favicon → palette. Each step also runs on its own: `npm run fetch`, `build:marks`, `build:raster`, `build:favicon`, `build:palette`. The font is pulled fresh from [PaoloBiagini/Joan](https://github.com/PaoloBiagini/Joan) on every build rather than committed to the repo. Every locked number lives as a named constant in `scripts/mark-spec.mjs` and `scripts/plate-geometry.mjs`. Full design history: `history/HISTORY.md`.

## License

The glyph outline in `brand/marks/` derives from [Joan](https://github.com/PaoloBiagini/Joan) by Paolo Biagini, licensed [OFL 1.1](https://openfontlicense.org/); the font itself is never redistributed here.

| Path                                 | License                                                                           |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| `brand/`, `history/`, `preview.html` | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (`LICENSE`) |
| `scripts/`, `tests/`, config files   | MIT (`LICENSE-CODE`)                                                              |
