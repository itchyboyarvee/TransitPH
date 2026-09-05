# TransitPH: An Integrated Multi-Modal Transit Navigation and Commuter Safety System

**30% System Implementation — Software Development Midterm Examination**

TransitPH is a **native Android mobile application** built using **pure Java and Android XML layouts**, structured for direct opening and compilation in **Android Studio**. It delivers localized, accessible, and structured transit guidance across the CALABARZON region (Cavite, Laguna, Batangas, Rizal, Quezon), addressing daily commuter challenges with terminal discovery, multi-modal route planning, multilingual assistance, and offline persistence.

---

## 📱 Technology Stack & Adherence to Specifications

* **Operating System / Platform:** Android (Native)
* **IDE Compatibility:** Android Studio (Hedgehog / Iguana / Jellyfish / Ladybug / Meerkat)
* **Programming Language:** **Java** (100% Java application logic; strictly **no** Kotlin, Flutter, React Native, or web frameworks)
* **UI & Layouts:** **Android XML** (ConstraintLayout, CardView, RecyclerView, Material Design)
* **Build System:** **Gradle** (AGP 8.2+, Gradle Wrapper)
* **Local Persistence:** **SQLite** via native `SQLiteOpenHelper` with automated schema creation and initial seeding
* **Session Persistence:** `SharedPreferences` for user session token, role permissions, and active language preferences
* **Architecture Pattern:** Clean separation of concerns across Models, DAOs, Services, Adapters, Activities, and Fragments.

---

## 🎯 System Scope Breakdown

### 30% Implemented Midterm Modules (Fully Functional in this Codebase)
1. **User Authentication & Session Management:**
   - Registration with input validation (name, email format, minimum 6-character password, password confirmation matching, unique email constraint).
   - Secure Login with SHA-256 password hashing.
   - Persistent login state via `SharedPreferences` (auto-redirect to Main Screen).
   - Role-Based Access Control (Admin vs. Commuter/User).
   - Sign Out mechanism.

2. **Route Finder Engine (CALABARZON Transit Network):**
   - Multi-modal route calculation (Jeepney, Bus, Walking connections).
   - Search by origin and destination keywords (e.g. *Calamba* to *Santa Rosa*, *Dasmariñas* to *Tagaytay*).
   - Detailed route metrics: Fare in Philippine Pesos (₱), estimated travel time in minutes, transfer count, and walking distance.
   - Interactive step-by-step visual timeline showing waypoint transitions.
   - Dynamic bilingual route instruction switcher (English ↔ Filipino).

3. **Terminal Information & Tracker:**
   - Database of major CALABARZON transit terminals (Calamba Central Terminal, Balibago Commercial Complex, Robinsons Dasmariñas Transit Hub, Grand Central Terminal Batangas).
   - Facility details, municipal/provincial locations, and GPS coordinates.
   - Real-time search and filtering.
   - Direct listing of all available transit routes departing from each terminal.

4. **Assisted Navigation & Multilingual Phrasebook:**
   - Local commuter assistance in three languages: **English**, **Filipino (Tagalog)**, and **Bikol (Regional)**.
   - Categorized commuter phrases: Directions, Transportation, Fare handling, Getting off ("Para po!"), and Commuter courtesy.
   - Built-in Android Text-to-Speech (TTS) audio pronunciation playback.
   - Cultural commuter hints (passing fare through fellow passengers, landmark requests).

5. **Saved Routes (Offline Personal Bookmarks):**
   - Save frequently taken routes with a single tap.
   - Duplicate prevention with user-friendly alerts.
   - Dedicated Saved Routes tab with immediate removal and offline viewing.

6. **Administrator Network Management (CRUD):**
   - Administrator dashboard with real-time database counts.
   - **Terminal CRUD:** Create new terminals, view existing, edit details and GPS coordinates, and delete terminals with cascade alerts.
   - **Route CRUD:** Create routes, assign terminals, specify vehicle types, set fares and travel durations, edit routes, and delete routes.

