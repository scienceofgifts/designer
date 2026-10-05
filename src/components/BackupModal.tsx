import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Calendar,
  Layers,
  Dna,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import {
  DesignItem,
  DesignDna,
  BackupValidationResult,
  BackupImportMode,
  BackupImportSummary,
} from '../types';
import { storage, downloadBackupJsonFile } from '../services/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  designs: DesignItem[];
  dna: DesignDna | null;
  onRestored: (summary: BackupImportSummary) => void;
  onNotification: (message: string, type?: 'success' | 'error') => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  designs,
  dna,
  onRestored,
  onNotification,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [pendingValidation, setPendingValidation] = useState<BackupValidationResult | null>(null);
  const [importMode, setImportMode] = useState<BackupImportMode>('merge');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(() =>
    storage.getLastBackupTimestamp()
  );

  if (!isOpen) return null;

  const analyzedCount = designs.filter((d) => d.analysisStatus === 'analyzed').length;

  const handleExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);
    try {
      const payload = await storage.exportBackup();
      downloadBackupJsonFile(payload);
      setLastBackup(payload.exportedAt);
      onNotification('Backup exported successfully. Saved to your downloads.');
    } catch (err: any) {
      console.error('Export backup error:', err);
      setErrorMessage(err?.message || 'Failed to export backup file.');
      onNotification('Failed to export backup.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = '';
    setErrorMessage(null);

    try {
      const text = await file.text();
      const validation = storage.validateBackup(text);

      if (!validation.isValid) {
        setErrorMessage(validation.error || 'The selected file is not a valid DesignDNA backup.');
        setPendingValidation(null);
        return;
      }

      setPendingValidation(validation);
    } catch (err: any) {
      console.error('Error reading backup file:', err);
      setErrorMessage('Could not read backup file. Please ensure it is a valid UTF-8 JSON file.');
      setPendingValidation(null);
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingValidation?.payload) return;

    setIsImporting(true);
    setErrorMessage(null);

    try {
      const summary = await storage.importBackup(pendingValidation.payload, importMode);
      setPendingValidation(null);
      onRestored(summary);
      onClose();

      if (summary.mode === 'replace') {
        onNotification(
          `Backup restored successfully. Library replaced with ${summary.totalFinalCount} designs.`
        );
      } else {
        onNotification(
          `Backup merged successfully. ${summary.addedCount} added, ${summary.updatedCount} updated (${summary.totalFinalCount} total).`
        );
      }
    } catch (err: any) {
      console.error('Import backup error:', err);
      setErrorMessage(err?.message || 'Failed to import backup into database.');
      onNotification('Failed to import backup.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#2563EB]">
                DATA & PERSISTENCE
              </span>
            </div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Local Backup & Restore
            </h2>
          </div>
          <button
            onClick={() => {
              setPendingValidation(null);
              setErrorMessage(null);
              onClose();
            }}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#F8FAFC]">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5 text-xs text-[#DC2626]">
              <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold block">Backup Validation Notice</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {!pendingValidation ? (
            <>
              {/* Current Storage Status Card */}
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#64748B]">
                    CURRENT BROWSER STORAGE
                  </span>
                  <span className="text-[10px] font-mono text-[#0D9488] font-semibold bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                    IndexedDB Active
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#0F172A] block font-mono">
                      {designs.length}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Designs</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#2563EB] block font-mono">
                      {analyzedCount}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Analyzed</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#0D9488] block font-mono">
                      {dna ? 'Active' : 'Empty'}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Creator DNA</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                  <span>Last exported backup:</span>
                  <span className="font-mono text-[#0F172A] font-medium">
                    {lastBackup ? new Date(lastBackup).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Export Card */}
                <div className="bg-white rounded-xl border border-[#CBD5E1] p-4.5 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
                      <Download className="w-4 h-4 stroke-[2.25]" />
                    </div>
                    <h3 className="text-xs font-semibold text-[#0F172A]">
                      Export Backup File
                    </h3>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Download a single, self-contained JSON backup containing all reference images, Gemini analyses, and Creator Design DNA.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full py-2.5 px-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>Export Backup</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white rounded-xl border border-[#CBD5E1] p-4.5 space-y-3 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#166534]">
                      <Upload className="w-4 h-4 stroke-[2.25]" />
                    </div>
                    <h3 className="text-xs font-semibold text-[#0F172A]">
                      Import Backup File
                    </h3>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Restore library references and Design DNA from a previously exported JSON backup file with merge or replace options.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3.5 bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer hover:border-[#94A3B8]"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Select Backup File</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Pending Validation & Restoration Mode View */
            <div className="space-y-4">
              {/* Backup File Info Card */}
              <div className="bg-white rounded-xl border border-[#CBD5E1] p-4.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#2563EB]">
                    VALIDATED BACKUP CONTENT
                  </span>
                  <span className="text-[10px] font-mono text-[#0D9488] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Format Verified
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#0F172A] block font-mono">
                      {pendingValidation.designsCount}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Designs</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#2563EB] block font-mono">
                      {pendingValidation.analyzedCount}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Analyzed</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-center">
                    <span className="text-lg font-bold text-[#0D9488] block font-mono">
                      {pendingValidation.hasDesignDna ? 'Yes' : 'No'}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase">Creator DNA</span>
                  </div>
                </div>

                {pendingValidation.exportedAt && (
                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                    <span>Backup created:</span>
                    <span className="font-mono text-[#0F172A]">
                      {new Date(pendingValidation.exportedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Mode Selection */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-[#64748B] block">
                  Select Restoration Method
                </span>

                <div className="space-y-2">
                  {/* Merge Option (Default) */}
                  <label
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all shadow-2xs ${
                      importMode === 'merge'
                        ? 'border-2 border-[#2563EB] bg-[#EFF6FF]'
                        : 'border-[#CBD5E1] bg-white hover:border-[#94A3B8]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="merge"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-[#0F172A] block">
                        Merge with Existing Library (Recommended)
                      </span>
                      <p className="text-[11px] text-[#475569] leading-relaxed">
                        Preserves all current designs, imports new designs from the backup, and upgrades unanalyzed designs if the backup contains Gemini analysis.
                      </p>
                    </div>
                  </label>

                  {/* Replace Option */}
                  <label
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all shadow-2xs ${
                      importMode === 'replace'
                        ? 'border-2 border-[#DC2626] bg-[#FEF2F2]'
                        : 'border-[#CBD5E1] bg-white hover:border-[#94A3B8]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-[#DC2626] focus:ring-[#DC2626]"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-[#991B1B] block">
                        Replace Existing Library
                      </span>
                      <p className="text-[11px] text-[#7F1D1D] leading-relaxed">
                        Clears the current browser library and replaces it completely with the exact contents of the backup file.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
          {!pendingValidation ? (
            <>
              <span className="text-xs font-mono text-[#64748B]">
                100% Client-Side · No External Servers
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPendingValidation(null)}
                className="px-3.5 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
              >
                Back
              </button>
              <div className="flex items-center gap-2.5">
                {importMode === 'replace' && (
                  <button
                    type="button"
                    onClick={handleExport}
                    className="px-3 py-2 text-xs font-medium text-[#334155] hover:text-[#0F172A] border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
                    title="Download safety backup before replacing"
                  >
                    Safety Backup First
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={isImporting}
                  className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 ${
                    importMode === 'replace'
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                      : 'bg-[#0F172A] hover:bg-[#1E293B]'
                  }`}
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <>
                      <span>{importMode === 'replace' ? 'Confirm & Replace' : 'Confirm & Merge'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
