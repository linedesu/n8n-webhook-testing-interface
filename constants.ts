
import { HTTPMethod } from './types';

export const HTTP_METHODS: HTTPMethod[] = ['POST', 'GET', 'PUT', 'DELETE'];

export const SAMPLE_PAYLOADS: { name: string; data: string }[] = [
    {
        name: 'Simple JSON',
        data: JSON.stringify({
            "message": "Webhook received!",
            "timestamp": new Date().toISOString()
        })
    },
    {
        name: 'Customer Data',
        data: JSON.stringify({
            "customer": {
                "id": 12345,
                "name": "Jane Doe",
                "email": "jane.doe@example.com",
                "plan": "premium"
            },
            "event": "subscription_updated"
        })
    },
    {
        name: 'GitHub Webhook (Push)',
        data: JSON.stringify({
            "ref": "refs/heads/main",
            "repository": {
                "name": "n8n-workflows",
                "full_name": "example-user/n8n-workflows"
            },
            "pusher": {
                "name": "example-user",
                "email": "user@example.com"
            },
            "commits": [
                {
                    "id": "a1b2c3d4",
                    "message": "feat: Add new webhook processor",
                    "timestamp": new Date().toISOString()
                }
            ]
        })
    },
];
