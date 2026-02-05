"use client";

import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
  Card,
  CardBody,
  Avatar,
  Chip,
  Input,
  Select,
  SelectItem,
  Divider
} from '@heroui/react';
import { Send, MessageCircle, User, Phone, Clock, Image, Paperclip } from 'lucide-react';
import { AudienceUser } from './types';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: AudienceUser | null;
  brandId: string;
  agentId: string;
  onMessageSent: () => void;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'text' | 'media';
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({
  isOpen,
  onClose,
  customer,
  brandId,
  agentId,
  onMessageSent
}) => {
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'media'>('text');
  const [isSending, setIsSending] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Mock templates - in real app, these would come from an API
  const templates: MessageTemplate[] = [
    {
      id: '1',
      name: 'Welcome Message',
      content: 'Welcome to our service! We\'re excited to have you on board.',
      type: 'text'
    },
    {
      id: '2',
      name: 'Promotional Offer',
      content: 'Special offer just for you! Get 20% off your next purchase with code SAVE20.',
      type: 'text'
    },
    {
      id: '3',
      name: 'Thank You',
      content: 'Thank you for your business! We appreciate your support.',
      type: 'text'
    }
  ];

  const handleClose = () => {
    setMessage('');
    setSelectedTemplate('');
    setMessageType('text');
    setMediaFile(null);
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setMessageType(template.type);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image or video file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      setMediaFile(file);
    }
  };

  const sendMessage = async () => {
    if (!customer || (!message.trim() && !mediaFile)) return;

    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('type', messageType);
      formData.append('recipientId', customer.id.toString());
      
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      // This would be implemented in the backend
      const response = await fetch(`/api/audience/${brandId}/${agentId}/send-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        onMessageSent();
        handleClose();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getCustomerStatus = () => {
    const subscription = customer?.subscriptions?.[0];
    return subscription?.status || 'pending';
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2-$3-$4');
  };

  if (!customer) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="2xl"
      classNames={{
        base: "bg-white",
        body: "py-6",
        header: "border-b border-gray-200",
        footer: "border-t border-gray-200"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold">Send Message</span>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-6">
          {/* Customer Info */}
          <Card className="bg-gray-50">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    icon={<User className="w-5 h-5" />}
                    size="md"
                    className="bg-blue-100 text-blue-600"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{customer.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      {formatPhoneNumber(customer.phone_number)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    size="sm"
                    color={getCustomerStatus() === 'subscribed' ? 'success' : 'warning'}
                    variant="flat"
                  >
                    {getCustomerStatus()}
                  </Chip>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {customer._count?.messages || 0} messages
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Message Templates */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Quick Templates (Optional)
            </label>
            <Select
              placeholder="Choose a template to get started"
              selectedKeys={selectedTemplate ? [selectedTemplate] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                setSelectedTemplate(selectedKey);
                handleTemplateSelect(selectedKey);
              }}
              classNames={{
                trigger: "bg-white border border-gray-300"
              }}
            >
              {templates.map((template) => (
                <SelectItem key={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <Divider />

          {/* Message Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">Message Type</label>
            <div className="flex gap-4">
              <Button
                variant={messageType === 'text' ? 'solid' : 'bordered'}
                color={messageType === 'text' ? 'primary' : 'default'}
                onPress={() => setMessageType('text')}
                startContent={<MessageCircle className="w-4 h-4" />}
              >
                Text Message
              </Button>
              <Button
                variant={messageType === 'media' ? 'solid' : 'bordered'}
                color={messageType === 'media' ? 'primary' : 'default'}
                onPress={() => setMessageType('media')}
                startContent={<Image className="w-4 h-4" />}
              >
                Media Message
              </Button>
            </div>
          </div>

          {/* Media Upload (if media type selected) */}
          {messageType === 'media' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Media File</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                >
                  <div className="text-center space-y-2">
                    <Paperclip className="w-6 h-6 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      {mediaFile ? mediaFile.name : 'Click to upload image or video'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Max 10MB • JPG, PNG, GIF, MP4
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900">
              Message Content
            </label>
            <Textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minRows={4}
              maxRows={8}
              classNames={{
                input: "resize-none",
                inputWrapper: "bg-white border border-gray-300"
              }}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Characters: {message.length}</span>
              <span>Recommended: Keep under 1000 characters</span>
            </div>
          </div>

          {/* Preview */}
          {(message.trim() || mediaFile) && (
            <Card className="bg-blue-50 border border-blue-200">
              <CardBody className="p-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800">Message Preview</p>
                  <div className="bg-white rounded-lg p-3 border">
                    {mediaFile && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Image className="w-4 h-4" />
                          {mediaFile.name}
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {message || 'Media message with no text content'}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={sendMessage}
            isLoading={isSending}
            isDisabled={!message.trim() && !mediaFile}
            startContent={!isSending && <Send className="w-4 h-4" />}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SendMessageModal;
