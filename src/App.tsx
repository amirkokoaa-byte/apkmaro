import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Terminal, 
  Settings, 
  Smartphone, 
  Play, 
  Square, 
  Download, 
  Cpu, 
  Wifi, 
  Battery, 
  FolderOpen,
  Monitor,
  Gamepad2,
  Search,
  Maximize2,
  Minimize2,
  X,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Zap,
  Layers,
  Code,
  Eye,
  Brain,
  Shield,
  Cloud,
  Copy,
  Globe,
  Lock,
  Puzzle,
  RefreshCw,
  MessageSquare,
  Wrench,
  Languages,
  Send,
  FileCode,
  Save,
  Server
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types & Constants ---

const GAMES = [
  { id: 'pubg', name: 'PUBG Mobile', color: 'from-yellow-600 to-yellow-800', accent: 'text-yellow-400', border: 'border-yellow-500/50' },
  { id: 'genshin', name: 'Genshin Impact', color: 'from-purple-600 to-indigo-800', accent: 'text-purple-400', border: 'border-purple-500/50' },
  { id: 'cod', name: 'Call of Duty', color: 'from-gray-700 to-black', accent: 'text-gray-400', border: 'border-gray-500/50' },
  { id: 'asphalt', name: 'Asphalt 9', color: 'from-red-600 to-red-800', accent: 'text-red-400', border: 'border-red-500/50' },
  { id: 'tiktok', name: 'TikTok', color: 'from-pink-500 to-cyan-500', accent: 'text-pink-400', border: 'border-pink-500/50' },
  { id: 'whatsapp', name: 'WhatsApp', color: 'from-green-500 to-emerald-700', accent: 'text-green-400', border: 'border-green-500/50' },
];

const TRANSLATIONS = {
  en: {
    engine: "Engine",
    multi: "Multi",
    security: "Security",
    plugins: "Plugins",
    files: "Files",
    macros: "Macros",
    ai_mod: "AI Modder",
    store: "Store",
    editor: "Editor",
    config: "Config",
    boot: "BOOT",
    stop: "STOP",
    ready: "Ready to Play",
    drag_drop: "Drag & Drop .XAPK / .APK",
    install_info: "Automatically installs APK and extracts OBB files to",
    installed_apps: "Installed Apps",
    cpu_usage: "CPU Usage",
    gpu_usage: "GPU Usage",
    ram: "RAM",
    temp: "Temp",
    ai_assistant_title: "AI Modding Assistant",
    ai_placeholder: "Ask me to modify gems, coins, or remove ads...",
    script_store: "Script & Patch Store",
    frida_hooks: "Frida Hooks",
    one_click_patches: "One-Click Patches",
    enable: "Enable",
    disable: "Disable",
    apply: "Apply",
    applied: "Applied",
    language: "Language",
    smali_editor: "Visual Smali Editor",
    apply_patch: "Apply Patch",
    mock_server: "Offline Server Emulation",
    mock_status: "Mock Server Status"
  },
  ar: {
    engine: "المحرك",
    multi: "تعدد",
    security: "الحماية",
    plugins: "إضافات",
    files: "ملفات",
    macros: "ماكرو",
    ai_mod: "المعدل الذكي",
    store: "المتجر",
    editor: "المحرر",
    config: "إعدادات",
    boot: "تشغيل",
    stop: "إيقاف",
    ready: "جاهز للعب",
    drag_drop: "اسحب وأفلت ملفات .XAPK / .APK",
    install_info: "تثبيت تلقائي للـ APK واستخراج ملفات OBB إلى",
    installed_apps: "التطبيقات المثبتة",
    cpu_usage: "المعالج",
    gpu_usage: "كرت الشاشة",
    ram: "الذاكرة",
    temp: "الحرارة",
    ai_assistant_title: "مساعد التعديل الذكي",
    ai_placeholder: "اطلب مني تعديل الجواهر، النقود، أو إزالة الإعلانات...",
    script_store: "متجر السكربتات والباتشات",
    frida_hooks: "حقن فريدا (Frida Hooks)",
    one_click_patches: "باتشات بضغطة زر",
    enable: "تفعيل",
    disable: "تعطيل",
    apply: "تطبيق",
    applied: "تم التطبيق",
    language: "اللغة",
    smali_editor: "محرر Smali البصري",
    apply_patch: "تطبيق الباتش",
    mock_server: "محاكاة السيرفر المحلي",
    mock_status: "حالة السيرفر الوهمي"
  }
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, accentColor, isRTL }: { icon: any, label: string, active: boolean, onClick: () => void, accentColor: string, isRTL: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full p-4 flex flex-col items-center gap-2 transition-all duration-200",
      isRTL ? "border-r-2" : "border-l-2",
      active 
        ? cn("bg-white/5", isRTL ? accentColor.replace('text-', 'border-r-') : accentColor.replace('text-', 'border-l-'), accentColor) 
        : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon size={24} />
    <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) => (
  <div className="glass-panel rounded-xl p-4 flex items-center gap-4">
    <div className={cn("p-3 rounded-lg bg-white/5", color)}>
      <Icon size={20} />
    </div>
    <div>
      <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-xl font-mono font-bold">{value}</div>
    </div>
  </div>
);

