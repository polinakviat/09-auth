import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { api } from '@/lib/api/api';

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const searchParams = req.nextUrl.searchParams.toString();
    const url = searchParams ? `/notes?${searchParams}` : '/notes';

    const response = await api.get(url, {
      headers: { Cookie: cookieHeader },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Failed to fetch notes' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const body = await req.json();

    const response = await api.post('/notes', body, {
      headers: { Cookie: cookieHeader },
    });

    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Failed to create note' },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}