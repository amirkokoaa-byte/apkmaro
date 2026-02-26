import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Brain
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full p-4 flex flex-col items-center gap-2 transition-all duration-200 border-l-2",
      active 
        ? "border-cyan-400 bg-white/5 text-cyan-400" 
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

const AppIcon = ({ name, color }: { name: string, color: string }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105", color)}>
      <Gamepad2 size={32} />
    </div>
    <span className="text-xs text-gray-300 group-hover:text-white">{name}</span>
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

const DashboardView = () => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="CPU Usage" value="12%" icon={Cpu} color="text-emerald-400" />
        <StatCard label="Memory" value="4.2 GB" icon={Monitor} color="text-blue-400" />
        <StatCard label="Network" value="120 MB/s" icon={Wifi} color="text-purple-400" />
      </div>

      <div className="glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center border-dashed border-2 border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Smartphone size={64} className="text-gray-600 mb-4 group-hover:text-cyan-400 transition-colors" />
        <h3 className="text-xl font-medium mb-2">Drag & Drop .XAPK / .APK</h3>
        <p className="text-sm text-gray-500 max-w-md text-center">
          Automatically installs APK and extracts OBB files to <span className="font-mono text-xs bg-white/10 px-1 rounded">/sdcard/Android/obb</span>
        </p>
        <div className="mt-4 flex gap-2">
           <span className="px-2 py-1 bg-white/10 rounded text-xs text-cyan-300 border border-cyan-500/30">Auto-Split APK Merger</span>
           <span className="px-2 py-1 bg-white/10 rounded text-xs text-purple-300 border border-purple-500/30">OBB Auto-Link</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Download size={18} className="text-cyan-400" /> Installed Apps
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
          <AppIcon name="PUBG Mobile" color="bg-gradient-to-br from-yellow-600 to-yellow-800" />
          <AppIcon name="Genshin Impact" color="bg-gradient-to-br from-purple-600 to-indigo-800" />
          <AppIcon name="Call of Duty" color="bg-gradient-to-br from-gray-700 to-black" />
          <AppIcon name="Asphalt 9" color="bg-gradient-to-br from-red-600 to-red-800" />
          <AppIcon name="TikTok" color="bg-gradient-to-br from-pink-500 to-cyan-500" />
          <AppIcon name="WhatsApp" color="bg-gradient-to-br from-green-500 to-emerald-700" />
        </div>
      </div>
    </div>
  );
};

const SettingsView = () => {
  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-light mb-6">Engine Configuration</h2>
      
      <div className="space-y-6">
        {/* Advanced Graphics */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-orange-400 flex items-center gap-2">
            <Zap size={20} /> Graphics Pipeline (Vulkan)
          </h3>
          <div className="space-y-4">
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium">Hardware GPU Passthrough</div>
                <div className="text-xs text-gray-500">Direct VFIO access to Host GPU</div>
              </div>
              <div className="w-12 h-6 bg-cyan-500/20 rounded-full border border-cyan-500/50 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium">Refresh Rate</div>
                <div className="text-xs text-gray-500">Force FrameBuffer frequency</div>
              </div>
              <select className="bg-black/40 border border-white/10 rounded px-3 py-1 text-sm outline-none focus:border-cyan-400">
                <option>60 Hz</option>
                <option>90 Hz</option>
                <option>120 Hz</option>
                <option selected>144 Hz (OC)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI & Kernel */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-purple-400 flex items-center gap-2">
            <Brain size={20} /> Smart Optimization (AI)
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium">Local AI Resource Manager</div>
                <div className="text-xs text-gray-500">Dynamically allocate RAM/CPU based on game load</div>
              </div>
              <div className="w-12 h-6 bg-purple-500/20 rounded-full border border-purple-500/50 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>
            </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <div className="font-medium">Zero-Latency Input Bridge</div>
                <div className="text-xs text-gray-500">Rust-based evdev injection (&lt;1ms delay)</div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs text-emerald-400 font-mono">ACTIVE</span>
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Spoofing (Existing) */}
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4 text-cyan-400">Hardware Spoofing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Device Model</label>
              <input type="text" defaultValue="Samsung Galaxy S24 Ultra" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-cyan-400 outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-500">Manufacturer</label>
              <input type="text" defaultValue="Samsung" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-cyan-400 outline-none transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FileManagerView = () => {
  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light">File Manager</h2>
        <div className="flex gap-2">
          <div className="text-xs font-mono bg-white/10 px-3 py-1 rounded text-gray-400">/sdcard/Android/obb</div>
        </div>
      </div>

      <div className="glass-panel rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-black/20">
          <button className="text-gray-400 hover:text-white"><FolderOpen size={18} /></button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-sm text-gray-400">Internal Storage</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-white">Android</span>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-white">obb</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <FileItem name="com.tencent.ig" type="folder" size="-" />
          <FileItem name="com.miHoYo.GenshinImpact" type="folder" size="-" />
          <FileItem name="com.activision.callofduty.shooter" type="folder" size="-" />
          <FileItem name="main.1563.com.tencent.ig.obb" type="doc" size="1.8 GB" />
          <FileItem name="patch.1563.com.tencent.ig.obb" type="doc" size="450 MB" />
          <FileItem name="screenshot_20260226.png" type="image" size="2.4 MB" />
          <FileItem name="gameplay_record.mp4" type="video" size="145 MB" />
        </div>
      </div>
    </div>
  );
};