const AppIcon = ({ game, onClick }: { game: typeof GAMES[0], onClick: () => void }) => (
  <div onClick={onClick} className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-br", game.color)}>
      <Gamepad2 size={32} />
    </div>
    <span className="text-xs text-gray-300 group-hover:text-white">{game.name}</span>
  </div>
);

const FileItem = ({ name, type, size }: { name: string, type: 'folder' | 'image' | 'video' | 'doc', size: string }) => {
  const Icon = type === 'folder' ? FolderOpen : type === 'image' ? ImageIcon : type === 'video' ? Video : FileText;
  const color = type === 'folder' ? 'text-yellow-400' : type === 'image' ? 'text-purple-400' : type === 'video' ? 'text-red-400' : 'text-blue-400';
  
  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors">
      <div className="flex items-center gap-3">
        <Icon size={20} className={color} />
        <span className="text-sm text-gray-300 group-hover:text-white">{name}</span>
      </div>
      <span className="text-xs text-gray-600 font-mono">{size}</span>
    </div>
  );
};

// --- Main Views ---

const DashboardView = ({ activeGame, onGameSelect, t }: { activeGame: typeof GAMES[0] | null, onGameSelect: (game: typeof GAMES[0]) => void, t: any }) => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      {/* Real-time Stats Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label={t.cpu_usage} value="12%" icon={Cpu} color={activeGame?.accent || "text-emerald-400"} />
        <StatCard label={t.gpu_usage} value="34%" icon={Zap} color={activeGame?.accent || "text-orange-400"} />
        <StatCard label={t.ram} value="4.2 GB" icon={Monitor} color="text-blue-400" />
        <StatCard label={t.temp} value="42°C" icon={Wifi} color="text-red-400" />
      </div>

      <div className={cn("glass-panel rounded-2xl p-6 min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 relative overflow-hidden group transition-colors duration-500", activeGame ? activeGame.border : "border-white/10")}>
        <div className={cn("absolute inset-0 bg-gradient-to-b from-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", activeGame ? `to-${activeGame.accent.split('-')[1]}-500/5` : "to-cyan-500/5")} />
        
        {activeGame ? (
          <div className="flex flex-col items-center gap-4 z-10">
             <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center text-white shadow-2xl bg-gradient-to-br", activeGame.color)}>
                <Gamepad2 size={48} />
             </div>
             <h2 className="text-2xl font-bold">{activeGame.name} Running</h2>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">144 FPS</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs border border-white/20">Vulkan</span>
             </div>
          </div>
        ) : (
          <>
            <Smartphone size={64} className="text-gray-600 mb-4 group-hover:text-cyan-400 transition-colors" />
            <h3 className="text-xl font-medium mb-2">{t.ready}</h3>
            <p className="text-sm text-gray-500 max-w-md text-center">
              {t.drag_drop}
            </p>
            <p className="text-xs text-gray-600 mt-2">{t.install_info} <span className="font-mono bg-white/10 px-1 rounded">/sdcard/Android/obb</span></p>
          </>
        )}
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Download size={18} className={activeGame?.accent || "text-cyan-400"} /> {t.installed_apps}
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
          {GAMES.map(game => (
            <AppIcon key={game.id} game={game} onClick={() => onGameSelect(game)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AIModdingView = ({ t, isRTL }: { t: any, isRTL: boolean }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: isRTL ? "مرحباً! أنا مساعد التعديل الذكي. يمكنني مساعدتك في تحليل ملفات اللعبة وتعديل القيم مثل الجواهر والنقود. فقط ارفع ملف APK أو اسألني." : "Hello! I am your AI Modding Assistant. I can help you analyze game files and modify values like gems and coins. Just upload an APK or ask me." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `You are an expert Android Reverse Engineer and Modder. You speak ${isRTL ? 'Arabic' : 'English'}. 
      The user is asking for help modding an Android game. 
      If they ask about gems/coins, explain which Smali files usually contain 'getCurrency' methods and suggest a hex edit.
      Keep it technical but easy to understand.
      User: ${userMsg}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: isRTL ? "عذراً، حدث خطأ في الاتصال بالخادم." : "Sorry, connection error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-2xl font-light mb-6 flex items-center gap-2"><Brain className="text-purple-400" /> {t.ai_assistant_title}</h2>
      
      <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[80%] p-3 rounded-xl text-sm", msg.role === 'user' ? "bg-cyan-500/20 text-cyan-100" : "bg-white/5 text-gray-200")}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-white/5 p-3 rounded-xl text-sm flex gap-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
               </div>
             </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.ai_placeholder}
            className={cn("flex-1 bg-transparent outline-none text-white placeholder-gray-500", isRTL ? "text-right" : "text-left")}
          />
          <button onClick={handleSend} className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/30">
            <Send size={18} className={isRTL ? "rotate-180" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ScriptStoreView = ({ t }: { t: any }) => {
  return (
    <div className="p-8 h-full flex flex-col overflow-y-auto">
      <h2 className="text-2xl font-light mb-6 flex items-center gap-2"><Wrench className="text-orange-400" /> {t.script_store}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Frida Hooks */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300">{t.frida_hooks}</h3>
          <div className="glass-panel rounded-xl p-4 space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-500/20 rounded text-orange-400"><Code size={18} /></div>
                   <div>
                      <div className="font-medium">SSL Pinning Bypass</div>
                      <div className="text-xs text-gray-500">Universal (Frida)</div>
                   </div>
                </div>
                <div className="w-10 h-5 bg-emerald-500/20 rounded-full border border-emerald-500/50 relative cursor-pointer">
                   <div className="absolute right-1 top-0.5 w-4 h-4 bg-emerald-400 rounded-full" />
                </div>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-500/20 rounded text-orange-400"><Code size={18} /></div>
                   <div>
                      <div className="font-medium">Unity IL2CPP Dumper</div>
                      <div className="text-xs text-gray-500">Game Engine Tool</div>
                   </div>
                </div>
                <div className="w-10 h-5 bg-white/10 rounded-full border border-white/20 relative cursor-pointer">
                   <div className="absolute left-1 top-0.5 w-4 h-4 bg-gray-400 rounded-full" />
                </div>
             </div>
          </div>
        </div>

        {/* One-Click Patches */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-300">{t.one_click_patches}</h3>
          <div className="glass-panel rounded-xl p-4 space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div>
                   <div className="font-medium text-white">PUBG: 90 FPS Unlock</div>
                   <div className="text-xs text-gray-500">Modifies Config.ini</div>
                </div>
                <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30">{t.apply}</button>
             </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div>
                   <div className="font-medium text-white">Genshin: Remove Fog</div>
                   <div className="text-xs text-gray-500">Shader modification</div>
                </div>
                <button className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs rounded cursor-default">{t.applied}</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VisualEditorView = ({ t }: { t: any }) => {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light flex items-center gap-2"><FileCode className="text-blue-400" /> {t.smali_editor}</h2>
        <div className="flex gap-2">
          <button className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/50 hover:bg-emerald-500/30 flex items-center gap-2">
            <Save size={16} /> {t.apply_patch}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* File Tree */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-2 overflow-y-auto">
           <div className="flex items-center gap-2 text-sm text-yellow-400 p-2 bg-white/5 rounded"><FolderOpen size={14} /> smali/com/game/rpg</div>
           <div className="pl-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-300 p-2 hover:bg-white/10 rounded cursor-pointer"><FileText size={12} /> Player.smali</div>
              <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 p-2 rounded cursor-pointer border border-cyan-500/30"><FileText size={12} /> Currency.smali</div>
              <div className="flex items-center gap-2 text-xs text-gray-300 p-2 hover:bg-white/10 rounded cursor-pointer"><FileText size={12} /> Shop.smali</div>
           </div>
        </div>

        {/* Editor */}
        <div className="glass-panel rounded-xl col-span-2 flex flex-col overflow-hidden bg-[#0e0e14]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20">
             <span className="text-xs font-mono text-gray-400">Currency.smali</span>
             <span className="text-xs text-gray-500">Smali Bytecode</span>
          </div>
          <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto leading-relaxed">
            <div className="flex gap-4">
              <div className="text-gray-600 select-none text-right">
                42<br/>43<br/>44<br/>45<br/>46<br/>47
              </div>
              <div>
                <span className="text-gray-500">.method public get_Gold()I</span><br/>
                &nbsp;&nbsp;<span className="text-purple-400">.locals</span> 1<br/>
                &nbsp;&nbsp;<span className="text-gray-500"># Heuristic Match: Currency Getter</span><br/>
                &nbsp;&nbsp;<span className="text-blue-400">const/16</span> v0, <span className="text-orange-400">0x2710</span> <span className="text-green-400"># 10000 (Patched)</span><br/>
                &nbsp;&nbsp;<span className="text-purple-400">return</span> v0<br/>
                <span className="text-gray-500">.end method</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mock Server Panel */}
      <div className="mt-6 glass-panel rounded-xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="p-2 bg-pink-500/20 rounded text-pink-400"><Server size={20} /></div>
            <div>
               <div className="font-medium text-white">{t.mock_server}</div>
               <div className="text-xs text-gray-500">Intercepts /verify_purchase API calls</div>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-right">
               <div className="text-xs font-bold text-emerald-400">RUNNING</div>
               <div className="text-[10px] text-gray-500">127.0.0.1:8080</div>
            </div>
            <div className="w-10 h-5 bg-emerald-500/20 rounded-full border border-emerald-500/50 relative cursor-pointer">
               <div className="absolute right-1 top-0.5 w-4 h-4 bg-emerald-400 rounded-full" />
            </div>
         </div>
      </div>
    </div>
  );
};

