package com.transitph.app.activities;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.database.TerminalDao;
import com.transitph.app.models.Terminal;
import com.transitph.app.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;

public class ManageTerminalsActivity extends AppCompatActivity {

    private RecyclerView rvTerminals;
    private Button btnAddTerminal;
    private ImageButton btnBack;
    private TextView tvTerminalCount;

    private TerminalDao terminalDao;
    private SessionManager sessionManager;
    private ManageTerminalAdapter adapter;
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

        setContentView(R.layout.activity_manage_terminals);
        terminalDao = new TerminalDao(this);

        initViews();
        loadTerminals();
    }

    private void initViews() {
        rvTerminals = findViewById(R.id.rv_manage_terminals);
        btnAddTerminal = findViewById(R.id.btn_add_terminal_action);
        btnBack = findViewById(R.id.btn_back_manage_terminals);
        tvTerminalCount = findViewById(R.id.tv_manage_terminals_count);

        btnBack.setOnClickListener(v -> finish());
        btnAddTerminal.setOnClickListener(v -> showTerminalDialog(null));

        rvTerminals.setLayoutManager(new LinearLayoutManager(this));
        adapter = new ManageTerminalAdapter();
        rvTerminals.setAdapter(adapter);
    }

    private void loadTerminals() {
        terminalList = terminalDao.getAllTerminals();
        tvTerminalCount.setText(terminalList.size() + " terminals in database");
        adapter.notifyDataSetChanged();
    }

    private void showTerminalDialog(Terminal existingTerminal) {
        View dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_add_terminal, null);
        EditText etName = dialogView.findViewById(R.id.et_dt_name);
        EditText etCity = dialogView.findViewById(R.id.et_dt_city);
        EditText etProvince = dialogView.findViewById(R.id.et_dt_province);
        EditText etLat = dialogView.findViewById(R.id.et_dt_lat);
        EditText etLng = dialogView.findViewById(R.id.et_dt_lng);
        EditText etDesc = dialogView.findViewById(R.id.et_dt_desc);

        boolean isEdit = (existingTerminal != null);

        if (isEdit) {
            etName.setText(existingTerminal.getTerminalName());
            etCity.setText(existingTerminal.getCity());
            etProvince.setText(existingTerminal.getProvince());
            etLat.setText(String.valueOf(existingTerminal.getLatitude()));
            etLng.setText(String.valueOf(existingTerminal.getLongitude()));
            etDesc.setText(existingTerminal.getDescription());
        }

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle(isEdit ? "Edit Terminal" : "Add New Terminal")
                .setView(dialogView)
                .setPositiveButton("SAVE TERMINAL", null)
                .setNegativeButton("CANCEL", null)
                .create();

        dialog.setOnShowListener(d -> {
            Button saveBtn = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
            saveBtn.setOnClickListener(v -> {
                String name = etName.getText().toString().trim();
                String city = etCity.getText().toString().trim();
                String province = etProvince.getText().toString().trim();
                String latStr = etLat.getText().toString().trim();
                String lngStr = etLng.getText().toString().trim();
                String desc = etDesc.getText().toString().trim();

                if (name.isEmpty() || city.isEmpty() || province.isEmpty()) {
                    Toast.makeText(ManageTerminalsActivity.this, "Terminal Name, City, and Province are required.", Toast.LENGTH_SHORT).show();
                    return;
                }

                double lat = 14.2000;
                double lng = 121.1500;
                try {
                    if (!latStr.isEmpty()) lat = Double.parseDouble(latStr);
                    if (!lngStr.isEmpty()) lng = Double.parseDouble(lngStr);
                } catch (NumberFormatException e) {
                    Toast.makeText(ManageTerminalsActivity.this, "Invalid coordinates format.", Toast.LENGTH_SHORT).show();
                    return;
                }

                if (isEdit) {
                    existingTerminal.setTerminalName(name);
                    existingTerminal.setCity(city);
                    existingTerminal.setProvince(province);
                    existingTerminal.setLatitude(lat);
                    existingTerminal.setLongitude(lng);
                    existingTerminal.setDescription(desc);
                    int res = terminalDao.updateTerminal(existingTerminal);
                    if (res > 0) {
                        Toast.makeText(ManageTerminalsActivity.this, "Terminal updated successfully.", Toast.LENGTH_SHORT).show();
                        loadTerminals();
                        dialog.dismiss();
                    } else {
                        Toast.makeText(ManageTerminalsActivity.this, "Failed to update terminal.", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Terminal newTerm = new Terminal(0, name, city, province, lat, lng, desc);
                    long res = terminalDao.insertTerminal(newTerm);
                    if (res > 0) {
                        Toast.makeText(ManageTerminalsActivity.this, "Terminal created successfully.", Toast.LENGTH_SHORT).show();
                        loadTerminals();
                        dialog.dismiss();
                    } else {
                        Toast.makeText(ManageTerminalsActivity.this, "Failed to insert terminal.", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        });

        dialog.show();
    }

    private void confirmDeleteTerminal(Terminal terminal) {
        new AlertDialog.Builder(this)
                .setTitle("Delete Terminal?")
                .setMessage("Are you sure you want to delete this terminal? All associated routes will also be removed.")
                .setPositiveButton("DELETE", (dialog, which) -> {
                    int res = terminalDao.deleteTerminal(terminal.getId());
                    if (res > 0) {
                        Toast.makeText(ManageTerminalsActivity.this, "Terminal deleted successfully.", Toast.LENGTH_SHORT).show();
                        loadTerminals();
                    } else {
                        Toast.makeText(ManageTerminalsActivity.this, "Failed to delete terminal.", Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("CANCEL", null)
                .show();
    }

    private class ManageTerminalAdapter extends RecyclerView.Adapter<ManageTerminalAdapter.ViewHolder> {

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_manage_terminal, parent, false);
            return new ViewHolder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            Terminal t = terminalList.get(position);
            holder.tvName.setText(t.getTerminalName());
            holder.tvLocation.setText(t.getLocationText());
            holder.tvRoutes.setText(t.getRouteCount() + " Routes");

            holder.btnEdit.setOnClickListener(v -> showTerminalDialog(t));
            holder.btnDelete.setOnClickListener(v -> confirmDeleteTerminal(t));
        }

        @Override
        public int getItemCount() {
            return terminalList.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView tvName, tvLocation, tvRoutes;
            Button btnEdit, btnDelete;

            public ViewHolder(@NonNull View itemView) {
                super(itemView);
                tvName = itemView.findViewById(R.id.tv_mt_name);
                tvLocation = itemView.findViewById(R.id.tv_mt_location);
                tvRoutes = itemView.findViewById(R.id.tv_mt_routes);
                btnEdit = itemView.findViewById(R.id.btn_mt_edit);
                btnDelete = itemView.findViewById(R.id.btn_mt_delete);
            }
        }
    }
}