const MacroEditorView = () => {
  return (
    <div className="p-8 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light flex items-center gap-2"><Code /> Macro Engine (Lua/Python)</h2>
        <button className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-500/50 hover:bg-cyan-500/30 flex items-center gap-2">
          <Play size={16} /> Run Script
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Script List */}
        <div className="glass-panel rounded-xl p-4 flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Saved Macros</h3>
          <div className="p-3 bg-white/10 rounded-lg border border-cyan-500/50 cursor-pointer">
            <div className="font-medium text-white">Auto-Farm.lua</div>
            <div className="text-xs text-gray-400">Last edited: Just now</div>
          </div>
           <div className="p-3 bg-white/5 rounded-lg border border-transparent hover:bg-white/10 cursor-pointer">
            <div className="font-medium text-gray-300">Daily-Login.py</div>
            <div className="text-xs text-gray-500">Last edited: 2h ago</div>
          </div>
           <div className="p-3 bg-white/5 rounded-lg border border-transparent hover:bg-white/10 cursor-pointer">
            <div className="font-medium text-gray-300">Anti-Recoil.lua</div>
            <div className="text-xs text-gray-500">Last edited: 1d ago</div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="glass-panel rounded-xl col-span-2 flex flex-col overflow-hidden bg-[#0e0e14]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20">
             <span className="text-xs font-mono text-gray-400">Auto-Farm.lua</span>
             <div className="flex gap-2">
                <span className="text-xs text-gray-500">Lua 5.4</span>
             </div>
          </div>
          <div className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto leading-relaxed">
            <div className="flex gap-4">
              <div className="text-gray-600 select-none text-right">
                1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11<br/>12
              </div>
              <div>
                <span className="text-purple-400">function</span> <span className="text-yellow-400">main</span>()<br/>
                &nbsp;&nbsp;<span className="text-purple-400">while</span> <span className="text-blue-400">true</span> <span className="text-purple-400">do</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-gray-500">-- Image Recognition: Find "Retry" button</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">local</span> retry_pos = Screen.<span className="text-yellow-400">findImage</span>(<span className="text-green-400">"retry_button.png"</span>, <span className="text-orange-400">0.9</span>)<br/>
                <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> retry_pos <span className="text-purple-400">then</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Input.<span className="text-yellow-400">tap</span>(retry_pos.x, retry_pos.y)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;System.<span className="text-yellow-400">sleep</span>(<span className="text-orange-400">1000</span>)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">else</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> Screen.<span className="text-yellow-400">findImage</span>(<span className="text-green-400">"victory.png"</span>) <span className="text-purple-400">then</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">print</span>(<span className="text-green-400">"Stage Cleared!"</span>)<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">break</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">end</span><br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">end</span><br/>
                &nbsp;&nbsp;<span className="text-purple-400">end</span><br/>
                <span className="text-purple-400">end</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  return (
    <div className="flex h-screen w-full bg-[#050505] text-white font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <div className="w-20 flex flex-col items-center border-r border-white/10 bg-black/40 backdrop-blur-xl z-20">
        <div className="p-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Smartphone size={24} className="text-white" />
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-2">
          <SidebarItem icon={Monitor} label="Engine" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={FolderOpen} label="Files" active={activeTab === 'files'} onClick={() => setActiveTab('files')} />
          <SidebarItem icon={Code} label="Macros" active={activeTab === 'macros'} onClick={() => setActiveTab('macros')} />
          <SidebarItem icon={Settings} label="Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
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
            <span className="text-[9px] font-bold uppercase">{engineRunning ? 'STOP' : 'BOOT'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Window Controls (Decorative) */}
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-black/20 drag-region">
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
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'settings' && <SettingsView />}
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
