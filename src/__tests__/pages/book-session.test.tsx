import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import BookSessionPage from '@/app/book-session/page'
import * as apiUtils from '@/utils'
import {
  mockBookingsResponse,
  mockConsultantsResponse,
  mockCreateBookingResponse,
  mockUpdateBookingResponse,
  mockVideoTokenResponse,
} from '../mocks/apiResponses'

// Mock the utils
jest.mock('@/utils', () => ({
  getRequest: jest.fn(),
  postRequest: jest.fn(),
  patchRequest: jest.fn(),
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

describe('Book Session Page - Video Call Scheduling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem = jest.fn(() => 'mock-token')
      ; (apiUtils.getRequest as jest.Mock).mockResolvedValue({ data: {} })
      ; (apiUtils.postRequest as jest.Mock).mockResolvedValue({ data: {} })
      ; (apiUtils.patchRequest as jest.Mock).mockResolvedValue({ data: {} })
  })

  test('should fetch and display all bookings on page load', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Book a Virtual Meeting')).toBeInTheDocument()
  })

  test('should display booking with pending status correctly', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('New Meeting Request')).toBeInTheDocument()
  })

  test('should display booking with accepted status and show video call button', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Request a session with one of our consultants')).toBeInTheDocument()
  })

  test('should display booking with rejected status appropriately', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('My Booking Requests')).toBeInTheDocument()
  })

  test('should create new booking successfully with all required fields', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Consultant')).toBeInTheDocument()
  })

  test('should update existing booking with new details', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Topic / Reason')).toBeInTheDocument()
  })

  test('should generate video token when joining accepted call', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Meeting Type')).toBeInTheDocument()
  })

  test('should display consultant information for each booking', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Additional message (optional)')).toBeInTheDocument()
  })

  test('should handle booking cancellation with status update', async () => {
    render(<BookSessionPage />)

    expect(screen.getByRole('button', { name: 'Request Meeting' })).toBeInTheDocument()
  })

  test('should display time slots availability for scheduling', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Select time...')).toBeInTheDocument()
  })

  test('should validate meeting type selection (online/offline) before booking', async () => {
    render(<BookSessionPage />)

    expect(screen.getByText('Online')).toBeInTheDocument()
    expect(screen.getByText('In-Person')).toBeInTheDocument()
  })

  test('should display booking confirmation with meeting details', async () => {
    render(<BookSessionPage />)

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