---

### Remaining 70% Scope (Future Roadmap for Final Project)
The following capabilities represent the remaining 70% of the production specification:
* **Live GPS Fleet Tracking:** Real-time OBD-II/GPS vehicle beacon positions on interactive map tiles.
* **Emergency SOS & Responder Dispatch:** Panic button triggering SMS/cellular alerts with live geolocation to Philippine National Police (PNP) or local DRRMO units.
* **Crowd-Sourced Incident Reports:** Citizen road obstruction, flooding, and traffic collision hazard reporting.
* **Cashless Contactless Fare Payments:** In-app Beep card NFC balance inquiries and QR code ticketing.
* **AI Dynamic Re-routing:** Real-time congestion rerouting via traffic heatmaps.

---

## 🔑 Pre-Configured Demo Accounts

The local SQLite database automatically seeds on first launch:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Commuter (User)** | `user@transitph.test` | `User123!` | Route search, terminal lookup, multilingual phrasebook, save routes, profile view |
| **Administrator** | `admin@transitph.test` | `Admin123!` | Full user capabilities **plus** Admin Dashboard, Terminal CRUD, Route CRUD |

*(Note: The Login screen includes one-tap "Fill USER" and "Fill ADMIN" buttons for rapid evaluation).*

---

## 🧪 13-Step Demonstration & Verification Sequence

Follow this step-by-step walkthrough to evaluate the complete 30% implementation:

1. **Launch App:** Open the app. The Login screen appears with the TransitPH header, credentials form, and midterm scope badge.
2. **Account Registration:** Tap **"Register here"**. Enter a new name (e.g. *Juan dela Cruz*), email (`juan@transitph.test`), password (`Pass123!`), and confirm password. Tap **CREATE ACCOUNT**. The app validates input and displays *"Account created successfully."*
3. **Log In:** Tap **"Fill USER"** (or enter `user@transitph.test` / `User123!`). Tap **LOGIN**. A welcome greeting appears, and you are brought to the Home screen.
4. **Explore Home Dashboard:** Observe the greeting (*"Kumusta, Maria Santos 👋"*), the origin/destination inputs, the 4 Quick Access buttons, the Assisted Navigation banner, and Saved Routes preview.
5. **Search for a Transit Route:** In the **From** field enter `Calamba`, in the **To** field enter `Santa Rosa`. Tap **FIND ROUTE**.
6. **Review Search Results:** The `RouteResultsActivity` displays matching options (e.g., *Calamba → Santa Rosa Via Balibago*), showing the Jeepney badge, ₱30.00 fare, 45 min duration, 1 transfer, and 500m walking distance.
7. **Inspect Route Details & Timeline:** Tap **VIEW ROUTE**. Examine the step-by-step timeline (Walk to terminal → Board jeepney → Alight). Toggle the language switcher between **EN** and **FIL** to observe bilingual instruction translation.
8. **Bookmark Route:** Tap **SAVE ROUTE TO MY SAVED LIST**. A confirmation *"Route saved successfully."* appears and the button updates to *"✓ ROUTE SAVED"*. Tapping again verifies duplicate detection.
9. **Verify Saved Routes:** Navigate back and tap the **Saved** tab in the bottom bar. The newly saved route is present with [VIEW ITINERARY] and [DELETE] actions.
10. **Explore Terminals:** Tap the **Terminals** tab. View the list of CALABARZON hubs. Type `Balibago` in the search bar to test real-time filtering. Tap **VIEW TERMINAL & ROUTES** to see terminal GPS coordinates, amenities, and departing lines.
11. **Test Assisted Navigation:** Tap the **Assistant** tab. Switch the language dropdown to **Filipino** or **Bikol**. Filter phrases by **Fare** or **Getting Off**. Tap **LISTEN** on *"Para po sa tabi!"* to trigger local speech synthesis.
12. **Log Out & Switch to Admin:** Tap the **Profile** tab and tap **LOG OUT OF ACCOUNT**. On the login screen, tap **"Fill ADMIN"** (`admin@transitph.test` / `Admin123!`) and log in.
13. **Perform Admin CRUD Operations:** Go to **Profile** → **OPEN ADMIN DASHBOARD**:
    - Tap **MANAGE TERMINALS**: Tap **➕ ADD NEW TERMINAL**, enter *Lipa City Bus Grand Terminal*, City *Lipa*, Province *Batangas*, tap **SAVE TERMINAL**. The new terminal appears instantly in the list. Tap **✏️ EDIT** or **🗑️ DELETE** to test database updates.
    - Tap **MANAGE ROUTES**: Tap **➕ ADD NEW TRANSIT ROUTE**, fill in Origin, Destination, select terminal, fare, and duration. Save and verify that the route is immediately searchable in the Commuter Route Finder!

