# High-Performance Data Monitoring Dashboard

A full-stack implementation focused on efficient handling of high-frequency data streams (5,000+ records) with custom security middleware.

##  Architectural Overview

### Frontend: Virtualized Data Stream
Rendering 5,000 items in a standard React list causes significant layout thrashing and dropped frames. 
* **Solution:** Implemented **Windowed Rendering** using `react-window`. 
* **Impact:** The DOM remains lean with only ~15-20 active nodes at any time. This ensures 60FPS scrolling performance regardless of total dataset size.
* **Optimization:** Used a custom namespace-resolution strategy for the virtualizer to ensure compatibility with Vite's ESM-only build pipeline.



### Backend: Custom Rate-Limiter Middleware
To satisfy the requirement of avoiding third-party security libraries for the core logic, I built a custom **IP-based Rate Limiter**.
* **Logic:** Implemented a **Fixed-Window** algorithm using a JavaScript `Map` for $O(1)$ lookup complexity.
* **Performance:** Unlike library-based solutions, this implementation has zero external dependencies and minimal memory overhead.
* **Security:** Blocks aggressive refresh-spamming and API scraping by enforcing a strict 50-request-per-minute ceiling per IP.



### Data Persistence & Schema
* **Schema Design:** Indexed the `id` and `timestamp` fields within MongoDB to ensure $O(\log n)$ query performance for time-series data.
* **Validation:** Integrated a strict validation middleware to sanitize incoming data packets before they reach the controller layer.

---

##  Tech Stack
- **Frontend:** React 18, Vite (SWC), React-Window
- **Backend:** Node.js, Express, Mongoose
- **DevOps:** npm Workspaces, Nodemon

## Getting Started

1. **Clone and Install:**
   ```bash
   npm install

2. Run Server:
cd server
npm run dev
3. Run Client:
cd client
npm run dev