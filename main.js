import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const INDEX_PAGE = `<!DOCTYPE html>
    <html>
      <head><title>NSE: Not a Search Engine</title><head>
      <style>
      code {
        background-color: lightblue
      }
      </style>
      <body>
        <h1>NSE - Not a Search Engine</h1>
        <p>Type the following bangs, followed by your query to search the respective websites:</p>
        <p><code>tw</code> Twitter</p>
        <p><code>hn</code> Hacker News</p>
        <p><code>yt</code> YouTube</p>
        <p><code>mw</code> Merriam Webster</p>
        <p><code>gr</code> Goodreads</p>
        <p><code>u</code> Urban Dictionary</p>
        <p><code>r</code> Reddit</p>
        <p><code>w</code> Wikipedia</p>

        <br />

        <p>eg. use <code>tw Ruby on Rails</code> to search Twitter for Ruby on Rails.</p>

      </body>
    </html>
  `

const router = new Router();
router
  .get("/", (context) => {
    console.log(context)
    context.response.body = INDEX_PAGE
  })
 .get("/search", (context) => {
    const input = context.request.url.searchParams.get('q');
    let [provider, ...query] = input.split(' ')
    query = query.join(' ')

    const encodedQuery = encodeURI(query)
    const REDIRECT_STATUS_CODE = 302
    
    if (provider === 'tw') {
      context.response.redirect(`https://twitter.com/search?q=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'yt') {
      context.response.redirect(`https://www.youtube.com/results?search_query=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'hn') {
      context.response.redirect(`https://hn.algolia.com/?q=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'u') {
      context.response.redirect(`https://www.urbandictionary.com/define.php?term=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'mw') {
      context.response.redirect(`https://www.merriam-webster.com/dictionary/${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'gr') {
      context.response.redirect(`https://www.goodreads.com/search?q=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'r') {
      context.response.redirect(`https://www.reddit.com/search?q=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else if (provider === 'w') {
      context.response.redirect(`https://en.wikipedia.org/w/index.php?search=${encodedQuery}`, REDIRECT_STATUS_CODE)
    } else {
      context.response.body = INDEX_PAGE
    }

  })

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