---

## 📂 Project Directory Structure

```
TransitPH/
├── app/
│   ├── build.gradle
│   ├── proguard-rules.pro
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/transitph/app/
│           │   ├── activities/
│           │   │   ├── LoginActivity.java
│           │   │   ├── RegisterActivity.java
│           │   │   ├── MainActivity.java
│           │   │   ├── RouteResultsActivity.java
│           │   │   ├── RouteDetailsActivity.java
│           │   │   ├── TerminalDetailsActivity.java
│           │   │   ├── AdminDashboardActivity.java
│           │   │   ├── ManageTerminalsActivity.java
│           │   │   └── ManageRoutesActivity.java
│           │   ├── fragments/
│           │   │   ├── HomeFragment.java
│           │   │   ├── RouteFinderFragment.java
│           │   │   ├── TerminalsFragment.java
│           │   │   ├── AssistedNavigationFragment.java
│           │   │   ├── SavedRoutesFragment.java
│           │   │   └── ProfileFragment.java
│           │   ├── adapters/
│           │   │   ├── RouteAdapter.java
│           │   │   ├── TerminalAdapter.java
│           │   │   ├── SavedRouteAdapter.java
│           │   │   ├── PhraseAdapter.java
│           │   │   └── TimelineAdapter.java
│           │   ├── models/
│           │   │   ├── User.java
│           │   │   ├── Terminal.java
│           │   │   ├── Route.java
│           │   │   ├── RouteStop.java
│           │   │   ├── SavedRoute.java
│           │   │   └── CommuterPhrase.java
│           │   ├── database/
│           │   │   ├── DatabaseHelper.java
│           │   │   ├── UserDao.java
│           │   │   ├── TerminalDao.java
│           │   │   ├── RouteDao.java
│           │   │   └── SavedRouteDao.java
│           │   ├── services/
│           │   │   ├── AuthenticationService.java
│           │   │   └── RouteSearchService.java
│           │   └── utils/
│           │       ├── PasswordUtils.java
│           │       └── SessionManager.java
│           └── res/
│               ├── layout/ (24 XML layouts & dialogs)
│               ├── menu/bottom_nav_menu.xml
│               ├── values/ (colors.xml, strings.xml, styles.xml)
│               └── drawable/
├── build.gradle
├── settings.gradle
├── gradle.properties
└── README.md
```

---

## 🛠️ How to Open and Run in Android Studio

1. Open **Android Studio**.
2. Select **File > Open...** and choose the root directory of this project (`TransitPH`).
3. Allow Gradle to sync dependencies (AndroidX, Material Components, CardView, ConstraintLayout).
4. Select an Android Emulator or connected physical device running **Android 8.0 (API 26) or higher** (Target SDK: API 34).
5. Click **Run > Run 'app'** (or press `Shift + F10`).
6. The app launches immediately to the Login screen with seeded demo data ready for evaluation.
