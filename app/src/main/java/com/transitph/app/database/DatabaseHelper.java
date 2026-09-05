package com.transitph.app.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import com.transitph.app.utils.PasswordUtils;

public class DatabaseHelper extends SQLiteOpenHelper {

    public static final String DATABASE_NAME = "transitph.db";
    public static final int DATABASE_VERSION = 1;

    // Table: users
    public static final String TABLE_USERS = "users";
    public static final String COL_USER_ID = "id";
    public static final String COL_USER_FULL_NAME = "fullName";
    public static final String COL_USER_EMAIL = "email";
    public static final String COL_USER_PASSWORD_HASH = "passwordHash";
    public static final String COL_USER_ROLE = "role"; // USER or ADMIN

    // Table: terminals
    public static final String TABLE_TERMINALS = "terminals";
    public static final String COL_TERM_ID = "id";
    public static final String COL_TERM_NAME = "terminalName";
    public static final String COL_TERM_CITY = "city";
    public static final String COL_TERM_PROVINCE = "province";
    public static final String COL_TERM_LAT = "latitude";
    public static final String COL_TERM_LNG = "longitude";
    public static final String COL_TERM_DESC = "description";

    // Table: routes
    public static final String TABLE_ROUTES = "routes";
    public static final String COL_ROUTE_ID = "id";
    public static final String COL_ROUTE_TERM_ID = "terminalId";
    public static final String COL_ROUTE_NAME = "routeName";
    public static final String COL_ROUTE_ORIGIN = "origin";
    public static final String COL_ROUTE_DESTINATION = "destination";
    public static final String COL_ROUTE_TRANSPORT_TYPE = "transportType";
    public static final String COL_ROUTE_FARE = "fare";
    public static final String COL_ROUTE_TIME = "estimatedTravelTime";
    public static final String COL_ROUTE_DESC = "description";

    // Table: route_stops
    public static final String TABLE_ROUTE_STOPS = "route_stops";
    public static final String COL_STOP_ID = "id";
    public static final String COL_STOP_ROUTE_ID = "routeId";
    public static final String COL_STOP_NAME = "stopName";
    public static final String COL_STOP_SEQUENCE = "sequence";

    // Table: saved_routes
    public static final String TABLE_SAVED_ROUTES = "saved_routes";
    public static final String COL_SAVED_ID = "id";
    public static final String COL_SAVED_USER_ID = "userId";
    public static final String COL_SAVED_ROUTE_ID = "routeId";

    private static DatabaseHelper instance;

    public static synchronized DatabaseHelper getInstance(Context context) {
        if (instance == null) {
            instance = new DatabaseHelper(context.getApplicationContext());
        }
        return instance;
    }

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        // Create Users Table
        db.execSQL("CREATE TABLE " + TABLE_USERS + " (" +
                COL_USER_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_USER_FULL_NAME + " TEXT NOT NULL, " +
                COL_USER_EMAIL + " TEXT UNIQUE NOT NULL, " +
                COL_USER_PASSWORD_HASH + " TEXT NOT NULL, " +
                COL_USER_ROLE + " TEXT NOT NULL DEFAULT 'USER');");

        // Create Terminals Table
        db.execSQL("CREATE TABLE " + TABLE_TERMINALS + " (" +
                COL_TERM_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_TERM_NAME + " TEXT NOT NULL, " +
                COL_TERM_CITY + " TEXT NOT NULL, " +
                COL_TERM_PROVINCE + " TEXT NOT NULL, " +
                COL_TERM_LAT + " REAL NOT NULL, " +
                COL_TERM_LNG + " REAL NOT NULL, " +
                COL_TERM_DESC + " TEXT);");

