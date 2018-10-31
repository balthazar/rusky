import serialize from 'serialize-javascript'

export default ({ state, html, main }) => `<!doctype html>
<html lang="en">
  <head>
    <title>[::]</title>
    <meta charset="utf-8" />
    <meta name="theme-color" content="#000000" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
    <script>
      window.__INITIAL_STATE__ = ${serialize(state)}
    </script>
    <style>
      *, *:after, *:before {
        box-sizing: border-box;
        font: inherit;
        color: inherit;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
      }
    </style>
  </head>
  <body>
    <div id="root">${html}</div>
    <script src="/dist/${main}"></script>
  </body>
</html>`
