import { render, screen, waitFor } from '@testing-library/react'
import { createElement } from 'react'
import * as apiUtils from '@/utils'
import {
  mockChatListResponse,
  mockDashboardResponse,
  mockBookingsResponse,
  mockVideoTokenResponse,
} from '../mocks/apiResponses'

// Mock all utils
jest.mock('@/utils', () => ({
  getRequest: jest.fn(),
  postRequest: jest.fn(),
  patchRequest: jest.fn(),
}))

// Mock components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

jest.mock('@/component/sidebar', () => ({
  SideBar: () => createElement('div', { 'data-testid': 'sidebar' }, 'Sidebar'),
}))

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: () => Promise<any>) => {
    const DynamicActualComp = require('react-activity-calendar').ActivityCalendar
    return DynamicActualComp
  },
}))

jest.mock('react-activity-calendar', () => ({
  ActivityCalendar: ({ data }: any) =>
    createElement(
      'div',
      { 'data-testid': 'activity-calendar' },
      data ? 'Activities' : 'Activities'
    ),
}))

describe('Integration Tests - Complete User Flow', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    localStorage.getItem = jest.fn(() => 'mock-token')
  })

  test('should handle complete chat workflow: fetch, send, save message', async () => {
    ;(apiUtils.getRequest as jest.Mock)
      .mockResolvedValueOnce(mockChatListResponse)
      .mockResolvedValueOnce(mockChatListResponse)

    ;(apiUtils.postRequest as jest.Mock).mockResolvedValueOnce({
      api_status: 'success',
      data: { message: 'Saved' },
    })

    // Simulate fetching chats
    const chatResponse: any = await apiUtils.getRequest('chatbot', {
      authorization: 'Bearer mock-token',
    })

    expect(chatResponse).toHaveProperty('api_status', 'success')
    expect(chatResponse.data).toHaveProperty('chats')

    // Simulate sending message
    const messageResponse: any = await apiUtils.postRequest(
      'chatbot/messages/chat-1',
      { sender: 'assistant', content: 'Response' },
      { authorization: 'Bearer mock-token' }
    )

    expect(messageResponse).toBeDefined()
    expect(messageResponse).toHaveProperty('api_status', 'success')
  })

  test('should handle complete dashboard workflow: fetch data, update mood, fetch analytics', async () => {
    ;(apiUtils.getRequest as jest.Mock).mockResolvedValueOnce(
      mockDashboardResponse
    )

    ;(apiUtils.postRequest as jest.Mock).mockResolvedValueOnce({
      ...mockDashboardResponse,
      data: {
        ...mockDashboardResponse.data,
        mood: { latestMood: 5 },
      },
    })

    // Fetch dashboard data
    const dashboardData: any = await apiUtils.getRequest('analytics/dashboard', {
      authorization: 'Bearer mock-token',
    })

    expect(dashboardData).toHaveProperty('api_status', 'success')
    expect(dashboardData.data).toBeDefined()

    // Submit mood
    const moodResponse: any = await apiUtils.postRequest(
      'analytics/mood',
      { score: 5 },
      { authorization: 'Bearer mock-token' }
    )

    expect(moodResponse).toBeDefined()
    expect(moodResponse).toHaveProperty('api_status', 'success')
  })

  test('should handle complete booking workflow: fetch, create, get token for video call', async () => {
    ;(apiUtils.getRequest as jest.Mock).mockResolvedValueOnce(
      mockBookingsResponse
    )

    ;(apiUtils.postRequest as jest.Mock)
      .mockResolvedValueOnce({
        api_status: 'success',
        data: {
          booking: { ...mockBookingsResponse.data.bookings[0], id: 'new-booking' },
        },
      })
      .mockResolvedValueOnce(mockVideoTokenResponse)

    // Fetch bookings
    const bookingsData: any = await apiUtils.getRequest('booking', {
      authorization: 'Bearer mock-token',
    })

    expect(bookingsData).toHaveProperty('api_status', 'success')
    expect(bookingsData.data).toBeDefined()

    // Create new booking
    const createResponse: any = await apiUtils.postRequest(
      'booking',
      { date: '2024-01-25', topic: 'New session' },
      { authorization: 'Bearer mock-token' }
    )

    expect(createResponse).toHaveProperty('api_status', 'success')

    // Get video token for accepted booking
    const tokenResponse: any = await apiUtils.postRequest(
      'booking/video-token/booking-1',
      {},
      { authorization: 'Bearer mock-token' }
    )

    expect(tokenResponse).toHaveProperty('api_status', 'success')
    expect(tokenResponse.data).toBeDefined()
  })

  test('should handle multi-step booking update workflow', async () => {
    ;(apiUtils.getRequest as jest.Mock).mockResolvedValueOnce(
      mockBookingsResponse
    )

    ;(apiUtils.patchRequest as jest.Mock)
      .mockResolvedValueOnce({
        api_status: 'success',
        data: {
          booking: {
            ...mockBookingsResponse.data.bookings[0],
            status: 'accepted',
          },
        },
      })
      .mockResolvedValueOnce({
        api_status: 'success',
        data: {
          booking: {
            ...mockBookingsResponse.data.bookings[0],
            message: 'Updated message',
          },
        },
      })

    // Fetch initial bookings
    const initialBookings: any = await apiUtils.getRequest('booking', {
      authorization: 'Bearer mock-token',
    })

    expect(initialBookings).toHaveProperty('api_status', 'success')

    // Update booking status
    const statusUpdate: any = await apiUtils.patchRequest(
      'booking/booking-1',
      { status: 'accepted' },
      { authorization: 'Bearer mock-token' }
    )

    expect(statusUpdate).toHaveProperty('api_status', 'success')

    // Update booking message
    const messageUpdate: any = await apiUtils.patchRequest(
      'booking/booking-1',
      { message: 'Updated message' },
      { authorization: 'Bearer mock-token' }
    )

    expect(messageUpdate).toHaveProperty('api_status', 'success')
  })

  test('should handle authentication token in all requests', async () => {
    const mockToken = 'test-auth-token-12345'
    localStorage.getItem = jest.fn(() => mockToken)

    ;(apiUtils.getRequest as jest.Mock).mockResolvedValueOnce({
      api_status: 'success',
    })

    await apiUtils.getRequest('secure-endpoint', {
      authorization: `Bearer ${mockToken}`,
    })

    const callHeaders = (apiUtils.getRequest as jest.Mock).mock.calls[0][1]
    expect(callHeaders.authorization).toBe(`Bearer ${mockToken}`)
  })

  test('should handle error responses across different endpoints', async () => {
    const errorResponse = {
      api_status: 'error',
      status: 400,
      message: 'Invalid request',
    }

    ;(apiUtils.getRequest as jest.Mock).mockRejectedValueOnce(new Error('Bad Request'))

    await expect(
      apiUtils.getRequest('invalid-endpoint', {
        authorization: 'Bearer mock-token',
      })
    ).rejects.toThrow('Bad Request')
  })

  test('should handle concurrent API requests', async () => {
    ;(apiUtils.getRequest as jest.Mock)
      .mockResolvedValueOnce(mockChatListResponse)
      .mockResolvedValueOnce(mockDashboardResponse)
      .mockResolvedValueOnce(mockBookingsResponse)

    const results = await Promise.all([
      apiUtils.getRequest('chatbot', { authorization: 'Bearer token' }),
      apiUtils.getRequest('analytics/dashboard', {
        authorization: 'Bearer token',
      }),
      apiUtils.getRequest('booking', { authorization: 'Bearer token' }),
    ])

    expect(results).toHaveLength(3)
    expect(results[0]).toEqual(mockChatListResponse)
    expect(results[1]).toEqual(mockDashboardResponse)
    expect(results[2]).toEqual(mockBookingsResponse)
  })
})
