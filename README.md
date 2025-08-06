#  Realtime Chat Dashboard

This is a full-stack real-time chat dashboard built with:

- **Frontend:** Vite + React + TypeScript + Tailwind + React Query + Socket.IO client  
- **Backend:** Node.js + Express + Socket.IO

It supports live message updates and typing indicators using WebSockets.


---

##  Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/isaacbill/Real-time-Chat-Dashboard.git
cd Real-time-Chat-Dashboard

 ## Install & Run Backend**
cd backend
npm install
node server.js
server running on http://localhost:5000

** ## Install & Run Frontend**
cd ../frontend
npm install
npm run dev
App will open on: http://localhost:5173

---

 **Real-Time Interaction Steps**
**Open Two Tabs:**

Open http://localhost:5173 in two browser tabs or windows.

**Typing Indicator Test:**

In Tab A, start typing in the input box.

In Tab B, you should see: "You is typing..."

**Send a Message:**

Press Enter in Tab A.

The message instantly appears in both Tab A and Tab B.

**Typing Stops:**

If you clear the input or stop typing, the indicator disappears in the other tab.

**Live Feed:**

All new messages stream live without page refresh.
