"use client"
import React from 'react';

function Page() {
    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <iframe
                src="/resume.pdf"
                width="100%"
                height="100%"
                title="PDF Viewer"
                style={{ border: 'none' }}
            />
        </div>
    );
}

export default Page;