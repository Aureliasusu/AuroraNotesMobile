/**
 * 这是一个示例文件，展示如何 Mock Supabase 连接
 * 这个文件不会被测试运行，只是作为参考
 */

import { supabase } from '../../src/lib/supabase'

// ============================================
// 方法1: Mock 整个 Supabase 模块
// ============================================
jest.mock('../../src/lib/supabase', () => ({
  supabase: {
    // 数据库查询 (from...select...)
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
    
    // 存储功能
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn(),
        getPublicUrl: jest.fn(),
        remove: jest.fn(),
      }),
    },
  },
}))

// ============================================
// 方法2: 在测试中设置具体的返回值
// ============================================
describe('Example: Mock Supabase Database Query', () => {
  it('should fetch folders from database', async () => {
    // 1. 设置 Mock 返回的数据
    const mockFolders = [
      { id: '1', name: 'Work', user_id: 'user1' },
      { id: '2', name: 'Personal', user_id: 'user1' },
    ]

    // 2. Mock 查询链
    const mockSingle = jest.fn().mockResolvedValue({
      data: mockFolders,
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnValue({
        data: mockFolders,
        error: null,
      }),
    })

    // 3. 执行你的代码（会调用 supabase）
    // const result = await yourFunctionThatUsesSupabase()

    // 4. 验证调用
    expect(supabase.from).toHaveBeenCalledWith('folders')
  })
})

// ============================================
// 方法3: Mock 插入操作
// ============================================
describe('Example: Mock Supabase Insert', () => {
  it('should create a new folder', async () => {
    const newFolder = {
      id: '3',
      name: 'New Folder',
      user_id: 'user1',
    }

    const mockSingle = jest.fn().mockResolvedValue({
      data: newFolder,
      error: null,
    })

    ;(supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: mockSingle,
    })

    // 执行插入操作...
    // 验证...
    expect(supabase.from).toHaveBeenCalledWith('folders')
  })
})

// ============================================
// 方法4: Mock 错误情况
// ============================================
describe('Example: Mock Supabase Error', () => {
  it('should handle database errors', async () => {
    const mockError = { message: 'Database connection failed' }

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      }),
    })

    // 执行代码...
    // 验证错误处理...
  })
})

// ============================================
// 方法5: Mock 实时订阅 (Channel)
// ============================================
describe('Example: Mock Supabase Realtime', () => {
  it('should set up real-time subscription', () => {
    const mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }

    ;(supabase.channel as jest.Mock).mockReturnValue(mockChannel)

    // 执行代码...
    expect(supabase.channel).toHaveBeenCalledWith('notes-changes')
    expect(mockChannel.on).toHaveBeenCalled()
    expect(mockChannel.subscribe).toHaveBeenCalled()
  })
})

