package com.transitph.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.models.Terminal;
import java.util.ArrayList;
import java.util.List;

public class TerminalAdapter extends RecyclerView.Adapter<TerminalAdapter.TerminalViewHolder> {

    public interface OnTerminalClickListener {
        void onTerminalClick(Terminal terminal);
    }

    private List<Terminal> terminals = new ArrayList<>();
    private final OnTerminalClickListener listener;

    public TerminalAdapter(List<Terminal> terminals, OnTerminalClickListener listener) {
        this.terminals = terminals != null ? terminals : new ArrayList<>();
        this.listener = listener;
    }

    public void setTerminals(List<Terminal> newTerminals) {
        this.terminals = newTerminals != null ? newTerminals : new ArrayList<>();
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public TerminalViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_terminal, parent, false);
        return new TerminalViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TerminalViewHolder holder, int position) {
        Terminal terminal = terminals.get(position);
        holder.bind(terminal, listener);
    }

    @Override
    public int getItemCount() {
        return terminals.size();
    }

    static class TerminalViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvTerminalName;
        private final TextView tvTerminalLocation;
        private final TextView tvRouteCount;
        private final Button btnViewTerminal;

        public TerminalViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTerminalName = itemView.findViewById(R.id.tv_terminal_name);
            tvTerminalLocation = itemView.findViewById(R.id.tv_terminal_location);
            tvRouteCount = itemView.findViewById(R.id.tv_route_count);
            btnViewTerminal = itemView.findViewById(R.id.btn_view_terminal);
        }

        public void bind(Terminal terminal, OnTerminalClickListener listener) {
            tvTerminalName.setText("📍 " + terminal.getTerminalName().toUpperCase());
            tvTerminalLocation.setText(terminal.getLocationText());
            tvRouteCount.setText(terminal.getRouteCount() + " Routes");

            itemView.setOnClickListener(v -> {
                if (listener != null) listener.onTerminalClick(terminal);
            });

            if (btnViewTerminal != null) {
                btnViewTerminal.setOnClickListener(v -> {
                    if (listener != null) listener.onTerminalClick(terminal);
                });
            }
        }
    }
}
