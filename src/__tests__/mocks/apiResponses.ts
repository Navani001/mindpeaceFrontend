// Mock data for testing

export const mockChatListResponse = {
  api_status: 'success',
  status: 200,
  message: 'Chats retrieved successfully',
  data: {
    chats: [
      {
        id: 'chat-1',
        title: 'General Discussion',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello, how can I manage my anxiety?',
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'There are several techniques you can try...',
          },
        ],
      },
      {
        id: 'chat-2',
        title: 'Sleep Issues',
        createdAt: '2024-01-14',
        updatedAt: '2024-01-14',
        messages: [],
      },
    ],
  },
}

export const mockLatestChatResponse = {
  api_status: 'success',
  status: 200,
  message: 'Latest chat retrieved',
  data: {
    chat: {
      id: 'chat-1',
      title: 'General Discussion',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
  },
}

export const mockChatMessageResponse = {
  api_status: 'success',
  status: 200,
  message: 'Message saved successfully',
  data: {
    chat: {
      id: 'chat-1',
      title: 'General Discussion',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hello, how can I manage my anxiety?',
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'There are several techniques you can try...',
        },
        {
          id: 'msg-3',
          role: 'assistant',
          content: 'New assistant message',
        },
      ],
    },
  },
}

export const mockDashboardResponse = {
  api_status: 'success',
  status: 200,
  message: 'Dashboard data retrieved',
  data: {
    mood: {
      latestMood: 4,
      history: [
        { date: '2024-01-15', score: 4, label: 'Good' },
        { date: '2024-01-14', score: 3, label: 'Okay' },
        { date: '2024-01-13', score: 5, label: 'Great' },
      ],
    },
    analytics: {
      streak: 5,
      totalCheckIns: 25,
      avgMoodScore: 3.8,
      mindfulMinutes: 150,
    },
    activityData: [
      { date: '2024-01-01', count: 1, level: 1 },
      { date: '2024-01-02', count: 2, level: 2 },
      { date: '2024-01-03', count: 0, level: 0 },
      { date: '2024-01-04', count: 3, level: 3 },
    ],
    tasks: [
      { id: 'task-1', text: 'Morning meditation', completed: true },
      { id: 'task-2', text: 'Evening journaling', completed: false },
      { id: 'task-3', text: 'Read wellness article', completed: true },
    ],
  },
}

export const mockBookingsResponse = {
  api_status: 'success',
  status: 200,
  message: 'Bookings retrieved successfully',
  data: {
    bookings: [
      {
        id: 'booking-1',
        date: '2024-01-20',
        time: '10:00 AM',
        topic: 'Anxiety Management',
        message: 'I have been feeling anxious lately',
        meetingType: 'online',
        status: 'accepted',
        consultant: {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah@example.com',
        },
        consultantNote: 'Session confirmed',
      },
      {
        id: 'booking-2',
        date: '2024-01-22',
        time: '02:00 PM',
        topic: 'Stress Relief',
        message: null,
        meetingType: 'offline',
        status: 'pending',
        consultant: {
          id: 2,
          name: 'Dr. Michael Chen',
          email: 'michael@example.com',
        },
        consultantNote: null,
      },
      {
        id: 'booking-3',
        date: '2024-01-19',
        time: '03:00 PM',
        topic: 'Depression Support',
        message: 'First time consultation',
        meetingType: 'online',
        status: 'rejected',
        consultant: {
          id: 3,
          name: 'Dr. Emma Wilson',
          email: 'emma@example.com',
        },
        consultantNote: 'Time slot not available',
      },
    ],
  },
}

export const mockConsultantsResponse = {
  api_status: 'success',
  status: 200,
  message: 'Consultants retrieved successfully',
  data: {
    consultants: [
      { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@example.com' },
      { id: 2, name: 'Dr. Michael Chen', email: 'michael@example.com' },
      { id: 3, name: 'Dr. Emma Wilson', email: 'emma@example.com' },
    ],
  },
}

export const mockCreateBookingResponse = {
  api_status: 'success',
  status: 201,
  message: 'Booking created successfully',
  data: {
    booking: {
      id: 'booking-new',
      date: '2024-01-25',
      time: '11:00 AM',
      topic: 'New Booking',
      message: 'Test booking',
      meetingType: 'online',
      status: 'pending',
      consultant: {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah@example.com',
      },
      consultantNote: null,
    },
  },
}

export const mockUpdateBookingResponse = {
  api_status: 'success',
  status: 200,
  message: 'Booking updated successfully',
  data: {
    booking: {
      id: 'booking-1',
      date: '2024-01-20',
      time: '11:00 AM',
      topic: 'Anxiety Management (Updated)',
      message: 'Updated message',
      meetingType: 'online',
      status: 'accepted',
      consultant: {
        id: 1,
        name: 'Dr. Sarah Johnson',
        email: 'sarah@example.com',
      },
      consultantNote: 'Session confirmed',
    },
  },
}

export const mockVideoTokenResponse = {
  api_status: 'success',
  status: 200,
  message: 'Video token generated',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    url: 'wss://livekit.example.com',
    roomName: 'room-booking-1',
  },
}
