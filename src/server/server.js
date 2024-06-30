import {
    existsSync,
    readFileSync,
    mkdirSync,
    createReadStream,
    writeFileSync,
} from "fs";
import { createServer } from "http";
import { join } from "path";
import { createInterface } from "readline";
import axios from "axios";
import { login, isAuth } from "./auth_sdk.js";
import { router, STATUS } from "./router.js";

const ACTORS_SERVER_URL =
    process.env.ACTORS_SERVER_URL || "http://localhost:3004";
const BACKUP_FILE_PATH =
    process.env.BACKUP_FILE_PATH || "./SMALL_db_backup_with_actors.txt";
const PORT = process.env.PORT || 3030;
const DEFAULT_LIMIT_PER_PAGE = 10;
const IMAGE_DIR_NAME = "./images";

/**
 * @type {Object<string, string>}
 * @example```js
 * {
 * english_genre: "жанр_на_русском",
 * }
 * ```
 */
const GENRES_MAP = {
    comedy: "комедия",
    drama: "драма",
    action: "боевик",
    thriller: "триллер",
    horror: "ужасы",
    family: "семейный",
    cartoon: "анимированный",
    fantasy: "фэнтези",
    romance: "романтика",
    adventure: "приключения",
    musical: "мьюзикл",
    war: "военный",
};


// fetching utils
function getActor(actorId) {
    if (!actorId)
        return Promise.reject(
            new Error("actor id is required to fetch an actor")
        );
    return axios
        .get(`${ACTORS_SERVER_URL}/actor?id=${actorId}`)
        .then((response) => {
            response.data.photo = `data:image/webp;base64,${response.data.photo}`;
            return response.data;
        })
        .catch((error) => {
            console.error(`Error at getActor(${actorId})`, error.message);
            return Promise.reject(
                new Error("failed to get actor for id:" + actorId)
            );
        });
}

function getActorsForMovie(movieId) {
    if (!movieId) return Promise.reject(new Error("id is required"));
    const movieActorsIds = movieIdMap.get(movieId)?.actors;
    if (!movieActorsIds)
        return Promise.reject(
            new Error(`failed to fetch actors for movie ${movieId}`)
        );
    return Promise.all(movieActorsIds.map((actorId) => getActor(actorId)));
}

function getPosterById(movieId) {
    const posterPath = `${IMAGE_DIR_NAME}/${movieId}.jpeg`;
    if (!existsSync(posterPath)) {
        return;
    }
    return readFileSync(posterPath, "base64");
}


// filtering utils
const getIntersection = (a, ...arr) =>
    [...new Set(a)].filter((v) => arr.every((b) => b.includes(v)));

/**
 * @param {URLSearchParams} query
 * @returns {boolean}
 */
const isEmptyQuery = (query) =>
    !query || (!query.has("title") && !query.has("release_year") && !query.has("genre"));

/**
 * @param {URLSearchParams} query
 * @returns
 */
const filterMovies = (query) => {
    if (isEmptyQuery(query)) {
        return [...movieIdMap.values()];
    }

    const titleQuery = query.get("title");
    let titleMatch;
    if (titleQuery) {
        titleMatch = [];
        const parsedTitleQuery = titleQuery.toLowerCase().trim();
        for (const [title, id] of movieTitleMap) {
            if (title.includes(parsedTitleQuery)) {
                titleMatch.push(id);
            }
        }
    }

    const releaseYearQuery = query.get("release_year");
    let releaseYearMatch;
    if (releaseYearQuery) {
        releaseYearMatch = [];
        const parsedReleaseYearQuery = releaseYearQuery
            .split("-")
            .map((year) => Number(year));

        let from, to;
        if (parsedReleaseYearQuery.length === 1) {
            from = to = parsedReleaseYearQuery[0];
        } else if (parsedReleaseYearQuery[0] <= parsedReleaseYearQuery[1]) {
            from = parsedReleaseYearQuery[0];
            to = parsedReleaseYearQuery[1];
        } else {
            from = parsedReleaseYearQuery[1];
            to = parsedReleaseYearQuery[0];
        }

        for (let i = from; i <= to; i++) {
            releaseYearMatch.push(...(moviesByYear[i] || []));
        }
    }

    const genreQuery = query.get("genre");
    let genreMatch;
    if (genreQuery) {
        const parsedGenreQuery = genreQuery
            ?.split(",")
            ?.map((genre) => GENRES_MAP[genre.trim().toLowerCase()]);
        genreMatch = [];
        for (const genre of parsedGenreQuery) {
            if (genre) {
                genreMatch.push(...(moviesByGenre[genre] || []));
            }
        }
    }

    const searchResult = getIntersection(
        ...[genreMatch, releaseYearMatch, titleMatch].filter(Boolean)
    ).map((id) => movieIdMap.get(id));

    return searchResult;
};

// sorting utils
const sortByRating = (a, b, order) =>
    order === "asc"
        ? Number(b.rating) - Number(a.rating)
        : Number(a.rating) - Number(b.rating);

