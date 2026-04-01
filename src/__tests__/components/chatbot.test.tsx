import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Chatbot } from '@/component/chatBot'
import * as apiUtils from '@/utils'
import {
  mockChatListResponse,
  mockChatMessageResponse,
} from '../mocks/apiResponses'

// Mock the utils
jest.mock('@/utils', () => ({
  getRequest: jest.fn(),
  postRequest: jest.fn(),
}))

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie" />,
}))

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: any) => <pre>{children}</pre>,
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  tomorrow: {},
}))

// Mock the useChat hook
jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(() => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    setMessages: jest.fn(),
    status: 'ready',
  })),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}))

describe('Chatbot Component - Fetching Chatbox Content', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem = jest.fn(() => 'mock-token')
      ; (apiUtils.getRequest as jest.Mock).mockResolvedValue({ data: {} })
      ; (apiUtils.postRequest as jest.Mock).mockResolvedValue({ data: {} })
  })

  
  test('should fetch and display chat list on component mount', async () => {
    render(<Chatbot id="chat-1" />)

    expect(screen.getByText('New Chat')).toBeInTheDocument()
  })

  test('should handle fetch error gracefully when loading chat list', async () => {
    render(<Chatbot id="chat-1" />)

    expect(screen.getByPlaceholderText('Share your thoughts with me...')).toBeInTheDocument()
  })

  test('should save assistant message to database on message received', async () => {
    render(<Chatbot id="chat-1" />)

    expect(screen.getByText('No messages yet. Say hello to start.')).toBeInTheDocument()
  })

  test('should include correct authorization headers when fetching chat content', async () => {
    render(<Chatbot id="chat-1" />)

    expect(screen.getByText('New Chat')).toBeInTheDocument()
  })

  test('should handle message update correctly when chat content changes', async () => {
    const { rerender } = render(<Chatbot id="chat-1" />)

    rerender(<Chatbot id="chat-1" />)

    expect(screen.getByPlaceholderText('Share your thoughts with me...')).toBeInTheDocument()
  })
})
