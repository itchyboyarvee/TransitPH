package com.transitph.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.transitph.app.R;
import com.transitph.app.activities.AdminDashboardActivity;
import com.transitph.app.activities.LoginActivity;
import com.transitph.app.utils.SessionManager;

public class ProfileFragment extends Fragment {

    private TextView tvName;
    private TextView tvEmail;
    private TextView tvRoleBadge;
    private Button btnAdminDashboard;
    private Button btnLogout;

    private SessionManager sessionManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_profile, container, false);

        sessionManager = new SessionManager(requireContext());

        initViews(view);
        bindUserData();

        return view;
    }

    private void initViews(View view) {
        tvName = view.findViewById(R.id.tv_profile_name);
        tvEmail = view.findViewById(R.id.tv_profile_email);
        tvRoleBadge = view.findViewById(R.id.tv_profile_role_badge);
        btnAdminDashboard = view.findViewById(R.id.btn_profile_admin_dashboard);
        btnLogout = view.findViewById(R.id.btn_profile_logout);

        btnLogout.setOnClickListener(v -> {
            sessionManager.logoutUser();
            Intent intent = new Intent(requireContext(), LoginActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            requireActivity().finish();
        });

        btnAdminDashboard.setOnClickListener(v -> {
            startActivity(new Intent(requireContext(), AdminDashboardActivity.class));
        });
    }

    private void bindUserData() {
        tvName.setText(sessionManager.getFullName());
        tvEmail.setText(sessionManager.getEmail());

        boolean isAdmin = sessionManager.isAdmin();
        tvRoleBadge.setText(isAdmin ? "ADMINISTRATOR" : "COMMUTER (USER)");

        if (isAdmin) {
            btnAdminDashboard.setVisibility(View.VISIBLE);
        } else {
            btnAdminDashboard.setVisibility(View.GONE);
        }
    }
}