const MultiInstanceView = () => (
    <div className="p-8 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light flex items-center gap-2"><Copy /> Multi-Instance Manager</h2>
        <button className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/30 flex items-center gap-2">
          <Play size={16} /> New Instance
        </button>
      </div>
      <div className="glass-panel rounded-xl p-6 flex items-center justify-center text-gray-500">
         Multi-Instance Manager Loaded
      </div>
    </div>
);

const SecurityCloudView = () => (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-light mb-6">Security & Cloud</h2>
      <div className="glass-panel rounded-xl p-6 flex items-center justify-center text-gray-500">
         Security Module Loaded
      </div>
    </div>
);

const PluginsView = () => (
    <div className="p-8 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light flex items-center gap-2"><Puzzle /> Plugin Store</h2>
      </div>
      <div className="glass-panel rounded-xl flex-1 p-4 flex items-center justify-center text-gray-500">
         Plugin Store Loaded
      </div>
    </div>
);

const MacroEditorView = () => (
    <div className="p-8 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light flex items-center gap-2"><Code /> Macro Engine (Lua/Python)</h2>
      </div>
      <div className="glass-panel rounded-xl flex-1 p-4 flex items-center justify-center text-gray-500">
         Macro Editor Loaded
      </div>
    </div>
);

const FileManagerView = () => (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-2xl font-light mb-6">File Manager</h2>
      <div className="glass-panel rounded-xl flex-1 p-4 flex items-center justify-center text-gray-500">
         File Manager Loaded
      </div>
    </div>
);

