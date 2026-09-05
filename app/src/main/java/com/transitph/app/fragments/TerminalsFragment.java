package com.transitph.app.fragments;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.activities.TerminalDetailsActivity;
import com.transitph.app.adapters.TerminalAdapter;
import com.transitph.app.database.TerminalDao;
import com.transitph.app.models.Terminal;
import java.util.List;

public class TerminalsFragment extends Fragment implements TerminalAdapter.OnTerminalClickListener {

    private EditText etSearchTerminals;
    private TextView tvTerminalCount;
    private RecyclerView rvTerminals;
    private View layoutNoTerminals;

    private TerminalDao terminalDao;
    private TerminalAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_terminals, container, false);

        terminalDao = new TerminalDao(requireContext());

        initViews(view);
        loadTerminals(null);

        return view;
    }

    private void initViews(View view) {
        etSearchTerminals = view.findViewById(R.id.et_search_terminals);
        tvTerminalCount = view.findViewById(R.id.tv_terminals_header_count);
        rvTerminals = view.findViewById(R.id.rv_terminals_list);
        layoutNoTerminals = view.findViewById(R.id.layout_no_terminals);

        rvTerminals.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new TerminalAdapter(null, this);
        rvTerminals.setAdapter(adapter);

        etSearchTerminals.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                loadTerminals(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });
    }

    private void loadTerminals(String query) {
        List<Terminal> terminals = terminalDao.searchTerminals(query);
        tvTerminalCount.setText(terminals.size() + " active CALABARZON terminals");

        if (terminals.isEmpty()) {
            rvTerminals.setVisibility(View.GONE);
            layoutNoTerminals.setVisibility(View.VISIBLE);
        } else {
            rvTerminals.setVisibility(View.VISIBLE);
            layoutNoTerminals.setVisibility(View.GONE);
            adapter.setTerminals(terminals);
        }
    }

    @Override
    public void onTerminalClick(Terminal terminal) {
        Intent intent = new Intent(requireContext(), TerminalDetailsActivity.class);
        intent.putExtra(TerminalDetailsActivity.EXTRA_TERMINAL, terminal);
        startActivity(intent);
    }
}
