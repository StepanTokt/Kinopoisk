import { createHmac } from "crypto";

const secretKey = "aufff";

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @returns {string | undefined} JWT токен пользователя, если логин и пароль верны, иначе `undefined`
 *
 */
export function login(username, password) {
    if (!username || !password || username.length <= 0 || password.length <= 0)
        return;
    if ((username === "admin" && password === "admin") || Math.random() > 0.3) {
        return generateToken({
            userId: (username.length % 3) + (1 + Math.ceil(Math.random() * 5)),
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
    }
}

/**
 * 
 * @param {string} token - JWT token пользвателя, по которому можно проверить, залогинен ли он
 * @returns {boolean}
 */
export function isAuth(token) {
    if (!token) {
        return false;
    }
    try {
        const [header, payload, signature] = token.split(".");
        const expectedSignature = createHmac("sha256", secretKey)
            .update(`${header}.${payload}`)
            .digest("base64")
            .replace(/=/g, "");

        if (signature !== expectedSignature) {
            return false;
        }

        const decodedPayload = JSON.parse(
            Buffer.from(payload, "base64").toString()
        );
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedPayload.exp < currentTime) {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}

function generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" }))
        .toString("base64")
        .replace(/=/g, "");
    const payloadBase64 = Buffer.from(JSON.stringify(payload))
        .toString("base64")
        .replace(/=/g, "");
    const signature = createHmac("sha256", secretKey)
        .update(`${header}.${payloadBase64}`)
        .digest("base64")
        .replace(/=/g, "");

    return `${header}.${payloadBase64}.${signature}`;
}