const SettingsView = ({ lang, setLang, t }: { lang: 'en' | 'ar', setLang: (l: 'en' | 'ar') => void, t: any }) => (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-light mb-6">{t.config}</h2>
      <div className="space-y-6">
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-white flex items-center gap-2">
            <Languages size={20} /> {t.language}
          </h3>
          <div className="flex gap-4">
             <button 
               onClick={() => setLang('en')}
               className={cn("px-4 py-2 rounded-lg border transition-colors", lang === 'en' ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-white/5 border-white/10 text-gray-400")}
             >
               English
             </button>
             <button 
               onClick={() => setLang('ar')}
               className={cn("px-4 py-2 rounded-lg border transition-colors font-sans", lang === 'ar' ? "bg-cyan-500/20 border-cyan-500 text-cyan-400" : "bg-white/5 border-white/10 text-gray-400")}
             >
               العربية
             </button>
          </div>
        </div>
      </div>
    </div>
);

const TerminalPanel = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const [lines, setLines] = useState<string[]>(['NexusDroid Shell v1.0.2', 'Connected to local daemon...', 'Ready.']);
  
  return (
    <motion.div 
      initial={{ height: 40 }}
      animate={{ height: isOpen ? 300 : 40 }}
      className="border-t border-white/10 bg-[#0a0a10] flex flex-col"
    >
      <div 
        onClick={toggle}
        className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 select-none"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <Terminal size={14} />
          <span>TERMINAL (ADB SHELL)</span>
        </div>
        {isOpen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </div>
      
      {isOpen && (
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-gray-300">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-green-500">➜</span>
              <span>{line}</span>
            </div>
          ))}
          <div className="flex gap-2 items-center">
            <span className="text-green-500">➜</span>
            <input 
              type="text" 
              className="bg-transparent outline-none text-white w-full"
              placeholder="Type adb command..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setLines([...lines, e.currentTarget.value, 'Command executed successfully.']);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [engineRunning, setEngineRunning] = useState(false);
  const [activeGame, setActiveGame] = useState<typeof GAMES[0] | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';
  const accentColor = activeGame?.accent || "text-cyan-400";

  return (
    <div className={cn("flex h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30", isRTL ? "flex-row-reverse" : "flex-row")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <div className={cn("w-20 flex flex-col items-center bg-black/40 backdrop-blur-xl z-20", isRTL ? "border-l border-white/10" : "border-r border-white/10")}>
        <div className="p-4 mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500", activeGame ? `bg-gradient-to-br ${activeGame.color}` : "bg-gradient-to-br from-cyan-500 to-blue-600")}>
            <Smartphone size={24} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          <SidebarItem icon={Monitor} label={t.engine} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={FileCode} label={t.editor} active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Brain} label={t.ai_mod} active={activeTab === 'ai_mod'} onClick={() => setActiveTab('ai_mod')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Wrench} label={t.store} active={activeTab === 'store'} onClick={() => setActiveTab('store')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Copy} label={t.multi} active={activeTab === 'multi'} onClick={() => setActiveTab('multi')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Shield} label={t.security} active={activeTab === 'security'} onClick={() => setActiveTab('security')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Puzzle} label={t.plugins} active={activeTab === 'plugins'} onClick={() => setActiveTab('plugins')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={FolderOpen} label={t.files} active={activeTab === 'files'} onClick={() => setActiveTab('files')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Code} label={t.macros} active={activeTab === 'macros'} onClick={() => setActiveTab('macros')} accentColor={accentColor} isRTL={isRTL} />
          <SidebarItem icon={Settings} label={t.config} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} accentColor={accentColor} isRTL={isRTL} />
        </div>

        <div className="p-4 w-full">
          <button 
            onClick={() => setEngineRunning(!engineRunning)}
            className={cn(
              "w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
              engineRunning 
                ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" 
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
            )}
          >
            {engineRunning ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            <span className="text-[9px] font-bold uppercase">{engineRunning ? t.stop : t.boot}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Window Controls */}
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-black/20 drag-region" dir="ltr">
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 font-mono">NexusDroid v2026.1.0-alpha [KVM Enabled]</div>
            <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] text-gray-400">Input Latency: 0.8ms (Rust Bridge)</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          {/* Background Elements */}
          <div className={cn("absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000", activeGame ? `bg-${activeGame.accent.split('-')[1]}-500/5` : "bg-cyan-500/5")} />
          <div className={cn("absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000", activeGame ? `bg-${activeGame.accent.split('-')[1]}-500/5` : "bg-purple-500/5")} />

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardView activeGame={activeGame} onGameSelect={setActiveGame} t={t} />}
              {activeTab === 'editor' && <VisualEditorView t={t} />}
              {activeTab === 'multi' && <MultiInstanceView />}
              {activeTab === 'ai_mod' && <AIModdingView t={t} isRTL={isRTL} />}
              {activeTab === 'store' && <ScriptStoreView t={t} />}
              {activeTab === 'security' && <SecurityCloudView />}
              {activeTab === 'plugins' && <PluginsView />}
              {activeTab === 'settings' && <SettingsView lang={lang} setLang={setLang} t={t} />}
              {activeTab === 'files' && <FileManagerView />}
              {activeTab === 'macros' && <MacroEditorView />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Terminal Panel */}
        <TerminalPanel isOpen={terminalOpen} toggle={() => setTerminalOpen(!terminalOpen)} />
      </div>
    </div>
  );
}
