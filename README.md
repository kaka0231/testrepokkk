# PulseIQ — Modern Analytics Dashboard Demo

An interactive, responsive SaaS Analytics Dashboard demo built with modern HTML5, CSS3 (Custom Properties & Responsive Grid/Flexbox), and vanilla JavaScript.

![PulseIQ Analytics Dashboard](https://img.shields.io/badge/Demo-Analytics%20Dashboard-8b5cf6?style=for-the-badge)

---

## 🌟 Key Features

- **Executive KPI Metric Cards**:
  - Live revenue, active org accounts, average order value, and conversion rates.
  - Interactive timeframe switcher (`7D`, `30D`, `90D`, `1Y`) that dynamically recalculates metrics and redraws mini sparklines.

- **Interactive Data Visualizations**:
  - **Revenue Spline Chart**: SVG bezier area chart with smooth gradients, interactive crosshair, point tracking, and floating tooltip displaying date, revenue, and order counts.
  - **Timeline Granularity**: Toggle between `Daily`, `Weekly`, and `Monthly` resolutions.
  - **Traffic Acquisition Donut**: Interactive breakdown of organic search, direct, social, and referral channels with segment hover and percentage focus.
  - **Simulate Pulse**: Real-time event simulator adding new transactions and updating live telemetry.

- **Transactions Ledger Table**:
  - Live search filter across customer name, ID, product tier, and email.
  - Status tabs (`All`, `Completed`, `Pending`, `Refunded`).
  - Column sorting (by ID, Customer, Tier, Date, Status, and Amount).
  - Client-side pagination and item count summaries.
  - **Export CSV**: One-click download of filtered transaction records.

- **User Interactions & Ergonomics**:
  - Light & Dark mode toggle with persistent state in `localStorage`.
  - Notification drawer with unread ping badges and "Mark all as read" capability.
  - "New Sale" modal dialog with live form validation, dynamically updating the KPI cards and transactions table.
  - Keyboard shortcuts (`/` for quick search focus, `Esc` to close modal/drawer).
  - Toast notification alerts for user actions.
  - Fully responsive drawer navigation on mobile and tablet devices.

---

## 🚀 Running the Demo

No build tools, bundlers, or package managers required. Simply open `index.html` in any modern web browser or serve it using Python or Node:

```bash
# Using Python
python3 -m http.server 8000

# Or using Node / npx
npx serve .
```

Then navigate to `http://localhost:8000`.
