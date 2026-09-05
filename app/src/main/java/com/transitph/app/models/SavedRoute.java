package com.transitph.app.models;

import java.io.Serializable;

public class SavedRoute implements Serializable {
    private long id;
    private long userId;
    private long routeId;
    private String routeName;
    private String origin;
    private String destination;
    private String transportType;
    private double fare;
    private int estimatedTravelTime;
    private String terminalName;

    public SavedRoute() {}

    public SavedRoute(long id, long userId, long routeId) {
        this.id = id;
        this.userId = userId;
        this.routeId = routeId;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public long getRouteId() { return routeId; }
    public void setRouteId(long routeId) { this.routeId = routeId; }

    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getTransportType() { return transportType; }
    public void setTransportType(String transportType) { this.transportType = transportType; }

    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }

    public int getEstimatedTravelTime() { return estimatedTravelTime; }
    public void setEstimatedTravelTime(int estimatedTravelTime) { this.estimatedTravelTime = estimatedTravelTime; }

    public String getTerminalName() { return terminalName; }
    public void setTerminalName(String terminalName) { this.terminalName = terminalName; }

    public String getFormattedFare() {
        return String.format(java.util.Locale.US, "₱%.2f", fare);
    }
}
