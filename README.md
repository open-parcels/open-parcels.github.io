# open-parcels.github.io

The Open Parcels website: plain HTML and CSS, served by GitHub Pages from `main` at `/`.

Regenerate the carriers list whenever `data/carriers.yaml` changes in
[open-parcels-rules](https://github.com/open-parcels/open-parcels-rules), then commit the updated
`index.html`. The script borrows the rules checkout's `yaml` package, so install it there first:

```sh
(cd ../open-parcels-rules && npm ci)
node scripts/carriers.mjs ../open-parcels-rules
```

The logo files (`favicon.svg`, `apple-touch-icon.png`, `img/`) are copies of `docs/branding/` in
the [server repository](https://github.com/open-parcels/open-parcels/tree/main/docs/branding);
copy them again when the logo changes there.
