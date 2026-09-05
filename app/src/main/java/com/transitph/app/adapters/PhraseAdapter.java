package com.transitph.app.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.models.CommuterPhrase;
import java.util.ArrayList;
import java.util.List;

public class PhraseAdapter extends RecyclerView.Adapter<PhraseAdapter.PhraseViewHolder> {

    public interface OnPhraseSpeakListener {
        void onSpeakPhrase(String text, String language);
    }

    private List<CommuterPhrase> phrases = new ArrayList<>();
    private String currentLanguage = "en"; // "en", "fil", "bikol"
    private final OnPhraseSpeakListener speakListener;

    public PhraseAdapter(List<CommuterPhrase> phrases, String currentLanguage, OnPhraseSpeakListener speakListener) {
        this.phrases = phrases != null ? phrases : new ArrayList<>();
        this.currentLanguage = currentLanguage;
        this.speakListener = speakListener;
    }

    public void updateData(List<CommuterPhrase> newPhrases, String language) {
        this.phrases = newPhrases != null ? newPhrases : new ArrayList<>();
        this.currentLanguage = language;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public PhraseViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_phrase, parent, false);
        return new PhraseViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull PhraseViewHolder holder, int position) {
        CommuterPhrase phrase = phrases.get(position);
        holder.bind(phrase, currentLanguage, speakListener);
    }

    @Override
    public int getItemCount() {
        return phrases.size();
    }

    static class PhraseViewHolder extends RecyclerView.ViewHolder {
        private final TextView tvCategoryBadge;
        private final TextView tvPrimaryPhrase;
        private final TextView tvSecondaryPhrase;
        private final TextView tvPhraseContext;
        private final Button btnPlayAudio;

        public PhraseViewHolder(@NonNull View itemView) {
            super(itemView);
            tvCategoryBadge = itemView.findViewById(R.id.tv_phrase_category);
            tvPrimaryPhrase = itemView.findViewById(R.id.tv_phrase_primary);
            tvSecondaryPhrase = itemView.findViewById(R.id.tv_phrase_secondary);
            tvPhraseContext = itemView.findViewById(R.id.tv_phrase_context);
            btnPlayAudio = itemView.findViewById(R.id.btn_play_audio);
        }

        public void bind(CommuterPhrase phrase, String lang, OnPhraseSpeakListener listener) {
            tvCategoryBadge.setText(phrase.getCategory());
            tvPhraseContext.setText(phrase.getContext());

            String primary;
            String secondary;
            if ("fil".equalsIgnoreCase(lang) || "filipino".equalsIgnoreCase(lang)) {
                primary = phrase.getFilipino();
                secondary = "English: " + phrase.getEnglish();
            } else if ("bikol".equalsIgnoreCase(lang)) {
                primary = phrase.getBikol() != null ? phrase.getBikol() : phrase.getFilipino();
                secondary = "English: " + phrase.getEnglish() + " • Tagalog: " + phrase.getFilipino();
            } else {
                primary = phrase.getEnglish();
                secondary = "Filipino: \"" + phrase.getFilipino() + "\"";
            }

            tvPrimaryPhrase.setText(primary);
            tvSecondaryPhrase.setText(secondary);

            if (btnPlayAudio != null) {
                btnPlayAudio.setOnClickListener(v -> {
                    if (listener != null) listener.onSpeakPhrase(primary, lang);
                });
            }
        }
    }
}
