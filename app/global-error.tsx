'use client';

import React from 'react';

// global-error.tsx replaces the root layout when an error occurs.
// It must define its own <html> and <body> tags.
// It cannot use any global providers defined in the root layout (like UserProvider).

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <head>
                <title>Something went wrong</title>
            </head>
            <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    padding: '20px',
                    textAlign: 'center',
                    backgroundColor: '#fff',
                    color: '#000'
                }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
                        Something went wrong!
                    </h1>
                    <p style={{ marginBottom: '24px', color: '#666', maxWidth: '500px' }}>
                        We apologize for the inconvenience. An unexpected error occurred.
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 500,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
