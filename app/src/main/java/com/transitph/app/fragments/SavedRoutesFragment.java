package com.transitph.app.fragments;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.activities.RouteDetailsActivity;
import com.transitph.app.adapters.SavedRouteAdapter;
import com.transitph.app.database.SavedRouteDao;
import com.transitph.app.models.SavedRoute;
import com.transitph.app.utils.SessionManager;
import java.util.List;

public class SavedRoutesFragment extends Fragment implements SavedRouteAdapter.OnSavedRouteClickListener {

    private RecyclerView rvSavedRoutes;
    private View layoutEmptyState;
    private TextView tvSavedCount;

    private SavedRouteDao savedRouteDao;
    private SessionManager sessionManager;
    private SavedRouteAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_saved_routes, container, false);

        savedRouteDao = new SavedRouteDao(requireContext());
        sessionManager = new SessionManager(requireContext());

        initViews(view);
        loadSavedRoutes();

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();
        loadSavedRoutes();
    }

    private void initViews(View view) {
        rvSavedRoutes = view.findViewById(R.id.rv_saved_routes);
        layoutEmptyState = view.findViewById(R.id.layout_saved_empty);
        tvSavedCount = view.findViewById(R.id.tv_saved_routes_count);

        rvSavedRoutes.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new SavedRouteAdapter(null, this);
        rvSavedRoutes.setAdapter(adapter);
    }

    private void loadSavedRoutes() {
        long userId = sessionManager.getUserId();
        if (userId <= 0) {
            rvSavedRoutes.setVisibility(View.GONE);
            layoutEmptyState.setVisibility(View.VISIBLE);
            tvSavedCount.setText("0 saved routes");
            return;
        }

        List<SavedRoute> list = savedRouteDao.getSavedRoutesForUser(userId);
        tvSavedCount.setText(list.size() + " route" + (list.size() == 1 ? "" : "s") + " saved for offline access");

        if (list.isEmpty()) {
            rvSavedRoutes.setVisibility(View.GONE);
            layoutEmptyState.setVisibility(View.VISIBLE);
        } else {
            rvSavedRoutes.setVisibility(View.VISIBLE);
            layoutEmptyState.setVisibility(View.GONE);
            adapter.setSavedRoutes(list);
        }
    }

    @Override
    public void onViewRoute(SavedRoute savedRoute) {
        Intent intent = new Intent(requireContext(), RouteDetailsActivity.class);
        intent.putExtra(RouteDetailsActivity.EXTRA_ROUTE_ID, savedRoute.getRouteId());
        startActivity(intent);
    }

    @Override
    public void onDeleteRoute(SavedRoute savedRoute) {
        new AlertDialog.Builder(requireContext())
                .setTitle("Remove this saved route?")
                .setMessage("Are you sure you want to remove '" + savedRoute.getRouteName() + "' from your saved routes?")
                .setPositiveButton("REMOVE", (dialog, which) -> {
                    savedRouteDao.deleteSavedRouteById(savedRoute.getId());
                    Toast.makeText(requireContext(), "Route removed from saved list.", Toast.LENGTH_SHORT).show();
                    loadSavedRoutes();
                })
                .setNegativeButton("CANCEL", null)
                .show();
    }
}
