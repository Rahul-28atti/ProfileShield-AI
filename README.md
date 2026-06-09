# ProfileShield AI 🛡️🤖

ProfileShield AI is a premium full-stack cybersecurity application designed to audit, detect, and mitigate automated threat identities, fake social media profiles, cryptocurrency giveaway bots, spammers, and malicious impersonators using Machine Learning classifiers and Generative AI explanations.

---

## 🛠️ Technology Stack

* **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Motion Layout
* **Backend:** Node.js Express Server + Full-Stack API architecture
* **Data Core:** Persistent SQLite SQL query visual logger and relational tracking
* **Heuristic Engine:** Specialized RandomForest Decision Tree Ensemble (Scikit-Learn equivalent)
* **Explainable AI:** Gemini 3.5 Flash Model Gateway for cognitive threat summaries

---

## 🚀 Getting Started & Local Node Installation

The application runs directly in the AI Studio container sandbox and boots automatically. To download and run local environments within VS Code:

### Prerequisites
* **Node.js** v18+ 
* **npm** v9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Credentials
Create a `.env` file at the root level:
```env
# Gemini secure deployment key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Cryptographic token secret
JWT_SECRET="profileshield_cyber_sec_core_secret"
```

### 3. Start Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** inside your browser.

### 4. Build for Production Deployment
```bash
npm run build
npm start
```

---

## 🐍 Python FastAPI Alternative Launch
If you wish to migration-run the Python backend stack locally, use the provided dependencies inside `requirements.txt`:

```bash
# Initialize virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install sci-kit modules
pip install -r requirements.txt

# Run FastAPI pipeline
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

---

## 💎 Features Walkthrough

1. **Authentication Gate:** Securely log in using default credential clears or sign Up new accounts. Choose between standard analysts and Elevated Administrator nodes.
2. **Dynamic Bento Dashboard:** Review aggregated threat profiles metrics, active log audits, safe-to-dangerous visual scales, and real-time network scans.
3. **Multi-Vector scanner:** Input usernames, follower/following ratios, and bio content. Runs an animated diagnostic scanner displaying actual execution pathways.
4. **Scikit-Forest Ensemble Matrix:** Analyzes Gini impurity, follower ratios, name digit heuristics, and biography spam tokens, outputting absolute feature weights.
5. **Gemini Intel Reasoning:** Provides custom Markdown explanation panels detailing why the classification vector is correct.
6. **Reports Vault & Printing:** Prints custom PDF certificates cleanly or downloads plaintext audit summaries instantly.
7. **Interactive SQL CLI & Users Triage:** Execute raw SQL statements (e.g., `db:stats`) against the database or delete suspicious system credentials.
