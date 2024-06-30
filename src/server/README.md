> **дисклеймер:** *Эта, третья часть домашки, сверх-дополнительна и полностью опциональна. На неё не написано проверок и за неё баллы не зачисляются, как и не отнимаются за её отсутствие. Если вы и так устали - то можете просто не делать её. Зачитываются только предыдущие две части домашки, если вы их сделали - вы уже красавчики и красавицы! Но, если вам хочется поиграться и написать что-то еще - можете сделать) Спойлер: через две недели у вас будут лекции по реакту и вам будет вдвойне приятно, если вы всё-таки сделаете и эту часть) Теперь возвращаемся в повествование о светлом будущем, где вы - разработчик в команде Фильмопоиска...*
[Скачать песочницу]()

> Только что у вас был еженедельный синк с продуктовой командой Фильмопоиска и на нём вы узнали, что они хотят расширить функционал, да и немного формат данных поменять, в общем скидывают вам спецификацию типов и эндпоинтов и говорят, мол, вот это хотим.
Ну, что поделать, желание фротнеда - закон, так что придётся дорабатывать и переписывать.
У вас есть еще один сервак в `./actors_server`, к которому можно обращаться за информацией о актёрах и `auth_sdk.js`, которая поможет вам авторизовать пользователя

```ts
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
} as const;
type GenresEnglish = keyof typeof GENRES_MAP; 
type GenresRussian = typeof GENRES_MAP[GenresEnglish];

type Actor = {
        name: string;
        photo: string; // base64 img
}

type FullMovieInfo = {
    id: string;
    title: string;
    description: string;
    release_year: number;
    poster: string; //base64 img
    genre: string;
    rating: string; //float
    total_rates_count: string; //int
    actors: Actor[];
}

type ShortMovieInfo = Omit<FullMovieInfo, "actors" | "total_rates_count">;
```

## Endpoints

### 1. POST `/api/v1/login`

Request:
- Method: POST
- Headers: Content-Type: application/json
- Body:
  
```json
  {
    "username": "string",
    "password": "string"
  }
```
  
Responses:
- Success (200):
  
```json
  {
    "token": "string"
  }
```  
- Error (401):
  
```json
  {
    "error": "Invalid credentials"
  }
```

### 2. GET `/api/v1/movie/:id`

Request:
- Method: GET
- Path Parameters:
  - id (string, required): Movie id

- Headers: Content-Type: application/json

Responses:
- Success (200):
  
```ts
  FullMovieInfo
```  

- Error (404):
  
```json
  {
    "error": "Movie with id: ${movieId} not found"
  }
```

### 3. GET `/api/v1/search`

Request:
- Method: GET
- Query Parameters:
  - title (string, optional): Movie title to look for
  - genre (`GenresEnglish`, optional): Movie genre in english
  - release_year (string, optional): e.g `'2020'` or `'2020-2020'`
  - sort_by (`'release_year' | 'title' | 'rating'`, optional): parameter to sort by
     - default: `'rating'`
  - order (`'asc' | 'desc'`, optional): how to order sorted results
    - default: `'desc'`
  - page (number, optional): number of page
    - default: `1`
  - limit (number, optional): limit of paginated items per page
    - default: `5`

Responses:
- Success (200):
  
```ts
    {
        search_result: ShortMovieInfo[],
        total_pages: number
    }
```  

### 4. POST `/api/v1/rateMovie`

Request:
- Method: POST
- Headers: 
    - Content-Type: application/json
    - Authorization: `Bearer ${token}`
- Body:
  
```json
  {
    "movieId": "string",
    "user_rate": "number"
  }
```
  
Responses:
- Success (200):
  
```json
  {
    "token": "string"
  }
```  
- Error (401):
  
```json
  {
    "error": "Invalid token"
  }
```
- Error (404):
  
```json
  {
    "error": "Invalid userRate: ${user_rate}. Should be an integer between 1-5 token"

  }
```
- Error (404):
  
```json
  {
    "error": "Movie with id ${movieId} not found"

  }
```


