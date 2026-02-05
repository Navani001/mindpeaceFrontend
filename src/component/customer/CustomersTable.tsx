"use client";

import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Card,
  CardBody
} from '@heroui/react';
import { MoreVertical, Phone, MessageCircle, UserMinus, Calendar, Edit3, Trash2, Send, Plus, Download } from 'lucide-react';
import { AudienceUser, subscriptionStatuses } from './types';

interface CustomersTableProps {
  customers: AudienceUser[];
  isLoading?: boolean;
  onEdit?: (customer: AudienceUser) => void;
  onDelete?: (customer: AudienceUser) => void;
  onUnsubscribe?: (customer: AudienceUser) => void;
  onMessage?: (customer: AudienceUser) => void;
}

const   CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  isLoading = false,
  onEdit,
  onDelete,
  onUnsubscribe,
  onMessage
}) => {
  const getStatusColor = (status: string) => {
    const statusObj = subscriptionStatuses.find(s => s.key === status);
    return statusObj?.color as any || 'default';
  };

  const formatPhoneNumber = (phoneNumber: string, countryCode: string) => {
    return `${countryCode} ${phoneNumber}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getSubscriptionStatus = (customer: AudienceUser) => {
    if (customer.subscriptions && customer.subscriptions.length > 0) {
      return customer.subscriptions[0].status;
    }
    return 'unsubscribed';
  };

  const columns = [
    { key: "customer", label: "CUSTOMER" },
    { key: "phone", label: "PHONE" },
    { key: "status", label: "STATUS" },
    { key: "messages", label: "MESSAGES" },
    { key: "joined", label: "JOINED" },
    { key: "actions", label: "ACTIONS" },
  ];

  const renderCell = (customer: AudienceUser, columnKey: React.Key) => {
    switch (columnKey) {
      case "customer":
        return (
          <User
            name={
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{customer.name}</span>
                <span className="text-xs text-gray-500">ID: {customer.id}</span>
              </div>
            }
            avatarProps={{
              name: customer.name.charAt(0).toUpperCase(),
              size: "md",
              className: "bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold"
            }}
            className="justify-start"
          />
        );
      case "phone":
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {formatPhoneNumber(customer.phone_number, customer.country_code)}
              </span>
              <span className="text-xs text-gray-500">Mobile</span>
            </div>
          </div>
        );
      case "status":
        const status = getSubscriptionStatus(customer);
        const statusConfig = {
          subscribed: { color: 'success', variant: 'flat', icon: '✓' },
          unsubscribed: { color: 'warning', variant: 'flat', icon: '✕' },
          pending: { color: 'default', variant: 'flat', icon: '○' }
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        
        return (
          <Chip
            size="sm"
            color={config.color as any}
            variant={config.variant as any}
            startContent={<span className="text-xs">{config.icon}</span>}
            className="font-medium"
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Chip>
        );
      case "messages":
        const messageCount = customer._count?.messages || 0;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {messageCount}
              </span>
              <span className="text-xs text-gray-500">
                {messageCount === 1 ? 'message' : 'messages'}
              </span>
            </div>
          </div>
        );
      case "joined":
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {formatDate(customer.created_at)}
              </span>
              <span className="text-xs text-gray-500">Join date</span>
            </div>
          </div>
        );
      case "actions":
        const dropdownItems = [];
        
        if (onEdit) {
          dropdownItems.push(
            <DropdownItem
              key="edit"
              onPress={() => onEdit(customer)}
              startContent={<Edit3 className="w-4 h-4" />}
              className="text-blue-600"
            >
              Edit Customer
            </DropdownItem>
          );
        }
        
        if (onMessage) {
          dropdownItems.push(
            <DropdownItem
              key="message"
              onPress={() => onMessage(customer)}
              startContent={<Send className="w-4 h-4" />}
              className="text-green-600"
            >
              Send Message
            </DropdownItem>
          );
        }
        
        if (onUnsubscribe && getSubscriptionStatus(customer) === 'subscribed') {
          dropdownItems.push(
            <DropdownItem
              key="unsubscribe"
              onPress={() => onUnsubscribe(customer)}
              className="text-orange-600"
              startContent={<UserMinus className="w-4 h-4" />}
            >
              Unsubscribe
            </DropdownItem>
          );
        }
        
        if (onDelete) {
          dropdownItems.push(
            <DropdownItem
              key="delete"
              onPress={() => onDelete(customer)}
              className="text-red-600"
              color="danger"
              startContent={<Trash2 className="w-4 h-4" />}
            >
              Delete Customer
            </DropdownItem>
          );
        }

        return (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="w-60">
              {dropdownItems}
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="p-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="text-gray-600 font-medium">Loading customers...</div>
              <div className="text-sm text-gray-500">Please wait while we fetch your audience data</div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="w-full border-dashed border-2 border-gray-200">
        <CardBody className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <UserMinus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Start building your audience by adding your first customer. You can import contacts or add them individually.
            </p>
            <div className="flex gap-3">
              <Button 
                color="primary" 
                variant="solid"
                startContent={<Plus className="w-4 h-4" />}
                className="font-medium"
              >
                Add First Customer
              </Button>
              <Button 
                variant="bordered"
                startContent={<Download className="w-4 h-4" />}
                className="font-medium"
              >
                Import Contacts
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm">
      <CardBody className="p-0">
        <Table 
          aria-label="Customers table"
          classNames={{
            wrapper: "shadow-none",
            th: "bg-gray-50 text-gray-700 font-semibold",
            td: "py-4",
          }}
          removeWrapper
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="text-left">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={customers}>
            {(customer) => (
              <TableRow 
                key={customer.id}
                className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {(columnKey) => (
                  <TableCell className="py-4">
                    {renderCell(customer, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default CustomersTable;