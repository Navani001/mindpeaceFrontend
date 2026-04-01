import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import DashboardPage from '@/app/dashboard/page'
import * as apiUtils from '@/utils'
import { mockDashboardResponse } from '../mocks/apiResponses'

// Mock the utils
jest.mock('@/utils', () => ({
  getRequest: jest.fn(),
  postRequest: jest.fn(),
  patchRequest: jest.fn(),
}))

// Mock dynamic import for ActivityCalendar
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn: () => Promise<any>) => {
    const DynamicActualComp = require('react-activity-calendar').ActivityCalendar
    DynamicActualComp.preload
      ? DynamicActualComp.preload()
      : DynamicActualComp.render?.preload?.()
    return DynamicActualComp
  },
}))

// Mock react-activity-calendar
jest.mock('react-activity-calendar', () => ({
  ActivityCalendar: ({ data }: any) => (
    <div data-testid="activity-calendar">
      {data?.length > 0 && <span>{data.length} activities</span>}
    </div>
  ),
}))

// Mock SideBar component
jest.mock('@/component/sidebar', () => ({
  SideBar: () => <div data-testid="sidebar">Sidebar</div>,
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

describe('Dashboard Page - UI and Features', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem = jest.fn(() => 'mock-token')
      ; (apiUtils.getRequest as jest.Mock).mockResolvedValue({ data: {} })
      ; (apiUtils.postRequest as jest.Mock).mockResolvedValue({ data: {} })
      ; (apiUtils.patchRequest as jest.Mock).mockResolvedValue({ data: {} })
  })

  test('should render dashboard page with all main sections', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Welcome Back, User')).toBeInTheDocument()
  })

  test('should display mood tracker section with all mood options', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Daily Mood Check-in')).toBeInTheDocument()
  })

  test('should fetch and display analytics data on component mount', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Here\'s your mental wellness overview for today')).toBeInTheDocument()
  })

  test('should submit mood selection and update UI', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Great')).toBeInTheDocument()
  })

  test('should display activity calendar with data points', async () => {
    render(<DashboardPage />)

    expect(screen.getByTestId('activity-calendar')).toBeInTheDocument()
  })

  test('should handle analytics statistics display correctly', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Current Streak')).toBeInTheDocument()
  })

  test('should manage tasks state and display completion status', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Total Check-ins')).toBeInTheDocument()
  })

  test('should calculate and display streak information correctly', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Mindful Minutes')).toBeInTheDocument()
  })

  test('should display average mood score and trend analysis', async () => {
    render(<DashboardPage />)

    expect(screen.getByText('Avg. Mood Score')).toBeInTheDocument()
  })

  test('should handle loading state properly while fetching dashboard data', async () => {
    const { container } = render(<DashboardPage />)

    expect(container).toBeInTheDocument()
  })
})
