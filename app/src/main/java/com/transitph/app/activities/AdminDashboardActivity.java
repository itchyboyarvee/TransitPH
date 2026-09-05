package com.transitph.app.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.transitph.app.R;
import com.transitph.app.database.RouteDao;
import com.transitph.app.database.TerminalDao;
import com.transitph.app.utils.SessionManager;

public class AdminDashboardActivity extends AppCompatActivity {

    private TextView tvAdminEmail;
    private TextView tvTotalTerminals;
    private TextView tvTotalRoutes;
    private Button btnManageTerminals;
    private Button btnManageRoutes;
    private ImageButton btnBack;

    private SessionManager sessionManager;
    private TerminalDao terminalDao;
    private RouteDao routeDao;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);
        if (!sessionManager.isAdmin()) {
            Toast.makeText(this, "Access denied: Administrator privileges required.", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setContentView(R.layout.activity_admin_dashboard);

        terminalDao = new TerminalDao(this);
        routeDao = new RouteDao(this);

        initViews();
    }

    @Override
    protected void onResume() {
        super.onResume();
        refreshStats();
    }

    private void initViews() {
        tvAdminEmail = findViewById(R.id.tv_admin_email);
        tvTotalTerminals = findViewById(R.id.tv_stat_terminals_count);
        tvTotalRoutes = findViewById(R.id.tv_stat_routes_count);
        btnManageTerminals = findViewById(R.id.btn_go_manage_terminals);
        btnManageRoutes = findViewById(R.id.btn_go_manage_routes);
        btnBack = findViewById(R.id.btn_back_admin);

        tvAdminEmail.setText("Logged in as: " + sessionManager.getEmail());

        btnBack.setOnClickListener(v -> finish());

        btnManageTerminals.setOnClickListener(v -> {
            startActivity(new Intent(AdminDashboardActivity.this, ManageTerminalsActivity.class));
        });

        btnManageRoutes.setOnClickListener(v -> {
            startActivity(new Intent(AdminDashboardActivity.this, ManageRoutesActivity.class));
        });
    }

    private void refreshStats() {
        int terminalCount = terminalDao.getAllTerminals().size();
        int routeCount = routeDao.getAllRoutes().size();

        tvTotalTerminals.setText(String.valueOf(terminalCount));
        tvTotalRoutes.setText(String.valueOf(routeCount));
    }
}
