
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, Image as ImageIcon, Layout, Download, Palette, Move, 
  RotateCcw, Check, ChevronLeft, Save, Share2, Grid, MousePointer2, ChevronDown
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea } from '../profile/ProfileFormElements';

// Extend window for html2canvas
declare global {
  interface Window {
    html2canvas: any;
  }
}

interface InvitationMakerProps {
  onBack: () => void;
}

// --- TEMPLATE GENERATION LOGIC ---
// Define categories and base styles
const CATEGORIES = ['Royal', 'Traditional', 'Modern', 'Floral', 'Vintage'];

// Generate 50+ Templates procedurally to ensure variety
const generateTemplates = () => {
  const templates = [];
  let idCounter = 1;

  // 1. ROYAL (Deep colors, gold borders) - 10 Variations
  const royalColors = ['bg-[#1a0b2e]', 'bg-[#2a0a18]', 'bg-[#0f172a]', 'bg-[#1e1b4b]', 'bg-[#310000]'];
  royalColors.forEach((bg, i) => {
    templates.push({
      id: `royal-${idCounter++}`, name: `Royal ${i+1}`, category: 'Royal',
      bgClass: bg, borderClass: 'border-4 border-double border-yellow-500',
      fontFamily: 'font-display', textColor: 'text-yellow-100', accentColor: 'text-yellow-500',
      decoration: 'radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%)'
    });
    templates.push({
      id: `royal-${idCounter++}`, name: `Majestic ${i+1}`, category: 'Royal',
      bgClass: bg, borderClass: 'border-[8px] border-yellow-600/50',
      fontFamily: 'font-serif', textColor: 'text-yellow-50', accentColor: 'text-yellow-400',
      decoration: 'linear-gradient(45deg, rgba(255,215,0,0.1) 25%, transparent 25%, transparent 50%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0.1) 75%, transparent 75%, transparent)'
    });
  });

  // 2. TRADITIONAL (Reds, Oranges, Yellows) - 12 Variations
  const tradColors = ['bg-red-900', 'bg-orange-800', 'bg-yellow-900', 'bg-red-800', 'bg-orange-900', 'bg-[#4a0404]'];
  tradColors.forEach((bg, i) => {
     templates.push({
       id: `trad-${idCounter++}`, name: `Classic ${i+1}`, category: 'Traditional',
       bgClass: bg, borderClass: 'border-8 border-yellow-500',
       fontFamily: 'font-serif', textColor: 'text-yellow-50', accentColor: 'text-yellow-300',
       decoration: 'repeating-linear-gradient(45deg, rgba(234, 179, 8, 0.05) 0px, rgba(234, 179, 8, 0.05) 2px, transparent 2px, transparent 10px)'
     });
     templates.push({
        id: `trad-${idCounter++}`, name: `Heritage ${i+1}`, category: 'Traditional',
        bgClass: bg, borderClass: 'border-[12px] border-double border-orange-400',
        fontFamily: 'font-display', textColor: 'text-orange-100', accentColor: 'text-orange-400',
        decoration: 'radial-gradient(circle at center, rgba(255,165,0,0.2) 0%, transparent 60%)'
     });
  });

  // 3. MODERN (Clean, Minimal, Whites, Greys, Pastels) - 10 Variations
  const modernColors = ['bg-white', 'bg-gray-50', 'bg-slate-50', 'bg-zinc-100', 'bg-stone-50'];
  modernColors.forEach((bg, i) => {
     templates.push({
        id: `mod-${idCounter++}`, name: `Minimal ${i+1}`, category: 'Modern',
        bgClass: bg, borderClass: 'border border-gray-300',
        fontFamily: 'font-sans', textColor: 'text-gray-900', accentColor: 'text-gray-500',
        decoration: ''
     });
     templates.push({
        id: `mod-${idCounter++}`, name: `Chic ${i+1}`, category: 'Modern',
        bgClass: bg, borderClass: 'border-t-8 border-b-8 border-gray-900',
        fontFamily: 'font-sans', textColor: 'text-gray-800', accentColor: 'text-gray-600',
        decoration: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)'
     });
  });

  // 4. FLORAL (Pinks, Greens, Soft gradients) - 10 Variations
  const floralColors = ['bg-pink-50', 'bg-rose-50', 'bg-green-50', 'bg-emerald-50', 'bg-purple-50'];
  floralColors.forEach((bg, i) => {
     templates.push({
        id: `flor-${idCounter++}`, name: `Blossom ${i+1}`, category: 'Floral',
        bgClass: bg, borderClass: 'border-[16px] border-white shadow-inner',
        fontFamily: 'font-serif', textColor: 'text-gray-800', accentColor: 'text-pink-600',
        decoration: 'radial-gradient(circle at top right, rgba(236, 72, 153, 0.1), transparent 40%), radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.1), transparent 40%)'
     });
     templates.push({
        id: `flor-${idCounter++}`, name: `Garden ${i+1}`, category: 'Floral',
        bgClass: bg, borderClass: 'border-4 border-double border-pink-200',
        fontFamily: 'font-display', textColor: 'text-gray-700', accentColor: 'text-rose-500',
        decoration: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, transparent 100%)'
     });
  });

  // 5. VINTAGE (Paper textures, Browns, Creams) - 10 Variations
  const vintageColors = ['bg-[#f5f5dc]', 'bg-[#faebd7]', 'bg-[#fffdd0]', 'bg-[#eecfa1]', 'bg-[#d2b48c]'];
  vintageColors.forEach((bg, i) => {
     templates.push({
        id: `vint-${idCounter++}`, name: `Retro ${i+1}`, category: 'Vintage',
        bgClass: bg, borderClass: 'border-2 border-dashed border-stone-600',
        fontFamily: 'font-serif', textColor: 'text-stone-800', accentColor: 'text-stone-600',
        decoration: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")'
     });
     templates.push({
        id: `vint-${idCounter++}`, name: `Classic ${i+1}`, category: 'Vintage',
        bgClass: bg, borderClass: 'border-8 border-double border-stone-800',
        fontFamily: 'font-display', textColor: 'text-stone-900', accentColor: 'text-stone-700',
        decoration: ''
     });
  });

  return templates;
};

