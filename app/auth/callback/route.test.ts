import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from './route'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Mock } from 'vitest'


vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url: string) => ({ url, status: 302 })),
  },
}))

describe('Auth Callback Route', () => {
  const origin = 'http://localhost:3000'

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
  })

  it('debería redirigir a la Home si el intercambio de código es exitoso', async () => {
    const code = 'test-code'
    const request = new Request(`${origin}/auth/callback?code=${code}`)

    
    const mockCookieStore = { 
      getAll: vi.fn(), 
      set: vi.fn() 
    }
    ;(cookies as Mock).mockReturnValue(Promise.resolve(mockCookieStore))

    const mockExchangeCode = vi.fn().mockResolvedValue({ error: null })
    ;(createServerClient as Mock).mockReturnValue({
      auth: { exchangeCodeForSession: mockExchangeCode },
    })

    // Eliminamos 'const response =' porque no se usa
    await GET(request)

    expect(mockExchangeCode).toHaveBeenCalledWith(code)
    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/`)
  })

  it('debería redirigir a error si no hay código en la URL', async () => {
    const request = new Request(`${origin}/auth/callback`)

    await GET(request)

    expect(NextResponse.redirect).toHaveBeenCalledWith(`${origin}/auth/auth-code-error`)
  })
})