
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MoreHorizontal, Filter, Download, Search, CheckSquare, Square } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => React.ReactNode;
  onBulkAction?: (selectedIds: string[]) => void;
  title?: string;
  enableSearch?: boolean;
  enableExport?: boolean;
}

export function AdminTable<T extends { id: string }>({ 
  data, columns, actions, onBulkAction, title, enableSearch = true, enableExport = true 
}: AdminTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const itemsPerPage = 10;

  // Filter
  const filteredData = data.filter((item) =>
    Object.values(item as any).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {enableSearch && (
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
              />
            </div>
          )}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
            <Filter size={18} />
          </button>
          {enableExport && (
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 transition-colors">
              <Download size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && onBulkAction && (
        <div className="bg-purple-50 dark:bg-purple-900/10 px-6 py-2 flex items-center justify-between">
          <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{selectedItems.length} selected</span>
          <button 
            onClick={() => onBulkAction(selectedItems)}
            className="text-xs font-bold bg-white dark:bg-black/20 text-red-500 px-3 py-1 rounded shadow-sm hover:bg-red-50"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
              <th className="p-4 w-10">
                <button onClick={toggleSelectAll} className="text-gray-400 hover:text-purple-600">
                  {selectedItems.length > 0 && selectedItems.length === paginatedData.length ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
              </th>
              {columns.map((col) => (
                <th 
                  key={String(col.key)} 
                  className={`p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ${col.sortable ? 'cursor-pointer hover:text-purple-600' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="p-4 w-10"></th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
                className={`border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${selectedItems.includes(item.id) ? 'bg-purple-50/30 dark:bg-purple-900/10' : ''}`}
              >
                <td className="p-4">
                  <button onClick={() => toggleSelect(item.id)} className={`transition-colors ${selectedItems.includes(item.id) ? 'text-purple-600' : 'text-gray-300'}`}>
                    {selectedItems.includes(item.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                {columns.map((col) => (
                  <td key={String(col.key)} className="p-4 text-sm text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                  </td>
                ))}
                {actions && (
                  <td className="p-4 text-right">
                    <div className="relative group">
                      <button className="p-1 text-gray-400 hover:text-purple-600 rounded">
                        <MoreHorizontal size={18} />
                      </button>
                      {/* Dropdown would go here in full implementation, simplified for demo */}
                      <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-white/10 p-1 hidden group-hover:block z-10 min-w-[120px]">
                        {actions(item)}
                      </div>
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-white/5 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-md text-sm font-bold flex items-center justify-center transition-colors ${currentPage === i + 1 ? 'bg-purple-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md border border-gray-200 dark:border-white/10 text-sm disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
