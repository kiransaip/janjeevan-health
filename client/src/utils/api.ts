const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = {
    get: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
            console.error('API Error:', data);
            throw { response: { data } };
        }
        return data;
    },
    post: async (endpoint: string, data: unknown) => {
        const token = localStorage.getItem('token');
        console.log(`[API] POST ${endpoint}`, data);
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const text = await res.text();
        let responseData;
        try {
            responseData = JSON.parse(text);
        } catch (e) {
            console.error('[API] Failed to parse JSON:', text.substring(0, 200));
            alert(`Server Error (Not JSON): ${text.substring(0, 100)}...`);
            throw new Error('Invalid JSON response from server');
        }

        console.log(`[API] Response:`, responseData);
        if (!res.ok) {
            console.error(`[API] Error ${res.status} ${res.statusText}:`, responseData);
            if (Object.keys(responseData || {}).length === 0) {
                console.warn('[API] Warning: Server returned empty error object!');
            }
            throw { response: { data: responseData, status: res.status } };
        }
        return responseData;
    },
    put: async (endpoint: string, data: unknown) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const responseData = await res.json();
        if (!res.ok) {
            console.error('API Error:', responseData);
            throw { response: { data: responseData } };
        }
        return responseData;
    },
    delete: async (endpoint: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        const responseData = await res.json();
        if (!res.ok) {
            console.error('API Error:', responseData);
            throw { response: { data: responseData } };
        }
        return responseData;
    }
};
