PORT = 3004

### 1. GET `/actor`

Request:
- Method: GET
- Query Parameters:
  - id (string, required): Actor id

- Headers: Content-Type: application/json

Responses:
- Success (200):
  
```ts
  {
        name: string,
        photo: string // base64 img
    }
```  

- Error (404):
  
```json
  {
    "error": "Actor not found"
  }
```