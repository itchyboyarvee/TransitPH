package com.transitph.app.activities;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.database.RouteDao;
import com.transitph.app.database.TerminalDao;
import com.transitph.app.models.Route;
import com.transitph.app.models.Terminal;
import com.transitph.app.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

public class ManageRoutesActivity extends AppCompatActivity {

    private RecyclerView rvRoutes;
    private Button btnAddRoute;
    private ImageButton btnBack;
    private TextView tvRouteCount;

    private RouteDao routeDao;
    private TerminalDao terminalDao;
    private SessionManager sessionManager;
    private ManageRouteAdapter adapter;
    private List<Route> routeList = new ArrayList<>();
    private List<Terminal> terminalList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);
        if (!sessionManager.isAdmin()) {
            Toast.makeText(this, "Access denied: Administrator privileges required.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setContentView(R.layout.activity_manage_routes);
        routeDao = new RouteDao(this);
        terminalDao = new TerminalDao(this);

        initViews();
        loadData();
    }

    private void initViews() {
        rvRoutes = findViewById(R.id.rv_manage_routes);
        btnAddRoute = findViewById(R.id.btn_add_route_action);
        btnBack = findViewById(R.id.btn_back_manage_routes);
        tvRouteCount = findViewById(R.id.tv_manage_routes_count);

        btnBack.setOnClickListener(v -> finish());
        btnAddRoute.setOnClickListener(v -> showRouteDialog(null));

        rvRoutes.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ManageRouteAdapter();
        rvRoutes.setAdapter(adapter);
    }

    private void loadData() {
        routeList = routeDao.getAllRoutes();
        terminalList = terminalDao.getAllTerminals();
        tvRouteCount.setText(routeList.size() + " routes in database");
        adapter.notifyDataSetChanged();
    }

    private void showRouteDialog(Route existingRoute) {
        if (terminalList.isEmpty()) {
            Toast.makeText(this, "Please create at least one terminal first.", Toast.LENGTH_SHORT).show();
            return;
        }

        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_route, null);
        EditText etName = dialogView.findViewById(R.id.et_dr_name);
        EditText etOrigin = dialogView.findViewById(R.id.et_dr_origin);
        EditText etDestination = dialogView.findViewById(R.id.et_dr_destination);
        Spinner spTerminal = dialogView.findViewById(R.id.sp_dr_terminal);
        Spinner spTransport = dialogView.findViewById(R.id.sp_dr_transport);
        EditText etFare = dialogView.findViewById(R.id.et_dr_fare);
        EditText etTime = dialogView.findViewById(R.id.et_dr_time);
        EditText etDesc = dialogView.findViewById(R.id.et_dr_desc);

        // Populate terminal spinner
        List<String> termNames = new ArrayList<>();
        int selectedTermIndex = 0;
        for (int i = 0; i < terminalList.size(); i++) {
            Terminal t = terminalList.get(i);
            termNames.add(t.getTerminalName() + " (" + t.getCity() + ")");
            if (existingRoute != null && existingRoute.getTerminalId() == t.getId()) {
                selectedTermIndex = i;
            }
        }
        ArrayAdapter<String> termAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, termNames);
        spTerminal.setAdapter(termAdapter);
        spTerminal.setSelection(selectedTermIndex);

        // Populate transport type spinner
        String[] transportTypes = {"Jeepney", "Bus", "Walking"};
        ArrayAdapter<String> transAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, transportTypes);
        spTransport.setAdapter(transAdapter);

        boolean isEdit = (existingRoute != null);
        if (isEdit) {
            etName.setText(existingRoute.getRouteName());
            etOrigin.setText(existingRoute.getOrigin());
            etDestination.setText(existingRoute.getDestination());
            etFare.setText(String.valueOf(existingRoute.getFare()));
            etTime.setText(String.valueOf(existingRoute.getEstimatedTravelTime()));
            etDesc.setText(existingRoute.getDescription());

            for (int i = 0; i < transportTypes.length; i++) {
                if (transportTypes[i].equalsIgnoreCase(existingRoute.getTransportType())) {
                    spTransport.setSelection(i);
                    break;
                }
            }
        }

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle(isEdit ? "Edit Route" : "Add New Route")
                .setView(dialogView)
                .setPositiveButton("SAVE ROUTE", null)
                .setNegativeButton("CANCEL", null)
                .create();

        dialog.setOnShowListener(d -> {
            Button saveBtn = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
            saveBtn.setOnClickListener(v -> {
                String name = etName.getText().toString().trim();
                String origin = etOrigin.getText().toString().trim();
                String destination = etDestination.getText().toString().trim();
                String fareStr = etFare.getText().toString().trim();
                String timeStr = etTime.getText().toString().trim();
                String desc = etDesc.getText().toString().trim();
                String transport = transportTypes[spTransport.getSelectedItemPosition()];
                Terminal selectedTerminal = terminalList.get(spTerminal.getSelectedItemPosition());

                if (name.isEmpty() || origin.isEmpty() || destination.isEmpty() || fareStr.isEmpty() || timeStr.isEmpty()) {
                    Toast.makeText(ManageRoutesActivity.this, "Please fill in all required fields.", Toast.LENGTH_SHORT).show();
                    return;
                }

                double fare = 0;
                int time = 0;
                try {
                    fare = Double.parseDouble(fareStr);
                    time = Integer.parseInt(timeStr);
                } catch (NumberFormatException e) {
                    Toast.makeText(ManageRoutesActivity.this, "Invalid fare or travel time number.", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (isEdit) {
                    existingRoute.setRouteName(name);
                    existingRoute.setOrigin(origin);
                    existingRoute.setDestination(destination);
                    existingRoute.setTerminalId(selectedTerminal.getId());
                    existingRoute.setTerminalName(selectedTerminal.getTerminalName());
                    existingRoute.setTransportType(transport);
                    existingRoute.setFare(fare);
                    existingRoute.setEstimatedTravelTime(time);
                    existingRoute.setDescription(desc);

                    int res = routeDao.updateRoute(existingRoute);
                    if (res > 0) {
                        Toast.makeText(ManageRoutesActivity.this, "Route updated successfully.", Toast.LENGTH_SHORT).show();
                        loadData();
                        dialog.dismiss();
                    } else {
                        Toast.makeText(ManageRoutesActivity.this, "Failed to update route.", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Route newRoute = new Route(0, selectedTerminal.getId(), name, origin, destination, transport, fare, time, desc);
                    newRoute.setTerminalName(selectedTerminal.getTerminalName());
                    long res = routeDao.insertRoute(newRoute);
                    if (res > 0) {
                        Toast.makeText(ManageRoutesActivity.this, "Route created successfully.", Toast.LENGTH_SHORT).show();
                        loadData();
                        dialog.dismiss();
                    } else {
                        Toast.makeText(ManageRoutesActivity.this, "Failed to insert route.", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        });

        dialog.show();
    }

    private void confirmDeleteRoute(Route route) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Route?")
                .setMessage("Are you sure you want to delete the route '" + route.getRouteName() + "'?")
                .setPositiveButton("DELETE", (dialog, which) -> {
                    int res = routeDao.deleteRoute(route.getId());
                    if (res > 0) {
                        Toast.makeText(ManageRoutesActivity.this, "Route deleted successfully.", Toast.LENGTH_SHORT).show();
                        loadData();
                    } else {
                        Toast.makeText(ManageRoutesActivity.this, "Failed to delete route.", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("CANCEL", null)
                .show();
    }

    private class ManageRouteAdapter extends RecyclerView.Adapter<ManageRouteAdapter.ViewHolder> {

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_manage_route, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Route r = routeList.get(position);
            holder.tvName.setText(r.getRouteName());
            holder.tvFromTo.setText(r.getOrigin() + " → " + r.getDestination());
            holder.tvMeta.setText(r.getTransportIconText() + " • " + r.getFormattedFare() + " • " + r.getFormattedTime());
            holder.tvTerminal.setText("📍 " + (r.getTerminalName() != null ? r.getTerminalName() : "Terminal"));

            holder.btnEdit.setOnClickListener(v -> showRouteDialog(r));
            holder.btnDelete.setOnClickListener(v -> confirmDeleteRoute(r));
        }

        @Override
        public int getItemCount() {
            return routeList.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvFromTo, tvMeta, tvTerminal;
            Button btnEdit, btnDelete;

            public ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_mr_name);
                tvFromTo = itemView.findViewById(R.id.tv_mr_from_to);
                tvMeta = itemView.findViewById(R.id.tv_mr_meta);
                tvTerminal = itemView.findViewById(R.id.tv_mr_terminal);
                btnEdit = itemView.findViewById(R.id.btn_mr_edit);
                btnDelete = itemView.findViewById(R.id.btn_mr_delete);
            }
        }
    }
}
