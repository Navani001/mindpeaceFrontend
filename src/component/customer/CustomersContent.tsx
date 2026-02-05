"use client";

import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from "axios";
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  Card, 
  CardBody,
  Pagination,
  useDisclosure
} from '@heroui/react';
import { Search, Plus, Filter, Download, Upload } from 'lucide-react';
import CustomerCreator from './CustomerCreator';
import CustomersTable from './CustomersTable';
import CustomerStats from './CustomerStats';
import ImportContactsModal from './ImportContactsModal';
import SendMessageModal from './SendMessageModal';
import { 
  AudienceUser, 
  AudienceFilters,
  CreateUserData,
  subscriptionStatuses 
} from './types';
import { deleteRequest, getRequest, postRequest } from '@/utils';

// Axios setup

// Response Interceptor




// API Response interface
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AudienceResponse {
  users: AudienceUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Service Functions
const AudienceService = {
  baseUrl: 'userSub',

  async createUser(
    brandId: string, 
    agentId: string, 
    userData: CreateUserData,
    token: string
  ): Promise<ApiResponse<AudienceUser>> {
    try {
      const response = await postRequest<any>(
        `${this.baseUrl}/add`,
        {
          ...userData
        }, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
      );
      
      // Extract the actual data from the axios response
      const responseData = response.data || response;
      return responseData as ApiResponse<AudienceUser>;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUsers(
    brandId: string,
    agentId: string,
      filters: AudienceFilters = {},
    token: string
  ): Promise<ApiResponse<AudienceResponse>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `${this.baseUrl}/brand/${brandId}${
        params.toString() ? `?${params.toString()}` : ''
      }`;
      

      const response = await getRequest<any>(url, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      });

      // Extract the actual data from the axios response
      const responseData = response.data || response;
      
      // Debug logging to understand the structure
      console.log('Response data:', responseData);
      
      // Check if we have subscriptions directly in responseData
      if (!responseData || !responseData.subscriptions) {
        console.warn('No subscriptions found in response:', responseData);
        return {
          success: true,
          message: 'No subscriptions found',
          data: {
            users: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0
            }
          }
        };
      }
      
      // Transform the subscriptions data to match expected AudienceUser format
      const users = responseData.subscriptions.map((subscription: any) => ({
        id: subscription.user.id,
        name: subscription.user.name,
        phone_number: subscription.user.phone_number,
        country_code: subscription.user.country_code,
        created_at: subscription.user.created_at,
        updated_at: subscription.user.updated_at,
        subscriptions: [{
          id: subscription.id,
          status: subscription.status,
          subscribed_at: subscription.subscribed_at,
          unsubscribed_at: subscription.unsubscribed_at,
          brand: subscription.brand,
          agent: subscription.agent
        }],
        _count: {
          messages: 0 // You might want to add this to your backend response
        }
      }));

      const transformedResponse: ApiResponse<AudienceResponse> = {
        success: true,
        message: 'Subscriptions retrieved successfully',
        data: {
          users: users,
          pagination: {
            page: responseData.page,
            limit: responseData.limit,
            total: responseData.total,
            totalPages: Math.ceil(responseData.total / responseData.limit)
          }
        }
      };

      return transformedResponse;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async deleteUser(userId: string, token: string): Promise<ApiResponse<null>> {
    try {
      const response = await deleteRequest<any>(
        `${this.baseUrl}/${userId}`,
        {},
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      );
      
      // Extract the actual data from the axios response
      const responseData = response.data || response;
      return responseData as ApiResponse<null>;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async unsubscribeUser(
    brandId: string,
    agentId: string,
    userId: string,
    token: string
  ): Promise<ApiResponse<any>> {
    try {
      const response = await postRequest<any>(
        `${this.baseUrl}/${userId}/unsubscribe`,
        {},
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      );
      
      // Extract the actual data from the axios response
      const responseData = response.data || response;
      return responseData as ApiResponse<any>;
    } catch (error) {
      console.error('Error unsubscribing user:', error);
      throw error;
    }
  },

  async exportUsers(
    brandId: string,
    agentId: string,
    format: 'csv' | 'xlsx' = 'csv',
    token: string
  ): Promise<Blob> {
    try {
      const response = await getRequest<any>(
        `${this.baseUrl}/brand/${brandId}/agent/${agentId}/export?format=${format}`,
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      );
      
      // For blob responses, we might need to handle differently
      // This depends on how your backend sends the file
      return (response.data || response) as unknown as Blob;
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }
};

interface CustomersContentProps {
  brandId: string;
  agentId: string;
  token: string;
}

const CustomersContent: React.FC<CustomersContentProps> = ({
  brandId,
  agentId,
  token
}) => {
  const [customers, setCustomers] = useState<AudienceUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState<AudienceFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: ''
  });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    subscribedCustomers: 0,
    unsubscribedCustomers: 0,
    totalMessages: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState<AudienceUser | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const importModal = useDisclosure();
  const messageModal = useDisclosure();

  // API functions
  const fetchCustomers = async (currentFilters: AudienceFilters) => {
    setIsLoading(true);
    try {
      const response = await AudienceService.getUsers(brandId, agentId, currentFilters, token);
      if (response.success) {
        setCustomers(response.data.users);
        setPagination(response.data.pagination);
        calculateStats(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Set empty data on error
      setCustomers([]);
      setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      setStats({
        totalCustomers: 0,
        subscribedCustomers: 0,
        unsubscribedCustomers: 0,
        totalMessages: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (customerData: AudienceUser[]) => {
    const totalCustomers = customerData.length;
    const subscribedCustomers = customerData.filter(customer => 
      customer.subscriptions?.some((sub: any) => sub.status === 'subscribed')
    ).length;
    const unsubscribedCustomers = customerData.filter(customer => 
      customer.subscriptions?.some((sub: any) => sub.status === 'unsubscribed')
    ).length;
    const totalMessages = customerData.reduce((sum, customer) => 
      sum + (customer._count?.messages || 0), 0
    );

    setStats({
      totalCustomers,
      subscribedCustomers,
      unsubscribedCustomers,
      totalMessages
    });
  };

  const handleCreateCustomer = async (data: CreateUserData) => {
    setIsCreating(true);
    try {
      const response = await AudienceService.createUser(brandId, agentId, data,token);
      if (response.success) {
        // Refresh customers list
        await fetchCustomers(filters);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm, page: 1 };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...filters, status, page: 1 };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchCustomers(newFilters);
  };

  const handleExport = async () => {
    try {
      const blob = await AudienceService.exportUsers(brandId, agentId, 'csv', token);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers-${brandId}-${agentId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleEditCustomer = async (customer: AudienceUser) => {
    // TODO: Implement edit modal
    console.log('Edit customer:', customer);
  };

  const handleDeleteCustomer = async (customer: AudienceUser) => {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      try {
        await AudienceService.deleteUser(customer.id.toString(), token);
        await fetchCustomers(filters); // Refresh list
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const handleUnsubscribeCustomer = async (customer: AudienceUser) => {
    if (confirm(`Are you sure you want to unsubscribe ${customer.name}?`)) {
      try {
        await AudienceService.unsubscribeUser(brandId, agentId, customer.id.toString(), token);
        await fetchCustomers(filters); // Refresh list
      } catch (error) {
        console.error('Error unsubscribing customer:', error);
      }
    }
  };

  const handleMessageCustomer = async (customer: AudienceUser) => {
    setSelectedCustomer(customer);
    messageModal.onOpen();
  };

  const handleImportComplete = () => {
    fetchCustomers(filters); // Refresh list after import
  };

  const handleMessageSent = () => {
    fetchCustomers(filters); // Refresh list after sending message
  };

  useEffect(() => {
    fetchCustomers(filters);
  }, [brandId, agentId]);

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <CustomerStats
        totalCustomers={stats.totalCustomers}
        subscribedCustomers={stats.subscribedCustomers}
        unsubscribedCustomers={stats.unsubscribedCustomers}
        totalMessages={stats.totalMessages}
        isLoading={isLoading}
      />

      {/* Controls Section */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Search customers by name or phone..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="sm:max-w-sm"
              />
              
              <Select
                placeholder="Filter by status"
                selectedKeys={filters.status ? [filters.status] : []}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleStatusFilter(value || '');
                }}
                startContent={<Filter className="w-4 h-4" />}
                className="sm:max-w-xs"
              >
                {subscriptionStatuses.map((status) => 
                  <SelectItem key={status.key}>
                    {status.label}
                  </SelectItem>
                )}
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="bordered"
                startContent={<Upload className="w-4 h-4" />}
                onPress={importModal.onOpen}
              >
                Import
              </Button>
              <Button
                variant="bordered"
                startContent={<Download className="w-4 h-4" />}
                onPress={handleExport}
              >
                Export
              </Button>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onPress={onOpen}
              >
                Add Customer
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table Section */}
      <Card>
        <CardBody className="p-0">
          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
            onUnsubscribe={handleUnsubscribeCustomer}
            onMessage={handleMessageCustomer}
          />
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            showControls
          />
        </div>
      )}

      {/* Create Customer Modal */}
      <CustomerCreator
        isOpen={isOpen}
        onClose={onClose}
        onCustomerCreate={handleCreateCustomer}
        isLoading={isCreating}
      />

      {/* Import Contacts Modal */}
      <ImportContactsModal
        isOpen={importModal.isOpen}
        onClose={importModal.onClose}
        brandId={brandId}
        agentId={agentId}
        onImportComplete={handleImportComplete}
      />

      {/* Send Message Modal */}
      <SendMessageModal
        isOpen={messageModal.isOpen}
        onClose={messageModal.onClose}
        customer={selectedCustomer}
        brandId={brandId}
        agentId={agentId}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default CustomersContent;