const sortByTitle = (a, b, order) =>
    order === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);

const sortByReleaseYear = (a, b, order) =>
    order === "asc"
        ? a.release_year - b.release_year
        : b.release_year - a.release_year;

const sortBy = {
    rating: sortByRating,
    title: sortByTitle,
    release_year: sortByReleaseYear,
};

/**
 *
 * @param {Array} moviesCards
 * @param {URLSearchParams} query
 * @returns
 */
const sortMovies = (moviesCards, query) => {
    let sortQuery = query.get("sort_by");
    sortQuery = !sortQuery || !sortBy[sortQuery] ? "rating" : sortQuery;

    let orderQuery = query.get("order");
    orderQuery =
        orderQuery === "asc" || orderQuery === "desc"
            ? orderQuery
            : sortBy === "rating"
            ? "desc"
            : "asc";

    return moviesCards.sort((a, b) => sortBy[sortQuery](a, b, orderQuery));
};

function getRequestLogger(request) {
    const requestTime = Date.now();
    const requestTimeFormatted = new Date(requestTime).toTimeString();
    const timestamp = performance.now();
    console.log(`${requestTimeFormatted} ${request.url}`);
    return {
        log: (response) => {
            console.log(
                `response ${response.statusCode} in ${Math.ceil(
                    performance.now() - timestamp
                )} ms \n`
            );
        },
    };
}

// movie storages and indexes
const movieIdMap = new Map();
const movieTitleMap = new Map();
const moviesByGenre = {};
const moviesByYear = {};

async function loadData() {
    const start = performance.now();
    const loadDate = Date.now();
    const loadTimeFormatted = new Date(loadDate).toTimeString();
    console.log(`${loadTimeFormatted}\nLoading backup data... \n`);

    if (!existsSync(BACKUP_FILE_PATH)) {
        throw new Error(
            `@loadData() fail to find DB backup at ${BACKUP_FILE_PATH}`
        );
    }

    if (!existsSync(IMAGE_DIR_NAME)) {
        mkdirSync(IMAGE_DIR_NAME);
    }

    const inputStream = createReadStream(BACKUP_FILE_PATH);
    inputStream.on("error", (error) => {
        console.log("@loadData() Error at inputStream", error.message);
        inputStream.destroy();
    });

    const lineReader = createInterface({
        input: inputStream,
        terminal: false,
    });
    lineReader.on("error", (error) => {
        throw new Error(
            `@loadData() fail to read and load data from DB backup ${error.message}`
        );
    });

    for await (const line of lineReader) {
        const parsedLine = JSON.parse(line);
        const image = Buffer.from(parsedLine.poster, "base64");

        writeFileSync(join(IMAGE_DIR_NAME, `${parsedLine.id}.jpeg`), image);

        movieIdMap.set(parsedLine.id, {
            id: parsedLine.id,
            title: parsedLine.title,
            description: parsedLine.description,
            genre: parsedLine.genre,
            release_year: parsedLine.release_year,
            actors: parsedLine.actors,
            rating: parsedLine.rating,
            total_rates_count: parsedLine.total_rates_count,
        });
        movieTitleMap.set(parsedLine.title.toLowerCase().trim(), parsedLine.id);
        (moviesByGenre[parsedLine.genre.toLowerCase().trim()] ??= []).push(
            parsedLine.id
        );
        (moviesByYear[parsedLine.release_year] ??= []).push(parsedLine.id);
    }

    console.log(
        `DB reading is finished in ${Math.ceil(
            performance.now() - start
        )} ms. Static files are ready. \n`
    );
}

router.useLogger(getRequestLogger);

// GET endpoints
router.get("/ping", {}, (request, response) => {
    response.statusCode = STATUS.OK;
    response.setHeader("Content-Type", "text/plain");
    response.end("pong");
});

router.get("/api/v1/movie:id", {}, (request, response) => {
    const movieId = request.url.split("/api/v1/movie/")[1];
    const movieCard = movieIdMap.get(movieId);

    if (movieCard) {
        getActorsForMovie(movieId)
            .then((fullActors) => {
                const poster = getPosterById(movieId);
                let fullMovieCard = {
                    ...movieCard,
                    actors: fullActors,
                    poster: `data:image/webp;base64,${poster}`,
                };
                response.statusCode = STATUS.OK;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(fullMovieCard));
            })
            .catch((error) => {
                response.statusCode = 500;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ error: error.message }));
            });
    } else {
        response.statusCode = STATUS.NOT_FOUND;
        response.end(`Movie with id: ${movieId} not found`);
    }
});

