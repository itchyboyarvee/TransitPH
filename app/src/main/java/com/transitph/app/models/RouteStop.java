package com.transitph.app.models;

import java.io.Serializable;

public class RouteStop implements Serializable {
    private long id;
    private long routeId;
    private String stopName;
    private int sequence;

    public RouteStop() {}

    public RouteStop(long id, long routeId, String stopName, int sequence) {
        this.id = id;
        this.routeId = routeId;
        this.stopName = stopName;
        this.sequence = sequence;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public long getRouteId() { return routeId; }
    public void setRouteId(long routeId) { this.routeId = routeId; }

    public String getStopName() { return stopName; }
    public void setStopName(String stopName) { this.stopName = stopName; }

    public int getSequence() { return sequence; }
    public void setSequence(int sequence) { this.sequence = sequence; }
}
