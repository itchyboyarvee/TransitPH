import React from 'react';
import {
  X,
  Smartphone,
  Code2,
  FolderTree,
  CheckCircle2,
  Terminal as TerminalIcon,
  Download,
  Layers,
} from 'lucide-react';

interface AndroidProjectGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectGuideModal: React.FC<AndroidProjectGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">TransitPH Native Android Project</h3>
              <p className="text-xs text-emerald-200">Java • XML Layouts • Gradle • SQLite/Room</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700 flex-1">
          {/* Notice Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Why you saw a white screen earlier:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              AI Studio preview runs a web server on port 3000 serving <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">src/App.tsx</code>. Previously, <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">App.tsx</code> contained an empty placeholder, while all your native Android Java/XML files were created in the <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">/app</code> folder. We have now activated this web simulation so you can preview all screens and workflows live right here, alongside your native Android source code!
            </p>
          </div>

          {/* Directory Structure */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-emerald-600" />
              <span>Native Android Project Structure in This Repository</span>
            </h4>
            <div className="bg-slate-900 text-slate-100 font-mono text-[11px] p-3 rounded-xl overflow-x-auto space-y-0.5">
              <div className="text-emerald-400 font-bold">/app</div>
              <div className="pl-3 text-slate-400">├── build.gradle (Android Gradle configuration)</div>
              <div className="pl-3 text-slate-400">└── src/main/</div>
              <div className="pl-6 text-amber-300">├── AndroidManifest.xml</div>
              <div className="pl-6 text-sky-300">├── java/com/transitph/app/</div>
              <div className="pl-9 text-slate-300">├── MainActivity.java</div>
              <div className="pl-9 text-slate-300">├── LoginActivity.java & RegisterActivity.java</div>
              <div className="pl-9 text-slate-300">├── AdminDashboardActivity.java</div>
              <div className="pl-9 text-slate-300">├── database/ (DatabaseHelper.java - SQLite)</div>
              <div className="pl-9 text-slate-300">├── fragments/ (Home, RouteFinder, Terminals, Assistant...)</div>
              <div className="pl-9 text-slate-300">├── adapters/ (RouteAdapter, TerminalAdapter, PhraseAdapter...)</div>
              <div className="pl-9 text-slate-300">└── models/ (Route, Terminal, User, CommuterPhrase...)</div>
              <div className="pl-6 text-purple-300">└── res/</div>
              <div className="pl-9 text-slate-300">├── layout/ (14+ XML screen & dialog layouts)</div>
              <div className="pl-9 text-slate-300">└── values/ (colors.xml, strings.xml, styles.xml)</div>
            </div>
          </div>

          {/* How to run in Android Studio */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <TerminalIcon className="w-4 h-4 text-blue-600" />
              <span>How to Open & Run in Android Studio</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <li>Export or download this project via AI Studio Settings &gt; Export.</li>
              <li>Launch <strong>Android Studio</strong> (Ladybug, Koala, or Hedgehog).</li>
              <li>Select <strong>Open an Existing Project</strong> and select this root folder.</li>
              <li>Allow Gradle to sync dependencies (<code className="font-mono text-[10px] bg-slate-200 px-1 rounded">com.google.android.material</code>, <code className="font-mono text-[10px] bg-slate-200 px-1 rounded">androidx.recyclerview</code>).</li>
              <li>Select an Android Virtual Device (AVD Emulator running API 26+) or physical Android phone with USB Debugging enabled.</li>
              <li>Click <strong>Run 'app' (Shift + F10)</strong> to build the APK and launch TransitPH!</li>
            </ol>
          </div>

          {/* Verification Steps Summary */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>13-Step Midterm Examination Verification Checklist</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. User & Admin Authentication</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>2. SQLite / Room Database Seeding</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3. Home Navigation & Quick Search</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>4. Multi-Modal Route Finder (Jeepney/Bus)</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>5. Real Fare & Time Matrices</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>6. Bilingual Commuter Guidance</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>7. Audio TTS Pronunciation</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>8. Offline Route Bookmarks</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>9. 16 CALABARZON Terminals</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>10. Admin Terminal CRUD</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>11. Admin Route CRUD</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>12. Session State Persistence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
