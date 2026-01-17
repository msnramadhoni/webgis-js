# Water Network Analyzer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/web-wntr-js)

Modern static web application for water network analysis using WNTR (Water Network Tool for Resilience). Built with React, TypeScript, and deployed on Vercel with Python serverless functions.

## ✨ Features

- 🎨 Beautiful glassmorphic UI with TailwindCSS
- 📤 Drag-and-drop INP file upload
- ⚡ Serverless Python WNTR analysis
- 📊 Interactive pressure visualizations
- 📈 Real-time analysis results
- 💾 CSV export functionality
- 🚀 One-click Vercel deployment
- 📱 Fully responsive design

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or click the "Deploy with Vercel" button above!

## 📁 Project Structure

```
web-wntr-js/
├── api/
│   └── analyze.py         # Vercel serverless function (Python)
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API client
│   └── types/            # TypeScript types
├── public/               # Static assets
├── vercel.json          # Vercel configuration
├── requirements.txt     # Python dependencies
└── package.json
```

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Vercel Serverless Functions (Python)
- **Analysis**: WNTR (Water Network Tool for Resilience)
- **Deployment**: Vercel

## 📖 Usage

1. **Upload INP File**: Drag and drop your water network .inp file
2. **Configure**: Set pipe to close, time, and pressure thresholds
3. **Analyze**: Click "Run Analysis" and wait for results
4. **View Results**: See pressure maps, impact analysis, and top affected nodes
5. **Export**: Download CSV report with detailed node data

## 🌐 API Endpoint

### POST /api/analyze

Analyze water network with pipe closure simulation.

**Request:**
```json
{
  "inpContent": "string",
  "pipeToClose": "P1106",
  "timeSec": 3600,
  "topN": 20,
  "okBarMin": 3.0,
  "veryLowMax": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "usedTime": 3600,
    "meanPressureBase": 45.2,
    "topImpactedNodes": [...],
    "pressureMapsImage": "data:image/png;base64,...",
    "impactMapImage": "data:image/png;base64,...",
    "csvData": "..."
  }
}
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file (optional):

```env
VITE_API_URL=/api
```

### Vercel Settings

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🐛 Troubleshooting

**Function timeout?**
- Vercel Hobby plan has 60s limit
- Upgrade to Pro for longer timeouts

**Large files?**
- Vercel has 4.5MB request limit
- Consider file size optimization

## 📄 License

MIT

## 🙏 Credits

- [WNTR](https://wntr.readthedocs.io/) - Water Network Tool for Resilience
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

---

Made with ❤️ for water network engineers
