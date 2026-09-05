package com.transitph.app.fragments;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.transitph.app.R;
import com.transitph.app.adapters.PhraseAdapter;
import com.transitph.app.models.CommuterPhrase;
import com.transitph.app.utils.SessionManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class AssistedNavigationFragment extends Fragment implements PhraseAdapter.OnPhraseSpeakListener {

    private Spinner spLanguage;
    private RecyclerView rvPhrases;
    private TextView tvActiveLanguageSubtitle;
    private TextView tvCategoryHeader;

    // Filter Chips
    private Button btnFilterAll;
    private Button btnFilterDirections;
    private Button btnFilterTransport;
    private Button btnFilterFare;
    private Button btnFilterGettingOff;

    private SessionManager sessionManager;
    private PhraseAdapter adapter;
    private List<CommuterPhrase> allPhrases = new ArrayList<>();
    private String selectedCategory = "ALL";
    private String selectedLanguage = "en"; // "en", "fil", "bikol"

    private TextToSpeech tts;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_assisted_navigation, container, false);

        sessionManager = new SessionManager(requireContext());
        selectedLanguage = sessionManager.getSelectedLanguage();

        initTTS();
        initPhrasesData();
        initViews(view);
        setupFilterListeners();

        return view;
    }

    private void initTTS() {
        tts = new TextToSpeech(requireContext(), status -> {
            if (status == TextToSpeech.SUCCESS) {
                tts.setLanguage(Locale.US);
            }
        });
    }

    @Override
    public void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }

    private void initViews(View view) {
        spLanguage = view.findViewById(R.id.sp_assisted_language);
        rvPhrases = view.findViewById(R.id.rv_assisted_phrases);
        tvActiveLanguageSubtitle = view.findViewById(R.id.tv_active_language_subtitle);
        tvCategoryHeader = view.findViewById(R.id.tv_category_header);

        btnFilterAll = view.findViewById(R.id.btn_filter_all);
        btnFilterDirections = view.findViewById(R.id.btn_filter_directions);
        btnFilterTransport = view.findViewById(R.id.btn_filter_transport);
        btnFilterFare = view.findViewById(R.id.btn_filter_fare);
        btnFilterGettingOff = view.findViewById(R.id.btn_filter_getting_off);

        // Language Spinner Setup
        String[] languages = {"English", "Filipino (Tagalog)", "Bikol (Regional)"};
        ArrayAdapter<String> langAdapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_spinner_dropdown_item, languages);
        spLanguage.setAdapter(langAdapter);

        if ("fil".equalsIgnoreCase(selectedLanguage)) spLanguage.setSelection(1);
        else if ("bikol".equalsIgnoreCase(selectedLanguage)) spLanguage.setSelection(2);
        else spLanguage.setSelection(0);

        spLanguage.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View v, int position, long id) {
                if (position == 0) selectedLanguage = "en";
                else if (position == 1) selectedLanguage = "fil";
                else if (position == 2) selectedLanguage = "bikol";

                sessionManager.setSelectedLanguage(selectedLanguage);
                updateSubtitle();
                filterAndDisplay();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        rvPhrases.setLayoutManager(new LinearLayoutManager(requireContext()));
        adapter = new PhraseAdapter(null, selectedLanguage, this);
        rvPhrases.setAdapter(adapter);

        updateSubtitle();
        filterAndDisplay();
    }

    private void setupFilterListeners() {
        btnFilterAll.setOnClickListener(v -> { selectedCategory = "ALL"; filterAndDisplay(); });
        btnFilterDirections.setOnClickListener(v -> { selectedCategory = "Directions"; filterAndDisplay(); });
        btnFilterTransport.setOnClickListener(v -> { selectedCategory = "Transportation"; filterAndDisplay(); });
        btnFilterFare.setOnClickListener(v -> { selectedCategory = "Fare"; filterAndDisplay(); });
        btnFilterGettingOff.setOnClickListener(v -> { selectedCategory = "Getting Off"; filterAndDisplay(); });
    }

    private void updateSubtitle() {
        if ("fil".equalsIgnoreCase(selectedLanguage)) {
            tvActiveLanguageSubtitle.setText("Naka-set sa Filipino: Ipinapakita ang mga gabay at pananalita para sa komyuter.");
        } else if ("bikol".equalsIgnoreCase(selectedLanguage)) {
            tvActiveLanguageSubtitle.setText("Naka-set sa Bikol: Mga tataramon asin giya sa pagbiyahe para sa mga pasahero.");
        } else {
            tvActiveLanguageSubtitle.setText("Set to English: Commuter guidance & local phrasebook for CALABARZON transit.");
        }
    }

    private void filterAndDisplay() {
        List<CommuterPhrase> filtered = new ArrayList<>();
        for (CommuterPhrase p : allPhrases) {
            if ("ALL".equalsIgnoreCase(selectedCategory) || p.getCategory().equalsIgnoreCase(selectedCategory)) {
                filtered.add(p);
            }
        }
        tvCategoryHeader.setText(selectedCategory.toUpperCase() + " PHRASES (" + filtered.size() + ")");
        adapter.updateData(filtered, selectedLanguage);
    }

    private void initPhrasesData() {
        allPhrases.clear();

        // Category: Directions
        allPhrases.add(new CommuterPhrase(1, "Directions",
                "Where is the jeepney terminal?",
                "Saan po ang terminal ng jeepney?",
                "Hain po an terminal nin jeep?",
                "Use when arriving at a town center, crossroads, or public market."));

        allPhrases.add(new CommuterPhrase(2, "Directions",
                "Where is the bus stop going to Manila?",
                "Saan po ang sakayan ng bus papuntang Maynila?",
                "Hain po an sakayan nin bus paduman sa Maynila?",
                "Ask dispatchers or station marshals along provincial highways."));

        allPhrases.add(new CommuterPhrase(3, "Directions",
                "Is this the queue for Balibago?",
                "Ito po ba ang pila papuntang Balibago?",
                "Iyo po ba ini an pila paduman sa Balibago?",
                "Ask fellow commuters in the terminal passenger line."));

        // Category: Transportation
        allPhrases.add(new CommuterPhrase(4, "Transportation",
                "Does this jeepney go to Santa Rosa?",
                "Papunta po ba itong jeepney sa Santa Rosa?",
                "Paduman po ba ining jeep sa Santa Rosa?",
                "Ask the driver or conductor before boarding the vehicle."));

        allPhrases.add(new CommuterPhrase(5, "Transportation",
                "Will you pass by Nuvali or Solenad?",
                "Dadaan po ba kayo sa Nuvali o Solenad?",
                "Maagi po ba kamo sa Nuvali o Solenad?",
                "Helpful for landmark or industrial park drop-offs."));

        allPhrases.add(new CommuterPhrase(6, "Transportation",
                "Is there still space inside?",
                "May bakante pa po ba sa loob?",
                "Igwa pa po nin lugar sa laog?",
                "Check before boarding an almost full jeepney."));

        // Category: Fare
        allPhrases.add(new CommuterPhrase(7, "Fare",
                "How much is the fare to Calamba Crossing?",
                "Magkano po ang pamasahe papuntang Calamba Crossing?",
                "Guroano po an plete paduman sa Calamba Crossing?",
                "Inquire regarding the exact fare matrix."));

        allPhrases.add(new CommuterPhrase(8, "Fare",
                "Here is my fare for one passenger.",
                "Makikisuyo po ng bayad, isa lang po.",
                "Paki-abot po kan plete, saro sana po.",
                "Hand your coins/bills to the passenger in front to pass to the driver."));

        allPhrases.add(new CommuterPhrase(9, "Fare",
                "May I have my change, please?",
                "Sukli po sa bente pesos papuntang Santa Rosa.",
                "An sukli po sa bente pesos paduman sa Santa Rosa.",
                "Politely remind the driver if change has not yet been given."));

        // Category: Getting Off
        allPhrases.add(new CommuterPhrase(10, "Getting Off",
                "Please let me know when we reach Santa Rosa Bayan.",
                "Pakisabi po kapag nasa Santa Rosa Bayan na tayo.",
                "Paki-aram po pag yaon na kita sa Santa Rosa Bayan.",
                "Notify the driver or nearby passengers if unfamiliar with landmarks."));

        allPhrases.add(new CommuterPhrase(11, "Getting Off",
                "Please pull over right here! (Standard PH commuter call)",
                "Para po sa tabi! / Dito na lang po sa kanto.",
                "Para po sa gilid! / Didi na sana po sa kanto.",
                "Call loudly and clearly when your destination or stop is in sight."));

        allPhrases.add(new CommuterPhrase(12, "Getting Off",
                "Excuse me, passing through.",
                "Makikiraan po / Makikidaan po.",
                "Makiki-agi po.",
                "Say when walking out between rows of seated commuters."));
    }

    @Override
    public void onSpeakPhrase(String text, String language) {
        if (tts != null) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "phrase_utterance");
        }
        Toast.makeText(requireContext(), "🔊 " + text, Toast.LENGTH_SHORT).show();
    }
}
