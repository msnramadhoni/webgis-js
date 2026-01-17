# Quick Start

## Setup (First Time)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## Project Structure

```
├── api/analyze.py      # Python serverless function
├── src/                # React app
├── public/             # Static files
└── vercel.json         # Vercel config
```

## Usage

1. Upload `.inp` file
2. Configure parameters
3. Run analysis
4. View results

See [SETUP.md](./SETUP.md) for detailed guide.
