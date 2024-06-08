import createError from "http-errors";
import { searchEngine } from "../../resources/search/searchApi.mjs";

const searchforGame = async function (req, res, next) {
  try {
    if (!Object.hasOwn(req.headers, "title")) {
      throw createError(403, "Query must include the game's title");
    }
    const { title, quantity } = req.headers;
    let { titles, links } = await searchEngine.search(title, parseInt(quantity));
    if (titles.length === 0 || links.length === 0) {
      throw createError(400, "No results found for ");
    }
    res.locals.titles = titles;
    req.session.links = links;
    req.session.titles = titles;
    res.render("games/components/results", async (_, html) => {
      res.send(html);
    });
  } catch (err) {
    next(err);
  }
};

export { searchforGame };
