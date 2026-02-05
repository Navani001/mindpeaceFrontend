"use client";

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Users, UserCheck, UserX, MessageCircle, TrendingUp, Target, Calendar } from 'lucide-react';

interface CustomerStatsProps {
  totalCustomers: number;
  subscribedCustomers: number;
  unsubscribedCustomers: number;
  totalMessages: number;
  isLoading?: boolean;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({
  totalCustomers,
  subscribedCustomers,
  unsubscribedCustomers,
  totalMessages,
  isLoading = false
}) => {
  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Subscribed',
      value: subscribedCustomers,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-green-200',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Unsubscribed',
      value: unsubscribedCustomers,
      icon: UserX,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      change: '-3%',
      changeType: 'negative'
    },
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      change: '+24%',
      changeType: 'positive'
    },
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getSubscriptionRate = () => {
    if (totalCustomers === 0) return 0;
    return ((subscribedCustomers / totalCustomers) * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse border border-gray-100">
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-10"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse border border-gray-100">
              <CardBody className="p-6">
                <div className="text-center">
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-3"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border ${stat.borderColor} bg-white`}
            >
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
                      <Icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNumber(stat.value)}
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'text-green-700 bg-green-100' 
                      : 'text-red-700 bg-red-100'
                  }`}>
                    <TrendingUp className={`w-3 h-3 mr-1 ${
                      stat.changeType === 'negative' ? 'rotate-180' : ''
                    }`} />
                    {stat.change}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardBody className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-200 rounded-full mb-4">
              <Target className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="text-sm font-medium text-green-800 mb-2">Subscription Rate</h3>
            <p className="text-3xl font-bold text-green-900 mb-1">
              {getSubscriptionRate()}%
            </p>
            <p className="text-xs text-green-700">
              {subscribedCustomers} of {totalCustomers} customers
            </p>
          </CardBody>
        </Card>

        <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardBody className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full mb-4">
              <MessageCircle className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-sm font-medium text-blue-800 mb-2">Avg. Messages per Customer</h3>
            <p className="text-3xl font-bold text-blue-900 mb-1">
              {totalCustomers > 0 ? (totalMessages / totalCustomers).toFixed(1) : '0'}
            </p>
            <p className="text-xs text-blue-700">
              Total engagement metric
            </p>
          </CardBody>
        </Card>

        <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardBody className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full mb-4">
              <Calendar className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="text-sm font-medium text-purple-800 mb-2">Active Customers</h3>
            <p className="text-3xl font-bold text-purple-900 mb-1">
              {formatNumber(subscribedCustomers)}
            </p>
            <p className="text-xs text-purple-700">
              Currently subscribed
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CustomerStats;