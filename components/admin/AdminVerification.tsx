
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Eye, ZoomIn, 
  RotateCcw, FileText, User, Camera, Calendar, Clock, Filter, Search,
  ChevronRight, Play, File, ChevronLeft
} from 'lucide-react';
import { MOCK_VERIFICATIONS, MOCK_VERIFICATION_HISTORY, VerificationRequest } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';

const AdminVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedReq, setSelectedReq] = useState<VerificationRequest | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Combine data based on tab
  const data = activeTab === 'pending' ? MOCK_VERIFICATIONS : MOCK_VERIFICATION_HISTORY;
  
  // Filter logic
  const filteredData = data.filter(item => {
    const matchesType = filterType === 'all' || item.docType.toLowerCase() === filterType;
    const matchesSearch = item.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleApprove = (id: string) => {
    alert(`Verified Request ${id}. Status synced to User Dashboard.`);
    setSelectedReq(null);
  };

  const handleReject = (id: string, reason: string) => {
    alert(`Rejected Request ${id}: ${reason}. Notification sent to user.`);
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending' 
              ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            Pending <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{MOCK_VERIFICATIONS.length}</span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'history' 
              ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            History
          </button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search User ID or Name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-purple-500"
            />
          </div>
          <div className="relative group">
             <button className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
               <Filter size={18} />
             </button>
             {/* Simple Dropdown for Demo */}
             <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-10 p-1">
                {['all', 'aadhaar', 'pan', 'passport'].map(t => (
                   <button 
                     key={t}
                     onClick={() => setFilterType(t)}
                     className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-white/10 ${filterType === t ? 'text-purple-600' : 'text-gray-500'}`}
                   >
                      {t}
                   </button>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {paginatedData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
            {paginatedData.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Risk Indicator Strip */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${item.riskScore > 70 ? 'bg-red-500' : item.riskScore > 30 ? 'bg-amber-500' : 'bg-green-500'}`} />

                <div className="flex justify-between items-start mb-4 pl-3">
                  <div className="flex items-center gap-3">
                      <img src={item.avatar} alt={item.userName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.userName}</h4>
                        <p className="text-xs text-gray-500">{item.userId}</p>
                      </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'}`}>
                      {item.status}
                  </span>
                </div>

                <div className="space-y-3 pl-3 mb-6">
                  <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Document Type</span>
                      <span className="font-bold">{item.docType}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                      <span className="text-gray-500">AI Risk Score</span>
                      <span className={`font-bold ${item.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>{item.riskScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Face Match</span>
                      <span className={`font-bold ${item.aiAnalysis.faceMatchScore < 60 ? 'text-red-500' : 'text-green-500'}`}>{item.aiAnalysis.faceMatchScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Submitted</span>
                      <span className="text-gray-900 dark:text-white font-mono">{item.submittedAt}</span>
                  </div>
                  {(item.videoUrl || item.horoscopeUrl) && (
                      <div className="flex gap-2 pt-1">
                        {item.videoUrl && <div className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded flex items-center gap-1"><Play size={8} /> Video</div>}
                        {item.horoscopeUrl && <div className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded flex items-center gap-1"><FileText size={8} /> Horoscope</div>}
                      </div>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedReq(item)}
                  className="w-full py-3 ml-1.5 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 text-sm font-bold text-purple-600 dark:text-purple-400 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20"
                >
                  {activeTab === 'pending' ? 'Review Application' : 'View Details'} <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <Shield size={48} className="opacity-20 mb-4" />
             <p>No requests found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="border-t border-gray-200 dark:border-white/10 pt-4 flex justify-between items-center shrink-0">
           <p className="text-xs text-gray-500">Showing {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(filteredData.length, currentPage * itemsPerPage)} of {filteredData.length}</p>
           <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
              >
                 <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                 <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                 >
                    {i + 1}
                 </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 transition-colors"
              >
                 <ChevronRight size={16} />
              </button>
           </div>
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReq && (
          <ReviewModal 
            req={selectedReq} 
            onClose={() => setSelectedReq(null)}
            onApprove={() => handleApprove(selectedReq.id)}
            onReject={(reason) => handleReject(selectedReq.id, reason)}
            readOnly={activeTab === 'history'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENT: REVIEW MODAL ---
const ReviewModal: React.FC<{ 
  req: VerificationRequest; 
  onClose: () => void; 
  onApprove: () => void; 
  onReject: (r: string) => void;
  readOnly?: boolean;
}> = ({ req, onClose, onApprove, onReject, readOnly }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'identity' | 'media' | 'horoscope'>('identity');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
       <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="absolute inset-0 bg-black/80 backdrop-blur-md"
         onClick={onClose}
       />
       <motion.div 
         initial={{ scale: 0.95, opacity: 0, y: 50 }} 
         animate={{ scale: 1, opacity: 1, y: 0 }} 
         exit={{ scale: 0.95, opacity: 0, y: 50 }}
         className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row"
       >
          {/* LEFT: Analysis & Details */}
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 p-6 overflow-y-auto custom-scrollbar">
             <div className="flex items-center gap-4 mb-8">
                <img src={req.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                <div>
                   <h3 className="font-bold text-xl text-gray-900 dark:text-white">{req.userName}</h3>
                   <span className="text-xs font-bold uppercase bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-0.5 rounded">{req.userRole}</span>
                </div>
             </div>

             <div className="space-y-6">
                {/* AI Score Card */}
                <div className={`p-5 rounded-2xl border ${req.riskScore > 50 ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30'}`}>
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Risk Score</span>
                      <span className={`text-xl font-bold ${req.riskScore > 50 ? 'text-red-600' : 'text-green-600'}`}>{req.riskScore}/100</span>
                   </div>
                   <div className="w-full h-1.5 bg-gray-200 dark:bg-black/20 rounded-full overflow-hidden">
                      <div className={`h-full ${req.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${req.riskScore}%` }} />
                   </div>
                   {req.riskScore > 50 && (
                      <p className="text-xs text-red-600 mt-2 font-medium flex items-center gap-1">
                         <AlertTriangle size={12} /> High risk detected by AI
                      </p>
                   )}
                </div>

                {/* Face Match Analysis */}
                <div className="bg-white dark:bg-black/20 p-5 rounded-2xl border border-gray-200 dark:border-white/10">
                   <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><Eye size={16} className="text-purple-500" /> Face Match Analysis</h4>
                   <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Confidence Score</span>
                         <span className="font-bold">{req.aiAnalysis.faceMatchScore}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Details Match</span>
                         <span className={req.aiAnalysis.detailsMatch ? 'text-green-500' : 'text-red-500'}>
                            {req.aiAnalysis.detailsMatch ? <CheckCircle size={14} /> : <XCircle size={14} />}
                         </span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-gray-500">Tamper Check</span>
                         <span className={!req.aiAnalysis.tamperDetected ? 'text-green-500' : 'text-red-500'}>
                            {!req.aiAnalysis.tamperDetected ? 'Passed' : 'Failed'}
                         </span>
                      </div>
                      <div className="pt-2 border-t border-dashed border-gray-200 dark:border-white/10">
                         <p className="text-xs text-gray-400 mb-1">OCR Extracted Name</p>
                         <p className="text-sm font-mono font-bold bg-gray-100 dark:bg-white/10 p-2 rounded">{req.aiAnalysis.ocrName}</p>
                      </div>
                   </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-xs text-gray-500">
                   <div className="flex justify-between">
                      <span>Document ID:</span>
                      <span className="font-mono">{req.docNumber}</span>
                   </div>
                   <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span>{req.submittedAt}</span>
                   </div>
                   {req.adminActionBy && (
                      <div className="flex justify-between text-purple-600">
                         <span>Action By:</span>
                         <span>{req.adminActionBy}</span>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* RIGHT: Document Viewer */}
          <div className="flex-1 flex flex-col h-full relative">
             {/* Tabs */}
             <div className="flex gap-6 border-b border-gray-200 dark:border-white/10 px-6 pt-4">
                <button onClick={() => setViewTab('identity')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${viewTab === 'identity' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Identity Docs</button>
                {req.videoUrl && <button onClick={() => setViewTab('media')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${viewTab === 'media' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Intro Video</button>}
                {req.horoscopeUrl && <button onClick={() => setViewTab('horoscope')} className={`pb-4 text-sm font-bold border-b-2 transition-colors ${viewTab === 'horoscope' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'}`}>Horoscope</button>}
             </div>

             <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-gray-100 dark:bg-black/40">
                <AnimatePresence mode="wait">
                   {viewTab === 'identity' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6">
                         <div>
                            <h4 className="font-bold text-gray-500 text-xs uppercase mb-3 ml-1">Live Selfie</h4>
                            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/10 relative group h-64 bg-black/5">
                               <img src={req.images.selfie} className="w-full h-full object-contain" />
                               <button onClick={() => setZoomImg(req.images.selfie)} className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn size={20} />
                               </button>
                            </div>
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-500 text-xs uppercase mb-3 ml-1">{req.docType} Front</h4>
                            <div className="rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/10 relative group h-64 bg-black/5">
                               <img src={req.images.front} className="w-full h-full object-contain" />
                               <button onClick={() => setZoomImg(req.images.front)} className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ZoomIn size={20} />
                               </button>
                            </div>
                         </div>
                         {req.images.back && (
                            <div>
                               <h4 className="font-bold text-gray-500 text-xs uppercase mb-3 ml-1">{req.docType} Back</h4>
                               <div className="rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-white/10 relative group h-64 bg-black/5">
                                  <img src={req.images.back} className="w-full h-full object-contain" />
                                  <button onClick={() => setZoomImg(req.images.back)} className="absolute bottom-4 right-4 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                     <ZoomIn size={20} />
                                  </button>
                               </div>
                            </div>
                         )}
                      </motion.div>
                   )}

                   {viewTab === 'media' && req.videoUrl && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center h-full">
                         <div className="relative w-full max-w-lg aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <video src={req.videoUrl} controls className="w-full h-full" />
                         </div>
                      </motion.div>
                   )}

                   {viewTab === 'horoscope' && req.horoscopeUrl && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full">
                         <div className="p-8 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 text-center">
                            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                               <FileText size={32} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Jathagam / Horoscope File</h3>
                            <p className="text-gray-500 text-sm mb-6">Verified PDF format uploaded by user.</p>
                            <PremiumButton variant="outline" icon={<Eye size={16} />}>View PDF</PremiumButton>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>

             {/* Action Footer */}
             {!readOnly && (
                <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10">
                   {!showRejectInput ? (
                      <div className="flex gap-4">
                         <button 
                           onClick={() => setShowRejectInput(true)} 
                           className="flex-1 py-3 border border-red-200 dark:border-red-900/30 text-red-600 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                         >
                            <XCircle size={18} /> Reject
                         </button>
                         <button className="flex-1 py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                            <RotateCcw size={18} /> Request Re-upload
                         </button>
                         <PremiumButton onClick={onApprove} className="flex-[2] flex items-center justify-center gap-2">
                            <CheckCircle size={18} /> Approve Verified
                         </PremiumButton>
                      </div>
                   ) : (
                      <div className="space-y-4">
                         <h4 className="font-bold text-red-600">Reason for Rejection</h4>
                         <textarea 
                           className="w-full p-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm outline-none focus:border-red-500"
                           rows={3}
                           placeholder="Enter reason (e.g., blurred image, name mismatch)..."
                           value={rejectReason}
                           onChange={(e) => setRejectReason(e.target.value)}
                         />
                         <div className="flex gap-3 justify-end">
                            <button onClick={() => setShowRejectInput(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
                            <button 
                              onClick={() => onReject(rejectReason)} 
                              className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
                              disabled={!rejectReason}
                            >
                               Confirm Rejection
                            </button>
                         </div>
                      </div>
                   )}
                </div>
             )}
          </div>

          {/* Zoom Modal Overlay */}
          {zoomImg && (
             <div className="absolute inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomImg(null)}>
                <img src={zoomImg} className="max-w-full max-h-full object-contain" />
             </div>
          )}
       </motion.div>
    </div>
  );
};

export default AdminVerification;
