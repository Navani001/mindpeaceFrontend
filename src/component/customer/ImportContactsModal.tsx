"use client";

import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Progress,
  Chip
} from '@heroui/react';
import { Upload, FileText, Download, CheckCircle, AlertCircle, X } from 'lucide-react';

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandId: string;
  agentId: string;
  onImportComplete: () => void;
}

interface ImportResult {
  success: number;
  failed: number;
  duplicates: number;
  errors: string[];
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  isOpen,
  onClose,
  brandId,
  agentId,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    setStep('upload');
    setIsProcessing(false);
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      alert('Please select a valid CSV or Excel file');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const csvContent = "name,phone_number,country_code\nJohn Doe,+1234567890,+1\nJane Smith,+0987654321,+1";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const processImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStep('processing');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // This would be implemented in the backend
      const response = await fetch(`/api/audience/${brandId}/${agentId}/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setImportResult(result.data);
        setStep('result');
        onImportComplete();
      } else {
        throw new Error('Failed to import contacts');
      }
    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: 0,
        failed: 1,
        duplicates: 0,
        errors: ['Failed to process import. Please try again.']
      });
      setStep('result');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderUploadStep = () => (
    <ModalBody className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Import Contacts</h3>
        <p className="text-sm text-gray-600">
          Upload a CSV or Excel file with your contacts. Make sure to include name, phone_number, and country_code columns.
        </p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{file.name}</span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => setFile(null)}
                  className="text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">
                Drop your file here or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports CSV, XLS, XLSX files up to 5MB
              </p>
            </div>
          )}
        </div>
      </div>

      <Card className="bg-amber-50 border border-amber-200">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-amber-800">File Format Requirements</p>
              <ul className="text-xs text-amber-700 space-y-1">
                <li>• Include columns: name, phone_number, country_code</li>
                <li>• Phone numbers should include country code</li>
                <li>• Duplicate phone numbers will be skipped</li>
              </ul>
              <Button
                size="sm"
                variant="light"
                onPress={downloadTemplate}
                startContent={<Download className="w-4 h-4" />}
                className="text-amber-700 hover:bg-amber-100"
              >
                Download Template
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </ModalBody>
  );

  const renderProcessingStep = () => (
    <ModalBody className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Processing Import</h3>
          <p className="text-sm text-gray-600">Please wait while we process your contacts...</p>
        </div>
        <Progress 
          value={50}
          color="primary"
          className="w-full"
          isIndeterminate
        />
      </div>
    </ModalBody>
  );

  const renderResultStep = () => (
    <ModalBody className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Import Complete</h3>
      </div>

      {importResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-green-50 border border-green-200">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.success}</div>
                <div className="text-sm text-green-700">Imported</div>
              </CardBody>
            </Card>
            
            <Card className="bg-red-50 border border-red-200">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                <div className="text-sm text-red-700">Failed</div>
              </CardBody>
            </Card>
            
            <Card className="bg-amber-50 border border-amber-200">
              <CardBody className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">{importResult.duplicates}</div>
                <div className="text-sm text-amber-700">Duplicates</div>
              </CardBody>
            </Card>
          </div>

          {importResult.errors.length > 0 && (
            <Card className="bg-red-50 border border-red-200">
              <CardBody className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-800">Errors:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </ModalBody>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="lg"
      classNames={{
        base: "bg-white",
        body: "py-6",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold">Import Contacts</span>
          </div>
        </ModalHeader>

        {step === 'upload' && renderUploadStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'result' && renderResultStep()}

        <ModalFooter>
          {step === 'upload' && (
            <>
              <Button variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={processImport}
                isDisabled={!file}
                startContent={<Upload className="w-4 h-4" />}
              >
                Import Contacts
              </Button>
            </>
          )}
          
          {step === 'processing' && (
            <Button variant="light" onPress={handleClose} isDisabled>
              Processing...
            </Button>
          )}
          
          {step === 'result' && (
            <Button color="primary" onPress={handleClose}>
              Done
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImportContactsModal;