        // Create Routes Table
        db.execSQL("CREATE TABLE " + TABLE_ROUTES + " (" +
                COL_ROUTE_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_ROUTE_TERM_ID + " INTEGER NOT NULL, " +
                COL_ROUTE_NAME + " TEXT NOT NULL, " +
                COL_ROUTE_ORIGIN + " TEXT NOT NULL, " +
                COL_ROUTE_DESTINATION + " TEXT NOT NULL, " +
                COL_ROUTE_TRANSPORT_TYPE + " TEXT NOT NULL, " +
                COL_ROUTE_FARE + " REAL NOT NULL, " +
                COL_ROUTE_TIME + " INTEGER NOT NULL, " +
                COL_ROUTE_DESC + " TEXT, " +
                "FOREIGN KEY (" + COL_ROUTE_TERM_ID + ") REFERENCES " + TABLE_TERMINALS + "(" + COL_TERM_ID + ") ON DELETE CASCADE);");

        // Create Route Stops Table
        db.execSQL("CREATE TABLE " + TABLE_ROUTE_STOPS + " (" +
                COL_STOP_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_STOP_ROUTE_ID + " INTEGER NOT NULL, " +
                COL_STOP_NAME + " TEXT NOT NULL, " +
                COL_STOP_SEQUENCE + " INTEGER NOT NULL, " +
                "FOREIGN KEY (" + COL_STOP_ROUTE_ID + ") REFERENCES " + TABLE_ROUTES + "(" + COL_ROUTE_ID + ") ON DELETE CASCADE);");

        // Create Saved Routes Table
        db.execSQL("CREATE TABLE " + TABLE_SAVED_ROUTES + " (" +
                COL_SAVED_ID + " INTEGER PRIMARY KEY AUTOINCREMENT, " +
                COL_SAVED_USER_ID + " INTEGER NOT NULL, " +
                COL_SAVED_ROUTE_ID + " INTEGER NOT NULL, " +
                "UNIQUE(" + COL_SAVED_USER_ID + ", " + COL_SAVED_ROUTE_ID + "), " +
                "FOREIGN KEY (" + COL_SAVED_USER_ID + ") REFERENCES " + TABLE_USERS + "(" + COL_USER_ID + ") ON DELETE CASCADE, " +
                "FOREIGN KEY (" + COL_SAVED_ROUTE_ID + ") REFERENCES " + TABLE_ROUTES + "(" + COL_ROUTE_ID + ") ON DELETE CASCADE);");

