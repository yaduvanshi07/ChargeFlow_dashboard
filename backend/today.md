# Today's Bookings — Feature Documentation

A complete reference for the `GET /api/bookings/today` endpoint and its dashboard integration in the ChargeFlow project.

---

## 1. Overview

The **Today's Bookings** feature surfaces all active and confirmed bookings scheduled for the current server date on the host dashboard. It is a **read-only, isolated feature** — it does not modify any existing booking lifecycle or status logic.

---

## 2. Backend

### 2.1 Endpoint

```
GET /api/bookings/today
```

**Base URL:** `http://localhost:5000/api/bookings/today`

**Auth:** No auth required (internal dashboard use).

---

### 2.2 Logic Inside the Controller

**File:** `backend/controllers/bookingController.js`  
**Function:** `exports.getTodaysBookings`

#### Date Computation (Server Time)
```js
const now = new Date();

const startOfDay = new Date(now);
startOfDay.setHours(0, 0, 0, 0);     // 00:00:00.000

const endOfDay = new Date(now);
endOfDay.setHours(23, 59, 59, 999);  // 23:59:59.999
```

#### MongoDB Query
```js
const query = {
  scheduledDateTime: { $gte: startOfDay, $lte: endOfDay },
  status: { $in: ['ACCEPTED', 'VERIFIED', 'COMPLETED'] }
};
```

| Included Statuses | Excluded Statuses |
|:-----------------:|:-----------------:|
| `ACCEPTED`        | `PENDING`         |
| `VERIFIED`        | `CANCELLED`       |
| `COMPLETED`       | `MISSED`          |

#### Sorting
Sorted by `scheduledDateTime` in **ascending order** — earliest booking first.

#### Populate
- `chargerId` → `name, location, type, power, status`
- `transactionId` → full transaction document

---

### 2.3 Route Registration

**File:** `backend/routes/bookings.js`

```js
// GET /api/bookings/today — Must be placed before /:id to avoid route conflict
router.get('/today', bookingController.getTodaysBookings);
```

---

### 2.4 Response Format

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Today's bookings fetched successfully",
  "data": [
    {
      "_id": "65d...",
      "bookingId": "BK1234567890",
      "customerName": "Rahul Sharma",
      "customerEmail": "rahul@example.com",
      "customerPhone": "9876543210",
      "chargerName": "FastCharge Station A",
      "chargerId": {
        "_id": "65c...",
        "name": "FastCharge Station A",
        "location": "Sector 12, Noida",
        "type": "DC",
        "power": "50kW",
        "status": "ONLINE"
      },
      "vehicleModel": "Tata Nexon EV",
      "vehicleNumber": "DL 01 AB 1234",
      "connectorType": "CCS2",
      "scheduledDateTime": "2026-02-23T12:30:00.000Z",
      "duration": 2,
      "amount": 500,
      "status": "ACCEPTED",
      "transactionId": null,
      "createdAt": "2026-02-23T08:00:00.000Z"
    }
  ]
}
```

**Error (500):**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

---

## 3. Frontend

### 3.1 Where It Renders

**File:** `app/dashboard/page.tsx`  
**Section:** *Today's Bookings* card in the bottom-right of the dashboard grid.

---

### 3.2 Data Fetching

```tsx
const [realTodaysBookings, setRealTodaysBookings] = useState<any[]>([]);
const [isLoadingBookings, setIsLoadingBookings] = useState(true);

React.useEffect(() => {
  const fetchTodaysBookings = async () => {
    try {
      const response = await fetch('/api/bookings/today');
      const result = await response.json();
      if (result.success) {
        setRealTodaysBookings(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch today's bookings:", error);
    } finally {
      setIsLoadingBookings(false);
    }
  };
  fetchTodaysBookings();
}, []);
```

---

### 3.3 Rendering Logic

| State | What Renders |
|:------|:-------------|
| Loading | Spinner (`animate-spin`) |
| API returns 0 results | 1 mock "Demo Data" item from `mockData.todaysBookings` (labeled with a grey badge) |
| API returns real data | Live `<BookingItem />` cards for each booking |

---

### 3.4 Field Mapping (API → BookingItem)

| `BookingItem` Prop | API Field | Fallback |
|:-------------------|:----------|:---------|
| `time` | `scheduledDateTime` (formatted to `hh:mm AM/PM`) | — |
| `duration` | `booking.duration` (appended with `" hr"`) | `"N/A"` |
| `chargerName` | `booking.chargerName` | `"Unknown Charger"` |
| `customerName` | `booking.customerName` | `"Customer"` |
| `vehicleName` | `booking.vehicleModel` | `"EV"` |
| `vehicleType` | `booking.connectorType` | `"EV"` |
| `status` | `booking.status` | — |

---

## 4. How a Booking Appears Automatically

A booking shows up here **without any manual intervention** once it flows through the normal lifecycle:

```
PENDING  →  ACCEPTED ✅  →  VERIFIED ✅  →  COMPLETED ✅
              ↑
    Shows in "Today's Bookings"
    from this point onwards
```

| Step | Action | Status | Appears in Today's? |
|:-----|:-------|:-------|:-------------------:|
| 1 | User creates booking request | `PENDING` | ❌ No |
| 2 | Host accepts the booking | `ACCEPTED` | ✅ Yes |
| 3 | User pays | `ACCEPTED` (BookingMgmt → `CONFIRMED`) | ✅ Yes |
| 4 | User enters password at station | `VERIFIED` | ✅ Yes |
| 5 | Session ends | `COMPLETED` | ✅ Yes |

> **Key Rule:** The `scheduledDateTime` of the booking must fall on **today's date**. A booking scheduled for tomorrow will NOT appear here.

---

## 5. Quick Test with Postman / cURL

### Step 1 — Create a booking (use today's date)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "chargerId": "<VALID_CHARGER_ID>",
    "scheduledDateTime": "2026-02-23T14:00:00.000Z",
    "duration": 2,
    "amount": 500
  }'
```

### Step 2 — Accept the booking
```bash
curl -X PUT http://localhost:5000/api/bookings/<BOOKING_OBJECT_ID>/accept
```

### Step 3 — Hit the Today endpoint
```bash
curl http://localhost:5000/api/bookings/today
```

The accepted booking will now appear in the JSON `data` array.

---

## 6. Files Modified

| File | Change |
|:-----|:-------|
| `backend/controllers/bookingController.js` | Added `exports.getTodaysBookings` at the bottom |
| `backend/routes/bookings.js` | Added `router.get('/today', ...)` before `/:id` |
| `app/dashboard/page.tsx` | Fetches `/api/bookings/today`, renders live data |

> **No other files were modified.** All existing booking logic is fully preserved.
