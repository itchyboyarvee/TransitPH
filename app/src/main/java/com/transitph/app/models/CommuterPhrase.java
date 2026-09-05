package com.transitph.app.models;

import java.io.Serializable;

public class CommuterPhrase implements Serializable {
    private long id;
    private String category; // "Directions", "Transportation", "Fare", "Getting Off", "Common Phrases"
    private String english;
    private String filipino;
    private String bikol;
    private String context;

    public CommuterPhrase() {}

    public CommuterPhrase(long id, String category, String english, String filipino, String bikol, String context) {
        this.id = id;
        this.category = category;
        this.english = english;
        this.filipino = filipino;
        this.bikol = bikol;
        this.context = context;
    }

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEnglish() { return english; }
    public void setEnglish(String english) { this.english = english; }

    public String getFilipino() { return filipino; }
    public void setFilipino(String filipino) { this.filipino = filipino; }

    public String getBikol() { return bikol; }
    public void setBikol(String bikol) { this.bikol = bikol; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public String getTranslationByLang(String languageCode) {
        if ("fil".equalsIgnoreCase(languageCode) || "filipino".equalsIgnoreCase(languageCode) || "tagalog".equalsIgnoreCase(languageCode)) {
            return filipino;
        } else if ("bikol".equalsIgnoreCase(languageCode) || "bcl".equalsIgnoreCase(languageCode)) {
            return bikol != null ? bikol : filipino;
        }
        return english;
    }
}
