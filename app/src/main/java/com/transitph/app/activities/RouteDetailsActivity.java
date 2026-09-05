package com.transitph.app.activities;

import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.adapters.TimelineAdapter;
import com.transitph.app.database.RouteDao;
import com.transitph.app.database.SavedRouteDao;
import com.transitph.app.models.Route;
import com.transitph.app.models.RouteStop;
import com.transitph.app.services.RouteSearchService;
import com.transitph.app.services.RouteSearchService.TimelineStep;
import com.transitph.app.utils.SessionManager;
import java.util.List;

public class RouteDetailsActivity extends AppCompatActivity {

    public static final String EXTRA_ROUTE = "extra_route";
    public static final String EXTRA_ROUTE_ID = "extra_route_id";

    private TextView tvRouteName;
    private TextView tvTransportType;
    private TextView tvFromTo;
    private TextView tvTerminal;
    private TextView tvFare;
    private TextView tvTravelTime;
    private TextView tvDescription;
    private TextView tvStopsSummary;
    private RecyclerView rvTimeline;
    private RadioGroup rgLanguage;
    private Button btnSaveRoute;
    private ImageButton btnBack;

    private Route route;
    private RouteDao routeDao;
    private SavedRouteDao savedRouteDao;
    private SessionManager sessionManager;
    private TimelineAdapter timelineAdapter;
    private List<TimelineStep> timelineSteps;
    private String selectedLanguage = "en";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_route_details);

        routeDao = new RouteDao(this);
        savedRouteDao = new SavedRouteDao(this);
        sessionManager = new SessionManager(this);

        route = (Route) getIntent().getSerializableExtra(EXTRA_ROUTE);
        if (route == null) {
            long routeId = getIntent().getLongExtra(EXTRA_ROUTE_ID, -1);
            if (routeId > 0) {
                route = routeDao.getRouteById(routeId);
            }
        }

        if (route == null) {
            Toast.makeText(this, "Route not found.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        initViews();
        bindRouteData();
    }

    private void initViews() {
        tvRouteName = findViewById(R.id.tv_details_route_name);
        tvTransportType = findViewById(R.id.tv_details_transport_type);
        tvFromTo = findViewById(R.id.tv_details_from_to);
        tvTerminal = findViewById(R.id.tv_details_terminal);
        tvFare = findViewById(R.id.tv_details_fare);
        tvTravelTime = findViewById(R.id.tv_details_travel_time);
        tvDescription = findViewById(R.id.tv_details_description);
        tvStopsSummary = findViewById(R.id.tv_details_stops_summary);
        rvTimeline = findViewById(R.id.rv_route_timeline);
        rgLanguage = findViewById(R.id.rg_instruction_language);
        btnSaveRoute = findViewById(R.id.btn_save_route_details);
        btnBack = findViewById(R.id.btn_back_details);

        btnBack.setOnClickListener(v -> finish());

        rvTimeline.setLayoutManager(new LinearLayoutManager(this));
        timelineSteps = RouteSearchService.generateTimelineSteps(route);
        timelineAdapter = new TimelineAdapter(timelineSteps, selectedLanguage);
        rvTimeline.setAdapter(timelineAdapter);

        rgLanguage.setOnCheckedChangeListener((group, checkedId) -> {
            if (checkedId == R.id.rb_lang_filipino) {
                selectedLanguage = "fil";
            } else {
                selectedLanguage = "en";
            }
            timelineAdapter.updateSteps(timelineSteps, selectedLanguage);
        });

        btnSaveRoute.setOnClickListener(v -> handleSaveRoute());
    }

    private void bindRouteData() {
        tvRouteName.setText(route.getRouteName());
        tvTransportType.setText(route.getTransportIconText());
        tvFromTo.setText(route.getOrigin() + " ➔ " + route.getDestination());
        tvTerminal.setText(route.getTerminalName() != null ? route.getTerminalName() : "Local Terminal");
        tvFare.setText(route.getFormattedFare());
        tvTravelTime.setText(route.getFormattedTime());
        tvDescription.setText(route.getDescription() != null ? route.getDescription() : "Standard commute route in CALABARZON.");

        if (route.getStops() != null && !route.getStops().isEmpty()) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < route.getStops().size(); i++) {
                RouteStop stop = route.getStops().get(i);
                sb.append(stop.getSequence()).append(". ").append(stop.getStopName());
                if (i < route.getStops().size() - 1) sb.append("\n");
            }
            tvStopsSummary.setText(sb.toString());
        } else {
            tvStopsSummary.setText("Direct transit line with standard street-level request stops.");
        }

        // Check if already saved
        long userId = sessionManager.getUserId();
        if (userId > 0 && savedRouteDao.isRouteSaved(userId, route.getId())) {
            btnSaveRoute.setText("✓ ROUTE ALREADY SAVED");
            btnSaveRoute.setEnabled(false);
        }
    }

    private void handleSaveRoute() {
        long userId = sessionManager.getUserId();
        if (userId <= 0) {
            Toast.makeText(this, "Please log in to save routes.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (savedRouteDao.isRouteSaved(userId, route.getId())) {
            Toast.makeText(this, "This route is already saved.", Toast.LENGTH_SHORT).show();
            btnSaveRoute.setText("✓ ROUTE ALREADY SAVED");
            btnSaveRoute.setEnabled(false);
            return;
        }

        long res = savedRouteDao.saveRoute(userId, route.getId());
        if (res > 0) {
            Toast.makeText(this, "Route saved successfully.", Toast.LENGTH_SHORT).show();
            btnSaveRoute.setText("✓ ROUTE SAVED");
            btnSaveRoute.setEnabled(false);
        } else {
            Toast.makeText(this, "This route is already saved.", Toast.LENGTH_SHORT).show();
        }
    }
}
