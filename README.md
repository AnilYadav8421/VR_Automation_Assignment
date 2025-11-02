# Crypto Tracker

This project is a full-stack crypto tracker built as part of the **VR Automation assignment**.  
It shows the top 10 cryptocurrencies with their live price, market cap, and 24-hour price change.  
The backend collects data from the CoinGecko API and stores it in MongoDB automatically every hour.

---

## Tech Stack

**Frontend:** React (Vite) + Tailwind CSS + Axios + Framer Motion  
**Backend:** Node.js + Express + Mongoose + Axios + Node-cron  
**Database:** MongoDB Atlas  
**Deployment:**  
- **Frontend:** Vercel  
- **Backend:** Render  

---

## Live Links

- **Frontend:** [https://vr-automation-assignment.vercel.app](https://vr-automation-assignment.vercel.app)
- **Backend:** [https://vr-automation-assignment.onrender.com](https://vr-automation-assignment.onrender.com)

---
##  Project Setup

### 1 Frontend Setup

```bash
git clone https://github.com/AnilYadav8421/VR_Automation_Assignment.git
cd client
npm install
npm run dev

```
### 2 Backend Setup
```bash
git clone https://github.com/AnilYadav8421/VR_Automation_Assignment.git
cd server
npm install
Your backend will be available at
http://localhost:5000

---
API routes:
/api/coins → fetches latest coin data

```
### Folder Structure
```bash
crypto-tracker/
│
├── server/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── .env
│
└── client/
    ├── src/
    │   ├── components/
    │   └── App.jsx
    ├── public/
    └── package.json

```
### Cron Job
The backend automatically runs a cron job every hour.
It fetches the top 10 coins from CoinGecko and:
Updates the CurrentData collection
Saves a copy in the HistoryData collection
This ensures your app always displays the latest prices even if the CoinGecko API rate-limits requests.

###  Features
```bash
-Shows top 10 cryptocurrencies
-Hourly data update using cron
-Search and sort functionality
-Responsive and clean UI
-Smooth animations with Framer Motion
-MongoDB stores both live and historical data

```
 ### Screenshots

App dashboard view
![App Screenshot](assets/screenshot.png)

MongoDB data collections

Render cron logs

 Author

Anil Yadav
Built for the VR Automation Assignment
Deployed with Render + Vercel
