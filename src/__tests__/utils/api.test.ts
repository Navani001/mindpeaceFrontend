jest.mock('@/utils', () => ({
  getRequest: jest.fn(),
  postRequest: jest.fn(),
  patchRequest: jest.fn(),
  deleteRequest: jest.fn(),
}))

import * as apiUtils from '@/utils'

describe('API Utilities - Request Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem = jest.fn(() => 'mock-token')
  })

  test('should make GET request with correct headers', async () => {
    ;(apiUtils.getRequest as jest.Mock).mockResolvedValueOnce({
      api_status: 'success',
      data: { message: 'Success' },
    })

    const result = await apiUtils.getRequest('test-endpoint', {
      authorization: 'Bearer token',
    })

    expect(apiUtils.getRequest).toHaveBeenCalledWith('test-endpoint', {
      authorization: 'Bearer token',
    })
  })

  test('should make POST request with payload and headers', async () => {
    ;(apiUtils.postRequest as jest.Mock).mockResolvedValueOnce({
      api_status: 'success',
      data: { id: 'new-id' },
    })

    const result = await apiUtils.postRequest(
      'test-endpoint',
      { name: 'Test' },
      { authorization: 'Bearer token' }
    )

    expect(apiUtils.postRequest).toHaveBeenCalledWith(
      'test-endpoint',
      { name: 'Test' },
      { authorization: 'Bearer token' }
    )
  })

  test('should make PATCH request for updating data', async () => {
    ;(apiUtils.patchRequest as jest.Mock).mockResolvedValueOnce({
      api_status: 'success',
      data: { id: 'updated-id' },
    })

    const result = await apiUtils.patchRequest(
      'test-endpoint/1',
      { status: 'updated' },
      { authorization: 'Bearer token' }
    )

    expect(apiUtils.patchRequest).toHaveBeenCalledWith(
      'test-endpoint/1',
      { status: 'updated' },
      { authorization: 'Bearer token' }
    )
  })

  test('should handle API errors appropriately', async () => {
    ;(apiUtils.getRequest as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error')
    )

    try {
      await apiUtils.getRequest('failing-endpoint')
    } catch (error: any) {
      expect(error.message).toBe('Network Error')
    }
  })
})
