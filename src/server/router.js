import { IncomingMessage, ServerResponse } from "http";

export const STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    ERROR_INTERNAL: 500,
    ERROR_BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
};

class Router {
    getHandlers = {};
    postHandlers = {};
    getRequestLogger = (_req) => {
        return {
            log: (_res) => {},
        };
    };
    constructor() {}
    /**
     * @param {string} path - The URL path.
     * @param {*} _options - The options parameter
     * @param {(req: IncomingMessage, res: ServerResponse) => any} handler - The handler function.
     * @returns {void}
     */
    get(path, _options, handler) {
        this.getHandlers[path.split(":")[0]] = handler;
    }
    /**
     * @param {string} path - The URL path.
     * @param {*} _options - The options parameter
     * @param {(req: IncomingMessage, res: ServerResponse) => any} handler - The handler function.
     * @returns {void}
     */
    post(path, _options, handler) {
        this.postHandlers[path.split(":")[0]] = handler;
    }
    useLogger(logHandler) {
        this.getRequestLogger = logHandler;
    }
    start() {
        /**
         * @param {IncomingMessage} req
         * @param {ServerResponse} res
         */
        return (req, res) => {
            try {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader(
                    "Access-Control-Allow-Methods",
                    "OPTIONS, GET, POST"
                );
                res.setHeader(
                    "Access-Control-Allow-Headers",
                    "Content-Type, Authorization"
                );
                const url = new URL(
                    `http://${process.env.HOST ?? "localhost"}${req.url}`
                );

                const requestLogger = this.getRequestLogger(req);
                res.on("finish", () => requestLogger.log(res));

                const method = req.method;
                const route = url.pathname;
                const routeWithoutSlug = route
                    .split("/")
                    .slice(0, route.split("/").length - 1)
                    .join("/");

                if (method === "OPTIONS") {
                    res.writeHead(204);
                    res.end();
                    return;
                }
                if (method === "GET" && this.getHandlers[route]) {
                    return this.getHandlers[route](req, res);
                }
                if (method === "GET" && this.getHandlers[routeWithoutSlug]) {
                    return this.getHandlers[routeWithoutSlug](req, res);
                }

                if (method === "POST" && this.postHandlers[route]) {
                    return this.postHandlers[route](req, res);
                }
                if (method === "POST" && this.postHandlers[routeWithoutSlug]) {
                    return this.postHandlers[routeWithoutSlug](req, res);
                }

                res.statusCode = STATUS.NOT_FOUND;
                res.end();
            } catch (err) {
                console.error(err.message);
                res.statusCode = STATUS.ERROR_INTERNAL;
                res.end();
            }
        };
    }
}

export const router = new Router();
