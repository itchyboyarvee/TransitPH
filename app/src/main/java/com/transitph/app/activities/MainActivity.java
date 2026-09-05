package com.transitph.app.activities;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.transitph.app.R;
import com.transitph.app.fragments.AssistedNavigationFragment;
import com.transitph.app.fragments.HomeFragment;
import com.transitph.app.fragments.ProfileFragment;
import com.transitph.app.fragments.RouteFinderFragment;
import com.transitph.app.fragments.SavedRoutesFragment;
import com.transitph.app.fragments.TerminalsFragment;

public class MainActivity extends AppCompatActivity {

    private BottomNavigationView bottomNav;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNav = findViewById(R.id.bottom_navigation);
        setupBottomNav();

        if (savedInstanceState == null) {
            loadFragment(new HomeFragment(), "HomeFragment");
        }
    }

    private void setupBottomNav() {
        bottomNav.setOnItemSelectedListener(item -> {
            int itemId = item.getItemId();
            Fragment selectedFragment = null;
            String tag = "";

            if (itemId == R.id.nav_home) {
                selectedFragment = new HomeFragment();
                tag = "HomeFragment";
            } else if (itemId == R.id.nav_routes) {
                selectedFragment = new RouteFinderFragment();
                tag = "RouteFinderFragment";
            } else if (itemId == R.id.nav_terminals) {
                selectedFragment = new TerminalsFragment();
                tag = "TerminalsFragment";
            } else if (itemId == R.id.nav_saved) {
                selectedFragment = new SavedRoutesFragment();
                tag = "SavedRoutesFragment";
            } else if (itemId == R.id.nav_profile) {
                selectedFragment = new ProfileFragment();
                tag = "ProfileFragment";
            }

            if (selectedFragment != null) {
                loadFragment(selectedFragment, tag);
                return true;
            }
            return false;
        });
    }

    public void loadFragment(Fragment fragment, String tag) {
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        ft.replace(R.id.fragment_container, fragment, tag);
        ft.commit();
    }

    public void switchToTab(int navItemId) {
        if (bottomNav != null) {
            bottomNav.setSelectedItemId(navItemId);
        }
    }

    public void openAssistedNavigation() {
        loadFragment(new AssistedNavigationFragment(), "AssistedNavigationFragment");
    }
}
