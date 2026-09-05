package com.transitph.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.adapters.RouteAdapter;
import com.transitph.app.database.RouteDao;
import com.transitph.app.database.SavedRouteDao;
import com.transitph.app.models.Route;
import com.transitph.app.utils.SessionManager;
import java.util.List;

public class RouteResultsActivity extends AppCompatActivity implements RouteAdapter.OnRouteClickListener {

    public static final String EXTRA_FROM = "extra_from";
    public static final String EXTRA_TO = "extra_to";

    private TextView tvSearchSummary;
    private TextView tvResultCount;
    private RecyclerView rvRouteResults;
    private View layoutEmptyState;
    private ImageButton btnBack;

    private RouteDao routeDao;
    private SavedRouteDao savedRouteDao;
    private SessionManager sessionManager;
    private RouteAdapter adapter;

    private String queryFrom = "";
    private String queryTo = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_route_results);

        routeDao = new RouteDao(this);
        savedRouteDao = new SavedRouteDao(this);
        sessionManager = new SessionManager(this);

        queryFrom = getIntent().getStringExtra(EXTRA_FROM);
        queryTo = getIntent().getStringExtra(EXTRA_TO);

        if (queryFrom == null) queryFrom = "";
        if (queryTo == null) queryTo = "";

        initViews();
        loadResults();
    }

    private void initViews() {
        tvSearchSummary = findViewById(R.id.tv_search_summary);
        tvResultCount = findViewById(R.id.tv_result_count);
        rvRouteResults = findViewById(R.id.rv_route_results);
        layoutEmptyState = findViewById(R.id.layout_empty_state);
        btnBack = findViewById(R.id.btn_back_results);

        btnBack.setOnClickListener(v -> finish());

        rvRouteResults.setLayoutManager(new LinearLayoutManager(this));
        adapter = new RouteAdapter(null, this);
        rvRouteResults.setAdapter(adapter);

        String summary = "";
        if (!queryFrom.isEmpty() && !queryTo.isEmpty()) {
            summary = queryFrom + " → " + queryTo;
        } else if (!queryFrom.isEmpty()) {
            summary = "From " + queryFrom;
        } else if (!queryTo.isEmpty()) {
            summary = "To " + queryTo;
        } else {
            summary = "All CALABARZON Routes";
        }
        tvSearchSummary.setText(summary);
    }

    private void loadResults() {
        List<Route> routes = routeDao.searchRoutes(queryFrom, queryTo);
        if (routes.isEmpty()) {
            rvRouteResults.setVisibility(View.GONE);
            layoutEmptyState.setVisibility(View.VISIBLE);
            tvResultCount.setText("0 routes found");
        } else {
            rvRouteResults.setVisibility(View.VISIBLE);
            layoutEmptyState.setVisibility(View.GONE);
            tvResultCount.setText(routes.size() + " route option" + (routes.size() > 1 ? "s" : "") + " available");
            adapter.setRoutes(routes);
        }
    }

    @Override
    public void onRouteClick(Route route) {
        Intent intent = new Intent(this, RouteDetailsActivity.class);
        intent.putExtra(RouteDetailsActivity.EXTRA_ROUTE, route);
        startActivity(intent);
    }

    @Override
    public void onSaveRouteClick(Route route) {
        long userId = sessionManager.getUserId();
        if (userId <= 0) {
            Toast.makeText(this, "Please log in to save routes.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (savedRouteDao.isRouteSaved(userId, route.getId())) {
            Toast.makeText(this, "This route is already saved.", Toast.LENGTH_SHORT).show();
            return;
        }

        long res = savedRouteDao.saveRoute(userId, route.getId());
        if (res > 0) {
            Toast.makeText(this, "Route saved successfully.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "This route is already saved.", Toast.LENGTH_SHORT).show();
        }
    }
}
