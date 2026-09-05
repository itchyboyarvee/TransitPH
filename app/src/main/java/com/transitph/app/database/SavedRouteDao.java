package com.transitph.app.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import com.transitph.app.models.SavedRoute;
import java.util.ArrayList;
import java.util.List;

public class SavedRouteDao {
    private final DatabaseHelper dbHelper;

    public SavedRouteDao(Context context) {
        this.dbHelper = DatabaseHelper.getInstance(context);
    }

    public List<SavedRoute> getSavedRoutesForUser(long userId) {
        List<SavedRoute> list = new ArrayList<>();
        SQLiteDatabase db = dbHelper.getReadableDatabase();

        String sql = "SELECT s." + DatabaseHelper.COL_SAVED_ID + ", s." + DatabaseHelper.COL_SAVED_USER_ID + ", s." + DatabaseHelper.COL_SAVED_ROUTE_ID + ", " +
                     "r." + DatabaseHelper.COL_ROUTE_NAME + ", r." + DatabaseHelper.COL_ROUTE_ORIGIN + ", r." + DatabaseHelper.COL_ROUTE_DESTINATION + ", " +
                     "r." + DatabaseHelper.COL_ROUTE_TRANSPORT_TYPE + ", r." + DatabaseHelper.COL_ROUTE_FARE + ", r." + DatabaseHelper.COL_ROUTE_TIME + ", " +
                     "t." + DatabaseHelper.COL_TERM_NAME + " AS term_name " +
                     "FROM " + DatabaseHelper.TABLE_SAVED_ROUTES + " s " +
                     "JOIN " + DatabaseHelper.TABLE_ROUTES + " r ON s." + DatabaseHelper.COL_SAVED_ROUTE_ID + " = r." + DatabaseHelper.COL_ROUTE_ID + " " +
                     "JOIN " + DatabaseHelper.TABLE_TERMINALS + " t ON r." + DatabaseHelper.COL_ROUTE_TERM_ID + " = t." + DatabaseHelper.COL_TERM_ID + " " +
                     "WHERE s." + DatabaseHelper.COL_SAVED_USER_ID + " = ? " +
                     "ORDER BY s." + DatabaseHelper.COL_SAVED_ID + " DESC";

        Cursor cursor = db.rawQuery(sql, new String[]{String.valueOf(userId)});
        if (cursor != null && cursor.moveToFirst()) {
            do {
                SavedRoute sr = new SavedRoute();
                sr.setId(cursor.getLong(0));
                sr.setUserId(cursor.getLong(1));
                sr.setRouteId(cursor.getLong(2));
                sr.setRouteName(cursor.getString(3));
                sr.setOrigin(cursor.getString(4));
                sr.setDestination(cursor.getString(5));
                sr.setTransportType(cursor.getString(6));
                sr.setFare(cursor.getDouble(7));
                sr.setEstimatedTravelTime(cursor.getInt(8));
                sr.setTerminalName(cursor.getString(9));
                list.add(sr);
            } while (cursor.moveToNext());
            cursor.close();
        }
        return list;
    }

    public boolean isRouteSaved(long userId, long routeId) {
        SQLiteDatabase db = dbHelper.getReadableDatabase();
        Cursor cursor = db.query(
                DatabaseHelper.TABLE_SAVED_ROUTES,
                new String[]{DatabaseHelper.COL_SAVED_ID},
                DatabaseHelper.COL_SAVED_USER_ID + " = ? AND " + DatabaseHelper.COL_SAVED_ROUTE_ID + " = ?",
                new String[]{String.valueOf(userId), String.valueOf(routeId)},
                null, null, null
        );
        boolean saved = (cursor != null && cursor.getCount() > 0);
        if (cursor != null) cursor.close();
        return saved;
    }

    public long saveRoute(long userId, long routeId) {
        if (isRouteSaved(userId, routeId)) {
            return -1; // Duplicate
        }
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        ContentValues cv = new ContentValues();
        cv.put(DatabaseHelper.COL_SAVED_USER_ID, userId);
        cv.put(DatabaseHelper.COL_SAVED_ROUTE_ID, routeId);
        return db.insert(DatabaseHelper.TABLE_SAVED_ROUTES, null, cv);
    }

    public int deleteSavedRoute(long userId, long routeId) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        return db.delete(
                DatabaseHelper.TABLE_SAVED_ROUTES,
                DatabaseHelper.COL_SAVED_USER_ID + " = ? AND " + DatabaseHelper.COL_SAVED_ROUTE_ID + " = ?",
                new String[]{String.valueOf(userId), String.valueOf(routeId)}
        );
    }

    public int deleteSavedRouteById(long savedRouteId) {
        SQLiteDatabase db = dbHelper.getWritableDatabase();
        return db.delete(
                DatabaseHelper.TABLE_SAVED_ROUTES,
                DatabaseHelper.COL_SAVED_ID + " = ?",
                new String[]{String.valueOf(savedRouteId)}
        );
    }
}
