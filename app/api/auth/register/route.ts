import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/lib/api/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post('/auth/login', body);

    const res = NextResponse.json(response.data);
    const setCookie = response.headers['set-cookie'];

    if (setCookie) {
      res.headers.set(
        'set-cookie',
        Array.isArray(setCookie) ? setCookie.join(', ') : setCookie
      );
    }

    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Request failed' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}