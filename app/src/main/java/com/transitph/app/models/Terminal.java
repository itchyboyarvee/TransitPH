package com.transitph.app.models;

import java.io.Serializable;

public class Terminal implements Serializable {
    private long id;
    private String terminalName;
    private String city;
    private String province;
    private double latitude;
    private double longitude;
    private String description;
    private int routeCount;

    public Terminal() {}

    public Terminal(long id, String terminalName, String city, String province, double latitude, double longitude, String description) {
        this.id = id;
        this.terminalName = terminalName;
        this.city = city;
        this.province = province;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getTerminalName() { return terminalName; }
    public void setTerminalName(String terminalName) { this.terminalName = terminalName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getRouteCount() { return routeCount; }
    public void setRouteCount(int routeCount) { this.routeCount = routeCount; }

    public String getLocationText() {
        return city + ", " + province;
    }

    public String getCoordinatesText() {
        return String.format(java.util.Locale.US, "%.4f° N, %.4f° E", latitude, longitude);
    }
}