        seedDemoData(db);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_SAVED_ROUTES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ROUTE_STOPS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_ROUTES);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_TERMINALS);
        db.execSQL("DROP TABLE IF EXISTS " + TABLE_USERS);
        onCreate(db);
    }

    private void seedDemoData(SQLiteDatabase db) {
        // 1. Seed Demo Accounts
        // Admin account: admin@transitph.test / Admin123!
        ContentValues adminUser = new ContentValues();
        adminUser.put(COL_USER_FULL_NAME, "TransitPH Administrator");
        adminUser.put(COL_USER_EMAIL, "admin@transitph.test");
        adminUser.put(COL_USER_PASSWORD_HASH, PasswordUtils.hashPassword("Admin123!"));
        adminUser.put(COL_USER_ROLE, "ADMIN");
        db.insert(TABLE_USERS, null, adminUser);

        // Commuter account: user@transitph.test / User123!
        ContentValues normalUser = new ContentValues();
        normalUser.put(COL_USER_FULL_NAME, "Maria Santos");
        normalUser.put(COL_USER_EMAIL, "user@transitph.test");
        normalUser.put(COL_USER_PASSWORD_HASH, PasswordUtils.hashPassword("User123!"));
        normalUser.put(COL_USER_ROLE, "USER");
        long normalUserId = db.insert(TABLE_USERS, null, normalUser);

        // 2. Seed CALABARZON Terminals (16 realistic terminals across Laguna, Cavite, Batangas, Rizal, Quezon)
        // LAGUNA
        long termCalamba = insertTerminal(db, "Calamba Jeepney Terminal", "Calamba", "Laguna", 14.2132, 121.1648, "Central terminal near SM City Calamba and Crossing.");
        long termBalibago = insertTerminal(db, "Balibago Complex Terminal", "Santa Rosa", "Laguna", 14.2965, 121.1114, "Primary transit hub connecting Santa Rosa to Metro Manila and Laguna towns.");
        long termPacita = insertTerminal(db, "Pacita Central Terminal", "San Pedro", "Laguna", 14.3492, 121.0543, "Major southern gateway terminal serving San Pedro and Biñan commuters.");
        long termBinan = insertTerminal(db, "Biñan Central Jeepney Terminal", "Biñan", "Laguna", 14.3382, 121.0825, "Located near Biñan People's Center and market district.");
        long termLosBanos = insertTerminal(db, "Los Baños Junction Terminal", "Los Baños", "Laguna", 14.1706, 121.2428, "Gateway terminal for UPLB campus, IRRI, and thermal springs.");
        long termSanPablo = insertTerminal(db, "San Pablo City Public Terminal", "San Pablo", "Laguna", 14.0683, 121.3256, "Central hub servicing the City of Seven Lakes.");

        // CAVITE
        long termDasma = insertTerminal(db, "Dasmariñas Central Terminal (Pala-Pala)", "Dasmariñas", "Cavite", 14.2981, 120.9575, "Major Cavite crossroad intersection terminal near SM Dasmariñas and Robinsons.");
        long termBacoor = insertTerminal(db, "Bacoor St. Dominic Terminal", "Bacoor", "Cavite", 14.4442, 120.9702, "North Cavite terminal connecting coastal commuters to Metro Manila.");
        long termImus = insertTerminal(db, "Imus Transport Terminal (Lumang Bayan)", "Imus", "Cavite", 14.4295, 120.9367, "Central district hub along Aguinaldo Highway.");
        long termTagaytay = insertTerminal(db, "Tagaytay Olivarez Plaza Terminal", "Tagaytay", "Cavite", 14.1153, 120.9621, "Tourist and commuter hub along Tagaytay-Calamba Road.");

        // BATANGAS
        long termBatangasGrand = insertTerminal(db, "Batangas City Grand Terminal", "Batangas City", "Batangas", 13.7844, 121.0664, "Provincial multimodal terminal with direct connections to Batangas Port.");
        long termLipa = insertTerminal(db, "Lipa SM City Grand Terminal", "Lipa City", "Batangas", 13.9419, 121.1631, "Major eastern Batangas hub serving routes to Manila and Laguna.");
        long termTanauan = insertTerminal(db, "Tanauan City Transport Terminal", "Tanauan", "Batangas", 14.0858, 121.1506, "Northern Batangas junction serving industrial parks and commuters.");

        // RIZAL
        long termAntipolo = insertTerminal(db, "Antipolo Masinag Transit Terminal", "Antipolo", "Rizal", 14.6231, 121.1219, "LRT-2 connected multimodal terminal serving upper and lower Antipolo.");
        long termTaytay = insertTerminal(db, "Taytay Bagong Palengke Terminal", "Taytay", "Rizal", 14.5682, 121.1342, "Garments capital hub with routes to Ortigas, Pasig, and Cainta.");

        // QUEZON
        long termLucena = insertTerminal(db, "Lucena Grand Central Terminal", "Lucena City", "Quezon", 13.9511, 121.6169, "Quezon province's premier integrated interprovincial bus and jeepney terminal.");

        // 3. Seed Realistic Routes (34 sample routes across all 5 provinces)
        // LAGUNA ROUTES
        long r1 = insertRoute(db, termCalamba, "Calamba – Santa Rosa (Via Balibago)", "Calamba", "Santa Rosa", "Jeepney", 30.00, 45, "Regular jeepney line running via National Highway passing Cabuyao and Balibago.");
        insertStop(db, r1, "Calamba Crossing Terminal", 1);
        insertStop(db, r1, "Parian Checkpoint", 2);
        insertStop(db, r1, "Cabuyao Bayan", 3);
        insertStop(db, r1, "Balibago Commercial Complex", 4);
        insertStop(db, r1, "Santa Rosa Bayan", 5);

        long r2 = insertRoute(db, termCalamba, "Calamba – Santa Rosa (Nuvali Bus Express)", "Calamba", "Santa Rosa", "Bus", 40.00, 35, "Air-conditioned P2P bus from Calamba SM to Nuvali Santa Rosa.");
        insertStop(db, r2, "SM City Calamba Bay 2", 1);
        insertStop(db, r2, "Mayapa SLEX Entry", 2);
        insertStop(db, r2, "Nuvali Robinsons Transport Hub", 3);
        insertStop(db, r2, "Santa Rosa Hospital & Bayan", 4);

        long r3 = insertRoute(db, termCalamba, "Calamba Crossing – Los Baños Junction", "Calamba", "Los Baños", "Jeepney", 22.00, 25, "Jeepney connecting Calamba town proper to UPLB entrance and hot spring resorts.");
        insertStop(db, r3, "Calamba Terminal", 1);
        insertStop(db, r3, "Bucal Bypass", 2);
        insertStop(db, r3, "Pansol Spring Resort Strip", 3);
        insertStop(db, r3, "Los Baños Junction", 4);

        long r4 = insertRoute(db, termBalibago, "Santa Rosa (Balibago) – Biñan Bayan", "Santa Rosa", "Biñan", "Jeepney", 18.00, 20, "Short-haul connector jeepney via Old National Highway.");
        insertStop(db, r4, "Balibago Terminal", 1);
        insertStop(db, r4, "Macabling Junction", 2);
        insertStop(db, r4, "Pavilion Mall", 3);
        insertStop(db, r4, "Biñan Public Market", 4);

        long r5 = insertRoute(db, termBalibago, "Santa Rosa – Calamba (Via Cabuyao)", "Santa Rosa", "Calamba", "Jeepney", 30.00, 45, "Return journey from Santa Rosa Balibago complex southwards to Calamba Crossing.");
        insertStop(db, r5, "Balibago Terminal", 1);
        insertStop(db, r5, "SM City Santa Rosa", 2);
        insertStop(db, r5, "Cabuyao Katapatan", 3);
        insertStop(db, r5, "Calamba Crossing Terminal", 4);

        long r6 = insertRoute(db, termPacita, "Pacita – Biñan Central", "San Pedro", "Biñan", "Jeepney", 15.00, 15, "Fast local route along Manila South Road connecting San Pedro and Biñan.");
        long r7 = insertRoute(db, termPacita, "San Pedro – Alabang Starmall", "San Pedro", "Muntinlupa", "Jeepney", 25.00, 30, "Metro boundary connection from Pacita directly to Alabang terminal.");
        long r8 = insertRoute(db, termBinan, "Biñan – Carmona Cavite", "Biñan", "Carmona", "Jeepney", 17.00, 20, "Interprovincial Laguna-Cavite route through Southwoods.");
        long r9 = insertRoute(db, termLosBanos, "Los Baños – San Pablo City", "Los Baños", "San Pablo", "Jeepney", 35.00, 40, "Scenic route via Bay and Calauan pinya highway to San Pablo.");
        long r10 = insertRoute(db, termSanPablo, "San Pablo – Calamba Crossing", "San Pablo", "Calamba", "Bus", 55.00, 50, "Direct provincial bus via Maharlika Highway.");

        // CAVITE ROUTES
        long r11 = insertRoute(db, termDasma, "Dasmariñas (Pala-Pala) – Tagaytay Olivarez", "Dasmariñas", "Tagaytay", "Bus", 50.00, 40, "Air-conditioned provincial bus climbing Aguinaldo Highway into Tagaytay.");
        insertStop(db, r11, "Robinsons Dasma Terminal", 1);
        insertStop(db, r11, "Silang Bypass", 2);
        insertStop(db, r11, "Tagaytay Rotonda", 3);
        insertStop(db, r11, "Olivarez Plaza Hub", 4);

        long r12 = insertRoute(db, termDasma, "Dasmariñas – Imus Lumang Bayan", "Dasmariñas", "Imus", "Jeepney", 24.00, 30, "Main commuter spine connecting south and central Cavite.");
        long r13 = insertRoute(db, termDasma, "Dasmariñas – Bacoor St. Dominic", "Dasmariñas", "Bacoor", "Jeepney", 32.00, 45, "High-density commuter route along Aguinaldo Highway.");
        long r14 = insertRoute(db, termTagaytay, "Tagaytay Olivarez – Santa Rosa (Balibago)", "Tagaytay", "Santa Rosa", "Jeepney", 45.00, 55, "Scenic downhill descent along Santa Rosa-Tagaytay Road passing Paseo de Santa Rosa.");
        insertStop(db, r14, "Olivarez Jeepney Bay", 1);
        insertStop(db, r14, "Nuvali South Gate", 2);
        insertStop(db, r14, "Paseo Outlets", 3);
        insertStop(db, r14, "Balibago Terminal", 4);

        long r15 = insertRoute(db, termTagaytay, "Tagaytay – Calamba Crossing", "Tagaytay", "Calamba", "Jeepney", 55.00, 65, "Interprovincial Cavite-Laguna jeepney descending into Canlubang.");
        long r16 = insertRoute(db, termBacoor, "Bacoor – PITX Metro Manila", "Bacoor", "Parañaque", "Bus", 35.00, 30, "Express bus via Cavitex directly to Parañaque Integrated Terminal Exchange.");
        long r17 = insertRoute(db, termImus, "Imus – Dasmariñas Pala-Pala", "Imus", "Dasmariñas", "Jeepney", 24.00, 30, "Southbound jeepney to Dasmariñas commerce district.");

        // BATANGAS ROUTES
        long r18 = insertRoute(db, termBatangasGrand, "Batangas Grand Terminal – Lipa City SM", "Batangas City", "Lipa City", "Jeepney", 42.00, 50, "Main arterial Batangas route connecting capital city to Lipa.");
        long r19 = insertRoute(db, termBatangasGrand, "Batangas Grand Terminal – Calamba Crossing", "Batangas City", "Calamba", "Bus", 95.00, 75, "Provincial highway bus via STAR Tollway to Laguna.");
        long r20 = insertRoute(db, termLipa, "Lipa City – Tanauan Terminal", "Lipa City", "Tanauan", "Jeepney", 30.00, 35, "Jeepney route passing Malvar industrial zone.");
        long r21 = insertRoute(db, termLipa, "Lipa SM – San Pablo City", "Lipa City", "San Pablo", "Jeepney", 38.00, 45, "Route passing through Alaminos into Laguna.");
        long r22 = insertRoute(db, termTanauan, "Tanauan – Calamba Crossing", "Tanauan", "Calamba", "Jeepney", 28.00, 35, "Boundary crossing jeepney connecting Batangas to Laguna.");
        insertStop(db, r22, "Tanauan Public Market", 1);
        insertStop(db, r22, "Santo Tomas Junction", 2);
        insertStop(db, r22, "Turbina Flyover", 3);
        insertStop(db, r22, "Calamba Crossing", 4);

        // RIZAL ROUTES
        long r23 = insertRoute(db, termAntipolo, "Antipolo Masinag – Taytay Bagong Palengke", "Antipolo", "Taytay", "Jeepney", 20.00, 25, "Connector route down Cabrera Road to Taytay marketplace.");
        long r24 = insertRoute(db, termAntipolo, "Antipolo Simbahan – Cubao LRT-2", "Antipolo", "Quezon City", "Jeepney", 35.00, 45, "Iconic eastern Rizal to Metro Manila commuter jeepney.");
        long r25 = insertRoute(db, termTaytay, "Taytay Bagong Palengke – Cainta Junction", "Taytay", "Cainta", "Jeepney", 16.00, 18, "Short haul route along Ortigas Extension.");
        long r26 = insertRoute(db, termTaytay, "Taytay – Pasig Palengke", "Taytay", "Pasig", "Jeepney", 24.00, 30, "Direct boundary commuter jeepney into eastern Metro Manila.");

        // QUEZON ROUTES
        long r27 = insertRoute(db, termLucena, "Lucena Grand Terminal – Sariaya Town Proper", "Lucena City", "Sariaya", "Jeepney", 25.00, 30, "Westbound Quezon commuter line.");
        long r28 = insertRoute(db, termLucena, "Lucena Grand Terminal – San Pablo City", "Lucena City", "San Pablo", "Bus", 75.00, 60, "Provincial bus connecting Quezon province into southern Laguna.");
        long r29 = insertRoute(db, termLucena, "Lucena – Batangas Grand Terminal", "Lucena City", "Batangas City", "Bus", 120.00, 90, "Interprovincial bus connecting Southern Tagalog coastal hubs.");

        // MULTI-MODAL DEMO SPECIFIC ROUTES
        long r30 = insertRoute(db, termCalamba, "Calamba Crossing to SM City Walkway", "Calamba", "Calamba SM", "Walking", 0.00, 8, "Designated pedestrian overpass and sidewalk walkway.");
        long r31 = insertRoute(db, termBalibago, "Balibago Terminal to Target Mall Walkway", "Santa Rosa", "Santa Rosa Target Mall", "Walking", 0.00, 5, "Covered pedestrian walkway linking terminal to mall entrance.");
        long r32 = insertRoute(db, termDasma, "Dasmariñas Pala-Pala Inter-Terminal Link", "Dasmariñas", "SM Dasmariñas", "Walking", 0.00, 6, "Pedestrian footbridge connecting bus bay to jeepney queue.");
        long r33 = insertRoute(db, termCalamba, "Calamba – Santa Rosa (Via Cabuyao Express Jeep)", "Calamba", "Santa Rosa", "Jeepney", 32.00, 40, "Fast commuter jeepney with minimal passenger stops along bypass road.");
        long r34 = insertRoute(db, termBalibago, "Santa Rosa – Manila (Buendia LRT P2P)", "Santa Rosa", "Pasay", "Bus", 85.00, 60, "Point-to-point commuter bus operating via SLEX.");

        // 4. Pre-save one sample route for the demo user
        ContentValues saved = new ContentValues();
        saved.put(COL_SAVED_USER_ID, normalUserId);
        saved.put(COL_SAVED_ROUTE_ID, r1);
        db.insert(TABLE_SAVED_ROUTES, null, saved);
    }

    private long insertTerminal(SQLiteDatabase db, String name, String city, String province, double lat, double lng, String desc) {
        ContentValues cv = new ContentValues();
        cv.put(COL_TERM_NAME, name);
        cv.put(COL_TERM_CITY, city);
        cv.put(COL_TERM_PROVINCE, province);
        cv.put(COL_TERM_LAT, lat);
        cv.put(COL_TERM_LNG, lng);
        cv.put(COL_TERM_DESC, desc);
        return db.insert(TABLE_TERMINALS, null, cv);
    }

    private long insertRoute(SQLiteDatabase db, long termId, String name, String origin, String dest, String type, double fare, int time, String desc) {
        ContentValues cv = new ContentValues();
        cv.put(COL_ROUTE_TERM_ID, termId);
        cv.put(COL_ROUTE_NAME, name);
        cv.put(COL_ROUTE_ORIGIN, origin);
        cv.put(COL_ROUTE_DESTINATION, dest);
        cv.put(COL_ROUTE_TRANSPORT_TYPE, type);
        cv.put(COL_ROUTE_FARE, fare);
        cv.put(COL_ROUTE_TIME, time);
        cv.put(COL_ROUTE_DESC, desc);
        return db.insert(TABLE_ROUTES, null, cv);
    }

    private void insertStop(SQLiteDatabase db, long routeId, String stopName, int seq) {
        ContentValues cv = new ContentValues();
        cv.put(COL_STOP_ROUTE_ID, routeId);
        cv.put(COL_STOP_NAME, stopName);
        cv.put(COL_STOP_SEQUENCE, seq);
        db.insert(TABLE_ROUTE_STOPS, null, cv);
    }
}