const TEMPLATES = generateTemplates();

const InvitationMaker: React.FC<InvitationMakerProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'design' | 'style'>('details');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Content State
  const [content, setContent] = useState({
    groom: 'Karthik',
    bride: 'Lakshmi',
    date: '2024-12-15',
    time: '10:00 AM',
    venue: 'Taj Coromandel, Chennai',
    message: 'We request the honor of your presence to celebrate our wedding.',
    rsvp: 'RSVP: 9876543210'
  });

  // Draggable Positions
  const [positions, setPositions] = useState({
    title: { x: 0, y: 0 },
    names: { x: 0, y: 0 },
    message: { x: 0, y: 0 },
    details: { x: 0, y: 0 },
    rsvp: { x: 0, y: 0 }
  });

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!canvasRef.current || !window.html2canvas) {
       alert("Download functionality requires html2canvas support.");
       return;
    }
    
    setIsDownloading(true);
    setShowDownloadMenu(false);

    try {
       // Wait a tick for UI to be ready (remove drag handles if any, though here we don't have explicit handles visible)
       const canvas = await window.html2canvas(canvasRef.current, {
          scale: 3, // High resolution
          useCORS: true,
          backgroundColor: null,
          logging: false
       });
       
       const image = canvas.toDataURL(`image/${format}`, 1.0);
       const link = document.createElement('a');
       link.href = image;
       link.download = `wedding-invitation-${Date.now()}.${format}`;
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
       
    } catch (error) {
       console.error("Download failed:", error);
       alert("Could not generate image. Please try again.");
    } finally {
       setIsDownloading(false);
    }
  };

  const filteredTemplates = selectedCategory === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const currentTheme = TEMPLATES.find(t => t.id === selectedTemplate.id) || TEMPLATES[0];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-[#050505] relative overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-white/5 flex justify-between items-center px-6 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layout className="text-purple-600" size={20} /> Digital Invitation Studio
          </h2>
        </div>
        <div className="flex gap-2 relative">
          <button onClick={() => setPositions({ title: {x:0,y:0}, names: {x:0,y:0}, message: {x:0,y:0}, details: {x:0,y:0}, rsvp: {x:0,y:0} })} className="p-2 text-gray-500 hover:text-purple-600" title="Reset Positions">
            <RotateCcw size={18} />
          </button>
          
          <div className="relative">
             <PremiumButton onClick={() => setShowDownloadMenu(!showDownloadMenu)} icon={<Download size={16} />} className="!py-2 !px-4 !text-xs flex items-center gap-2">
                {isDownloading ? 'Generating...' : 'Download'} <ChevronDown size={14} />
             </PremiumButton>
             
             {showDownloadMenu && !isDownloading && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden z-50">
                   <button onClick={() => handleDownload('png')} className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200">
                      Download PNG
                   </button>
                   <button onClick={() => handleDownload('jpeg')} className="w-full text-left px-4 py-3 hover:bg-purple-50 dark:hover:bg-white/5 text-sm font-bold text-gray-700 dark:text-gray-200">
                      Download JPEG
                   </button>
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: CONTROLS */}
        <div className="w-80 md:w-96 bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-white/5 flex flex-col z-10 shadow-xl">
          <div className="flex border-b border-gray-200 dark:border-white/5">
            {[
              { id: 'details', icon: Type, label: 'Details' },
              { id: 'design', icon: Grid, label: 'Templates' },
              { id: 'style', icon: Palette, label: 'Customize' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-colors ${activeTab === tab.id ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/10 border-b-2 border-purple-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'details' && (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
                <h3 className="font-bold text-sm mb-2 text-gray-500 uppercase">Wedding Details</h3>
                <AnimatedInput label="Groom's Name" value={content.groom} onChange={e => setContent({...content, groom: e.target.value})} />
                <AnimatedInput label="Bride's Name" value={content.bride} onChange={e => setContent({...content, bride: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                   <AnimatedInput label="Date" type="date" value={content.date} onChange={e => setContent({...content, date: e.target.value})} />
                   <AnimatedInput label="Time" type="time" value={content.time} onChange={e => setContent({...content, time: e.target.value})} />
                </div>
                <AnimatedTextArea label="Venue Address" value={content.venue} onChange={e => setContent({...content, venue: e.target.value})} />
                <AnimatedTextArea label="Invitation Message" value={content.message} onChange={e => setContent({...content, message: e.target.value})} />
                <AnimatedInput label="RSVP Contact" value={content.rsvp} onChange={e => setContent({...content, rsvp: e.target.value})} />
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-sm text-gray-500 uppercase">Choose Template</h3>
                   <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">{filteredTemplates.length}</span>
                </div>
                
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                   {['All', ...CATEGORIES].map(cat => (
                      <button
                         key={cat}
                         onClick={() => setSelectedCategory(cat)}
                         className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                            selectedCategory === cat 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                         }`}
                      >
                         {cat}
                      </button>
                   ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedTemplate(t)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all group ${selectedTemplate.id === t.id ? 'border-purple-600 ring-2 ring-purple-500/20' : 'border-gray-200 dark:border-white/10 opacity-80 hover:opacity-100 hover:border-purple-300'}`}
                    >
                      <div className={`h-24 w-full ${t.bgClass} flex items-center justify-center relative overflow-hidden`}>
                         <div className="absolute inset-0 opacity-30" style={{ background: t.decoration }}></div>
                         <div className={`w-12 h-8 border ${t.textColor} flex items-center justify-center text-[6px] relative z-10 bg-white/10 backdrop-blur-sm`}>Aa</div>
                      </div>
                      <div className="p-2 text-center text-xs font-bold bg-gray-50 dark:bg-white/5 flex justify-between items-center">
                         <span className="truncate">{t.name}</span>
                         {selectedTemplate.id === t.id && <Check size={12} className="text-purple-600" />}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                   <div className="flex items-start gap-3">
                      <MousePointer2 size={20} className="text-purple-600 mt-1" />
                      <div>
                         <h4 className="font-bold text-sm text-purple-900 dark:text-purple-100">Drag & Drop Enabled</h4>
                         <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">You can move text elements freely on the canvas to adjust the layout.</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'style' && (
               <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                  <h3 className="font-bold text-sm mb-2 text-gray-500 uppercase">Customization</h3>
                  <div>
                     <label className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2 block">Font Family</label>
                     <div className="grid grid-cols-1 gap-2">
                        {['font-display', 'font-serif', 'font-sans', 'font-mono'].map(f => (
                           <button 
                              key={f}
                              onClick={() => setSelectedTemplate(prev => ({...prev, fontFamily: f}))}
                              className={`p-3 rounded-lg border text-sm ${selectedTemplate.fontFamily === f ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-white/10'} ${f}`}
                           >
                              The Wedding of
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-2 block">Background Texture</label>
                     <div className="flex gap-2 flex-wrap">
                        {['bg-white', 'bg-[#1a0b2e]', 'bg-red-900', 'bg-pink-50', 'bg-[#fffdd0]', 'bg-slate-900'].map(bg => (
                           <button 
                              key={bg}
                              onClick={() => setSelectedTemplate(prev => ({...prev, bgClass: bg}))}
                              className={`w-8 h-8 rounded-full border-2 ${bg} ${selectedTemplate.bgClass === bg ? 'border-purple-600 scale-110 shadow-lg' : 'border-gray-200'}`}
                           />
                        ))}
                     </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* CENTER: CANVAS */}
        <div className="flex-1 bg-gray-100 dark:bg-[#0a0a0a] relative flex items-center justify-center p-8 overflow-auto">
           {/* Canvas Container with ID for Capture */}
           <div className="relative shadow-2xl transition-all duration-500">
              <motion.div 
                 id="invitation-card"
                 ref={canvasRef}
                 className={`
                    w-[400px] h-[600px] relative overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-8
                    ${currentTheme.bgClass} ${currentTheme.borderClass} ${currentTheme.fontFamily} ${currentTheme.textColor}
                 `}
                 style={{
                    background: currentTheme.bgClass.startsWith('bg-') ? undefined : currentTheme.bgClass, // Handle hex if passed directly
                    backgroundImage: currentTheme.decoration ? `${currentTheme.decoration}` : undefined
                 }}
              >
                 {/* Decorative Elements */}
                 <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 opacity-50 border-current pointer-events-none" />
                 <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 opacity-50 border-current pointer-events-none" />
                 <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 opacity-50 border-current pointer-events-none" />
                 <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 opacity-50 border-current pointer-events-none" />

                 {/* Draggable Content */}
                 <div className="relative w-full h-full">
                    
                    <motion.div drag dragMomentum={false} className="absolute inset-x-0 top-10 cursor-move" style={{ x: positions.title.x, y: positions.title.y }}>
                       <h4 className={`text-sm uppercase tracking-[0.3em] ${currentTheme.accentColor}`}>The Wedding Of</h4>
                    </motion.div>

                    <motion.div drag dragMomentum={false} className="absolute inset-x-0 top-24 cursor-move" style={{ x: positions.names.x, y: positions.names.y }}>
                       <h1 className="text-4xl font-bold leading-tight">
                          {content.groom} <br/> <span className={`text-2xl ${currentTheme.accentColor}`}>&</span> <br/> {content.bride}
                       </h1>
                    </motion.div>

                    <motion.div drag dragMomentum={false} className="absolute inset-x-0 top-60 cursor-move px-4" style={{ x: positions.message.x, y: positions.message.y }}>
                       <p className="text-sm opacity-90 italic leading-relaxed">{content.message}</p>
                    </motion.div>

                    <motion.div drag dragMomentum={false} className="absolute inset-x-0 bottom-32 cursor-move" style={{ x: positions.details.x, y: positions.details.y }}>
                       <div className="space-y-2">
                          <p className={`text-lg font-bold ${currentTheme.accentColor}`}>{content.date} • {content.time}</p>
                          <p className="text-sm font-medium px-8">{content.venue}</p>
                       </div>
                    </motion.div>

                    <motion.div drag dragMomentum={false} className="absolute inset-x-0 bottom-10 cursor-move" style={{ x: positions.rsvp.x, y: positions.rsvp.y }}>
                       <p className="text-xs uppercase tracking-widest opacity-70">{content.rsvp}</p>
                    </motion.div>

                 </div>
              </motion.div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default InvitationMaker;
