# Water Network Analyzer - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React, React DOM
- TypeScript
- Vite (build tool)
- TailwindCSS
- Axios (HTTP client)

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### 3. Test the Application

1. Open http://localhost:3000 in your browser
2. Upload a `.inp` file (water network model)
3. Configure analysis parameters
4. Click "Run Analysis"
5. View results and visualizations

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

Vercel will automatically:
- Build your React app
- Deploy Python serverless function
- Provide you with a live URL

## 📁 Project Structure

```
web-wntr-js/
├── api/
│   └── analyze.py         # Python serverless function
├── src/
│   ├── components/        # React components
│   │   ├── FileUpload.tsx
│   │   ├── ConfigForm.tsx
│   │   └── ResultsPanel.tsx
│   ├── pages/
│   │   └── Dashboard.tsx
│   ├── services/
│   │   └── api.ts         # API client
│   ├── types/
│   │   └── index.ts       # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                # Static assets
├── index.html
├── package.json
├── vercel.json           # Vercel config
├── requirements.txt      # Python deps
└── README.md
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## ⚙️ Configuration

### Environment Variables

Create `.env` file (optional):

```env
VITE_API_URL=/api
```

### Vercel Configuration

The `vercel.json` file configures:
- Static build from Vite
- Python runtime for serverless functions
- 60-second timeout
- 3GB memory allocation

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3001
```

### Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python function errors

Make sure `requirements.txt` has all dependencies:
```
wntr>=1.1.0
matplotlib>=3.7.0
pandas>=2.0.0
numpy>=1.24.0
```

## 📊 Usage Guide

### 1. Upload INP File

- Drag and drop your `.inp` file
- Or click to browse and select file
- File is read client-side (not uploaded to server yet)

### 2. Configure Parameters

- **Pipe to Close**: ID of pipe to simulate closure (e.g., "P1106")
- **Time (seconds)**: Simulation time (default: 3600)
- **Top N Results**: Number of top impacted nodes to show (default: 20)
- **OK Threshold**: Minimum pressure for OK status in bar (default: 3.0)
- **Very Low Max**: Maximum pressure for very low status in bar (default: 1.0)

### 3. Run Analysis

- Click "Run Analysis" button
- Wait for serverless function to complete (10-60 seconds)
- Results will appear automatically

### 4. View Results

- **Summary**: Mean pressures and statistics
- **Pressure Maps**: 3-panel visualization
- **Impact Map**: Color-coded service status
- **Top Nodes Table**: Most affected nodes
- **CSV Export**: Download detailed data

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#667eea', // Change this
      }
    }
  }
}
```

### Modify Analysis Defaults

Edit `src/components/ConfigForm.tsx`:

```typescript
const [config, setConfig] = useState({
  pipeToClose: 'P1106',  // Change default pipe
  timeSec: 3600,         // Change default time
  topN: 20,              // Change default top N
  okBarMin: 3.0,         // Change OK threshold
  veryLowMax: 1.0,       // Change very low threshold
});
```

## 📝 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Run dev server: `npm run dev`
3. ✅ Test with sample INP file
4. ✅ Deploy to Vercel: `vercel --prod`
5. ✅ Share your live URL!

## 🆘 Need Help?

- Check the [README.md](./README.md) for more details
- Review the [walkthrough.md](../brain/walkthrough.md) for implementation details
- Open an issue on GitHub

---

Happy analyzing! 🚀💧
