"use client";

import React, { useState, ChangeEvent } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Chip } from '@heroui/react';
import { UserPlus, Phone, User, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { CreateUserData, countryCodes } from './types';

interface CustomerCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreate: (data: CreateUserData) => Promise<void>;
  isLoading?: boolean;
}

const CustomerCreator: React.FC<CustomerCreatorProps> = ({
  isOpen,
  onClose,
  onCustomerCreate,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<CreateUserData>({
    phone_number: '',
    name: '',
    country_code: '+1'
  });
  const [errors, setErrors] = useState<Partial<CreateUserData>>({});
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone_number.replace(/\D/g, ''))) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }

    if (!formData.country_code) {
      newErrors.country_code = 'Country code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setStep('preview');
  };

  const handleConfirmCreate = async () => {
    try {
      await onCustomerCreate(formData);
      setStep('success');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating customer:', error);
      setStep('form');
    }
  };

  const handleClose = () => {
    setFormData({
      phone_number: '',
      name: '',
      country_code: '+1'
    });
    setErrors({});
    setStep('form');
    onClose();
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneDisplay = () => {
    return `${formData.country_code} ${formData.phone_number}`;
  };

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Add New Customer</h3>
        <p className="text-gray-600">Enter customer details to add them to your audience</p>
      </div>

      <div className="space-y-5">
        <div className="relative">
          <Input
            label="Customer Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
            isInvalid={!!errors.name}
            errorMessage={errors.name}
            startContent={<User className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            size="lg"
            classNames={{
              label: "text-gray-700 font-medium",
              input: "text-gray-900",
              inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
            }}
            isRequired
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select
            label="Country"
            placeholder="Code"
            selectedKeys={formData.country_code ? [formData.country_code] : []}
            onSelectionChange={(keys: any) => {
              const value = Array.from(keys)[0] as string;
              handleInputChange('country_code', value);
            }}
            isInvalid={!!errors.country_code}
            errorMessage={errors.country_code}
            startContent={<Globe className="w-4 h-4 text-gray-400" />}
            variant="bordered"
            size="lg"
            classNames={{
              label: "text-gray-700 font-medium",
              trigger: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
            }}
            isRequired
          >
            {countryCodes.map((code) => (
              <SelectItem key={code.key}>
                {code.label}
              </SelectItem>
            ))}
          </Select>

          <div className="col-span-2">
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phone_number}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('phone_number', e.target.value)}
              isInvalid={!!errors.phone_number}
              errorMessage={errors.phone_number}
              startContent={<Phone className="w-4 h-4 text-gray-400" />}
              variant="bordered"
              size="lg"
              classNames={{
                label: "text-gray-700 font-medium",
                input: "text-gray-900",
                inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
              }}
              isRequired
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="text-sm">
              <p className="text-blue-900 font-medium">Auto-subscription enabled</p>
              <p className="text-blue-700 mt-1">
                This customer will be automatically subscribed to receive messages from your brand and agent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Customer Details</h3>
        <p className="text-gray-600">Please review the information before adding</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Customer Name:</span>
          <span className="text-gray-900 font-semibold">{formData.name}</span>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Phone Number:</span>
          <div className="text-right">
            <span className="text-gray-900 font-semibold">{formatPhoneDisplay()}</span>
            <Chip size="sm" color="success" variant="flat" className="ml-2">
              Valid
            </Chip>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <span className="text-gray-600 font-medium">Subscription Status:</span>
          <Chip size="sm" color="primary" variant="flat">
            Auto-subscribed
          </Chip>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-900 font-medium">Ready to add customer</p>
            <p className="text-amber-700 mt-1">
              The customer will receive a welcome message and be added to your active audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Added Successfully!</h3>
      <p className="text-gray-600 mb-4">
        {formData.name} has been added to your audience and is now subscribed.
      </p>
      <div className="inline-flex items-center space-x-2 text-green-700 bg-green-100 px-4 py-2 rounded-full">
        <CheckCircle className="w-4 h-4" />
        <span className="font-medium">Active Subscription</span>
      </div>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="lg"
      placement="center"
      classNames={{
        backdrop: "bg-gray-900/50 backdrop-blur-sm",
        base: "border-0 shadow-2xl",
        header: "border-b border-gray-100",
        body: "py-6",
        footer: "border-t border-gray-100"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          {step === 'form' && 'Add New Customer'}
          {step === 'preview' && 'Confirm Details'}
          {step === 'success' && 'Success!'}
        </ModalHeader>
        
        <ModalBody>
          {step === 'form' && renderFormStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'success' && renderSuccessStep()}
        </ModalBody>
        
        {step !== 'success' && (
          <ModalFooter className="justify-between">
            {step === 'preview' ? (
              <>
                <Button 
                  variant="light" 
                  onPress={() => setStep('form')}
                  startContent={<User className="w-4 h-4" />}
                >
                  Back to Edit
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleConfirmCreate}
                  isLoading={isLoading}
                  startContent={<UserPlus className="w-4 h-4" />}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  Add Customer
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="danger" 
                  variant="light" 
                  onPress={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSubmit}
                  isDisabled={!formData.name || !formData.phone_number}
                  startContent={<CheckCircle className="w-4 h-4" />}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  Preview
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CustomerCreator;