router.get("/static/images:id", {}, (request, response) => {
    const movieId = request.url.split("/static/images/")[1];
    const imageFileName = `./images/${movieId}.jpeg`;
    if (!existsSync(imageFileName)) {
        response.statusCode = STATUS.NOT_FOUND;
        response.end(`Poster for movieId: ${movieId} not found`);
    }
    try {
        const stream = createReadStream(imageFileName);
        stream.on("open", () => {
            response.statusCode = STATUS.OK;
            response.setHeader("Content-Type", "image/jpeg");
            stream.pipe(response);
        });
        stream.on("error", () => {
            response.statusCode = STATUS.ERROR_INTERNAL;
            response.end(`Failed to read poster`);
        });
    } catch (error) {
        response.statusCode = STATUS.ERROR_INTERNAL;
        response.end();
    }
});

router.get("/api/v1/search", {}, (request, response) => {
    const query = new URL(
        `http://${process.env.HOST ?? "localhost"}${request.url}`
    ).searchParams;
    response.statusCode = STATUS.OK;
    response.setHeader("Content-Type", "application/json");

    const pageIndex = Number(query.get("page")) || 1;
    const limitPerPage = Number(query.get("limit")) || DEFAULT_LIMIT_PER_PAGE;

    const filteredMovies = filterMovies(query);
    const sortedMovies = sortMovies(filteredMovies, query);
    const fullResultOfSearch = sortedMovies.map((movieCard) => ({
        id: movieCard.id,
        title: movieCard.title,
        description: movieCard.description,
        rating: movieCard.rating,
        poster: `data:image/webp;base64,${getPosterById(movieCard.id)}`,
        genre: movieCard.genre,
        release_year: movieCard.release_year,
    }));

    const amountOfPages = Math.ceil(fullResultOfSearch.length / limitPerPage);
    const paginatedResultOfSearch = fullResultOfSearch.slice(
        (pageIndex - 1) * limitPerPage,
        (pageIndex - 1) * limitPerPage + limitPerPage
    );

    response.end(
        JSON.stringify({
            search_result: paginatedResultOfSearch,
            total_pages: amountOfPages,
        })
    );
});

// POST endpoints
router.post("/echo", {}, (request, response) => {
    let body = "";
    request
        .on("data", (chunk) => {
            body += chunk.toString();
        })
        .on("end", () => {
            response.statusCode = STATUS.OK;
            response.end(body);
        });
});

router.post("/api/v1/login", {}, (request, response) => {
    let body = "";
    request.on("data", (chunk) => {
        body += chunk.toString();
    });
    request.on("end", () => {
        try {
            const { username, password } = JSON.parse(body);
            const token = login(username, password);

            if (token) {
                response.statusCode = STATUS.OK;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ token }));
            } else {
                response.statusCode = STATUS.UNAUTHORIZED;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify({ error: "Invalid credentials" }));
            }
        } catch (err) {
            response.statusCode = STATUS.ERROR_BAD_REQUEST;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "Invalid request body" }));
        }
    });
});

router.post("/api/v1/rateMovie", {}, (request, response) => {
    const token = request.headers["authorization"];

    if (
        !token ||
        !token.startsWith("Bearer ") ||
        !isAuth(token.split(" ")[1])
    ) {
        response.statusCode = STATUS.UNAUTHORIZED;
        return response.end(
            JSON.stringify({ error: "Unauthorized users cannot rate movies!" })
        );
    } else {
        let body = "";
        request.on("data", (chunk) => {
            body += chunk.toString();
        });
        request.on("end", () => {
            const { movieId, user_rate } = JSON.parse(body);
            const parsedUserRate = parseInt(user_rate);
            if (
                isNaN(parsedUserRate) ||
                parsedUserRate < 1 ||
                parsedUserRate > 5
            ) {
                response.statusCode = STATUS.ERROR_BAD_REQUEST;
                return response.end(
                    JSON.stringify({
                        error: `Invalid userRate: ${user_rate}. Should be an integer between 1-5`,
                    })
                );
            }
            let movieToRate = movieIdMap.get(movieId);
            if (!movieToRate) {
                response.statusCode = STATUS.NOT_FOUND;
                return response.end(
                    JSON.stringify({
                        error: `Movie with id ${movieId} not found`,
                    })
                );
            }
            const previousTotalRatesCount = Number(
                movieToRate.total_rates_count ?? 0
            );
            const previousAverageRate = Number(movieToRate.rating ?? 1);
            const aggregatedRate =
                previousAverageRate * (previousTotalRatesCount || 1);

            const newTotalRatesCount = previousTotalRatesCount + 1;
            const newAverageRate = (
                (aggregatedRate + parsedUserRate) /
                newTotalRatesCount
            ).toFixed(1);

            movieToRate.rating = newAverageRate.toString();
            movieToRate.total_rates_count = newTotalRatesCount.toString();
            response.statusCode = STATUS.OK;
            response.end(
                JSON.stringify({
                    movieId,
                    newAverageRate,
                    newTotalRatesCount,
                })
            );
        });
    }
});

function serverStart() {
    createServer(router.start()).listen(PORT, () => {
        console.log(`Server is ready. Listen at :${PORT} port.`);
    });
}

await loadData();
serverStart();
