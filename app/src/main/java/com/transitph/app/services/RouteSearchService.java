package com.transitph.app.services;

import android.content.Context;
import com.transitph.app.database.RouteDao;
import com.transitph.app.models.Route;
import com.transitph.app.models.RouteStop;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class RouteSearchService {
    private final RouteDao routeDao;

    public static class TimelineStep implements Serializable {
        private final String stepNumber;
        private final String iconType; // WALK, RIDE_JEEP, RIDE_BUS, ARRIVE
        private final String title;
        private final String instructionEnglish;
        private final String instructionFilipino;
        private final String timeOrDistance;

        public TimelineStep(String stepNumber, String iconType, String title, String instructionEnglish, String instructionFilipino, String timeOrDistance) {
            this.stepNumber = stepNumber;
            this.iconType = iconType;
            this.title = title;
            this.instructionEnglish = instructionEnglish;
            this.instructionFilipino = instructionFilipino;
            this.timeOrDistance = timeOrDistance;
        }

        public String getStepNumber() { return stepNumber; }
        public String getIconType() { return iconType; }
        public String getTitle() { return title; }
        public String getInstructionEnglish() { return instructionEnglish; }
        public String getInstructionFilipino() { return instructionFilipino; }
        public String getTimeOrDistance() { return timeOrDistance; }

        public String getInstruction(String lang) {
            if ("fil".equalsIgnoreCase(lang) || "filipino".equalsIgnoreCase(lang) || "tagalog".equalsIgnoreCase(lang)) {
                return instructionFilipino;
            }
            return instructionEnglish;
        }
    }

    public RouteSearchService(Context context) {
        this.routeDao = new RouteDao(context);
    }

    public List<Route> search(String origin, String destination) {
        return routeDao.searchRoutes(origin, destination);
    }

    public static List<TimelineStep> generateTimelineSteps(Route route) {
        List<TimelineStep> steps = new ArrayList<>();
        String termName = route.getTerminalName() != null ? route.getTerminalName() : "Local Transit Terminal";
        String transport = route.getTransportType() != null ? route.getTransportType() : "Jeepney";
        boolean isBus = "Bus".equalsIgnoreCase(transport);

        // Step 1: Walk to terminal
        steps.add(new TimelineStep(
                "1",
                "WALK",
                "Walk to " + termName,
                "Walk approximately 350 meters to " + termName + " and proceed to the designated boarding bay.",
                "Maglakad ng humigit-kumulang 350 metro papunta sa " + termName + " at pumunta sa itinalagang sakayan.",
                "5-8 mins • ~350m"
        ));

        // Step 2: Board transport
        String iconType = isBus ? "RIDE_BUS" : "RIDE_JEEP";
        String rideEn = "Board the " + transport + " marked '" + route.getRouteName() + "'. Hand " + route.getFormattedFare() + " fare to the driver/conductor upon seating.";
        String rideFil = "Sumakay sa " + transport + " na may karatulang '" + route.getRouteName() + "'. Iabot ang pamasaheng " + route.getFormattedFare() + " sa drayber o konduktor.";
        steps.add(new TimelineStep(
                "2",
                iconType,
                "Ride " + transport + " (" + route.getRouteName() + ")",
                rideEn,
                rideFil,
                route.getEstimatedTravelTime() + " mins • " + route.getFormattedFare()
        ));

        // Step 3: Transit intermediate stops if available
        if (route.getStops() != null && !route.getStops().isEmpty()) {
            StringBuilder stopsList = new StringBuilder();
            for (RouteStop s : route.getStops()) {
                if (stopsList.length() > 0) stopsList.append(" ➔ ");
                stopsList.append(s.getStopName());
            }
            steps.add(new TimelineStep(
                    "3",
                    "TRANSIT",
                    "Passing Route Waypoints",
                    "Key stops along route: " + stopsList.toString(),
                    "Mga pangunahing hihintuan sa ruta: " + stopsList.toString(),
                    route.getStops().size() + " stops"
            ));
        }

        // Final Step: Alight & walk to final destination
        steps.add(new TimelineStep(
                String.valueOf(steps.size() + 1),
                "ARRIVE",
                "Alight at " + route.getDestination(),
                "Inform the driver 'Para po' when approaching " + route.getDestination() + " and walk to your final destination.",
                "Sabihin sa drayber ang 'Para po' kapag malapit na sa " + route.getDestination() + " at maglakad patungo sa iyong pupuntahan.",
                "Arrived • 2 mins walk"
        ));

        return steps;
    }
}
