```markdown
# 🌳 Skill Tree: Proof of Build Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Prisma-green)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase-emerald)](https://supabase.com/)

**Skill Tree** is an automated verification platform bridging the gap between academic credentials and real-world technical ability. By evaluating GitHub repositories and live deployments, it analyzes code complexity, verifies contributions, and tests performance to generate a dynamic, interactive ledger of a developer's proven technical skills.

---

## ✨ Key Features

* 🔍 **Automated Code & Contribution Analysis**
    * Parses repositories via the GitHub API to identify primary technology stacks.
    * Evaluates algorithmic complexity and architecture.
    * Verifies individual developer contributions through detailed commit histories.
* ⚡ **Live Deployment Verification**
    * Validates submitted application URLs using the Google PageSpeed Insights API.
    * Confirms deployments are active, responsive, and functional.
    * Audits accessibility and security headers in production environments.
* 📜 **Dynamic Proof Ledger**
    * Maintains a continuously updated, cinematic dashboard (powered by Framer Motion).
    * Translates raw backend metrics into an RPG-style "Skill Tree" portfolio.
    * Provides verifiable, direct links to completed project components.

---

## 🛠️ Technology Stack

### Frontend Architecture
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS (Cinematic Dark Mode)
* **Animations:** Framer Motion
* **Routing & State:** React DOM / Custom Hooks

### Backend Infrastructure
* **Runtime:** Node.js
* **ORM:** Prisma
* **Database:** Supabase (PostgreSQL)
* **External APIs:** GitHub API, Google PageSpeed Insights API, WakaTime API

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need active API keys for Supabase, GitHub, and Google Cloud.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/Skill-Tree.git](https://github.com/your-username/Skill-Tree.git)
cd Skill-Tree

```

### 2. Backend Setup

Navigate to the backend directory, install dependencies, and configure your environment.

```bash
cd skill-tree-backend
npm install

```

Create a `.env` file in the `skill-tree-backend` root directory using the table below as a reference:

| Environment Variable | Description |
| --- | --- |
| `DATABASE_URL` | Your Supabase PostgreSQL connection string (include your password) |
| `GITHUB_TOKEN` | GitHub Personal Access Token (Classic or Fine-grained) |
| `PAGESPEED_API_KEY` | Google Cloud API key for PageSpeed Insights |
| `WAKATIME_API_KEY` | WakaTime API key for coding hour verification |
| `PORT` | Local port for the backend server (e.g., `3000`) |

Initialize the database schema:

```bash
npx prisma generate
npx prisma db push

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and start the Vite development server.

```bash
cd prisma-creative-studio-landing-page
npm install
npm run dev

```

Open `http://localhost:5173` in your browser to access the Skill Tree interface.

---

## 📂 Repository Structure

```text
📦 SKILL-TREE
 ┣ 📂 prisma-creative-studio-landing-page   # React/Vite UI components and animations
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components                        # Dashboards, Input Engine, Proof Ledger
 ┃ ┃ ┗ 📂 utils
 ┃ ┗ 📜 package.json
 ┣ 📂 skill-tree-backend                    # Node.js logic and API integrations
 ┃ ┣ 📂 prisma                              # Database schemas
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 routes                            # GitHub, Deployment, and Ledger endpoints
 ┃ ┃ ┗ 📂 services                          # External API fetch logic
 ┃ ┗ 📜 package.json
 ┣ 📜 .gitignore                            # Root configuration for secure commits
 ┗ 📜 README.md

```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Soham Poddar** * GitHub: [@SohamFr](https://www.google.com/search?q=https://github.com/SohamFr)

> *Built for pure vision. Powered by verifiable execution.*

```

```
