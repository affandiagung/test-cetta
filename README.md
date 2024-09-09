# Elysia with Bun runtime

## Step

````bash
curl -fsSL https://bun.sh/install | bash
bun add elysia prisma
bun prisma init
bun prisma generate
bun prisma migrate dev



## Development

To start the development server run:

```bash
bun run dev
````

Open http://localhost:{ENV}/ with your browser to see the result.
