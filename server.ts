import homepage from "./public/index.html";

Bun.serve({
    routes: {
        "/": homepage,
    },
    development: {
        hmr: true,
    },
    async fetch(req) {
        const url = new URL(req.url); // Parse URL properly

        // CORS headers
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-File-Name",
        };

        if (req.method === "OPTIONS") {
            return new Response(null, { headers });
        }

        // POST /api/upload
        if (url.pathname === "/api/upload" && req.method === "POST") {
            const filename = req.headers.get("X-File-Name");
            if (!filename) return new Response("Missing X-File-Name header", { status: 400, headers });

            console.log(`Receiving stream for ${filename}`);

            if (req.body) {
                const reader = req.body.getReader();
                try {
                    while (true) {
                        const { done } = await reader.read();
                        if (done) break;
                    }
                } catch {
                    console.log(`Upload interrupted for ${filename}`);
                    return new Response("Interrupted", { status: 200, headers });
                }
            }

            return new Response("Upload success", { status: 200, headers });
        }

        // GET /api/stream-markdown - Stream markdown file character by character
        if (url.pathname === "/api/stream-markdown" && req.method === "GET") {
            const delay = parseInt(url.searchParams.get("delay") || "300");

            try {
                const file = Bun.file("./public/sample-response.md");
                const content = await file.text();

                const stream = new ReadableStream({
                    async start(controller) {
                        const encoder = new TextEncoder();
                        let position = 0;

                        while (position < content.length) {
                            // Fixed chunk size of 100 characters
                            const chunkSize = 100;
                            const chunk = content.slice(position, position + chunkSize);
                            controller.enqueue(encoder.encode(chunk));
                            position += chunkSize;
                            await new Promise((resolve) => setTimeout(resolve, delay));
                        }
                        controller.close();
                    },
                });

                return new Response(stream, {
                    headers: {
                        ...headers,
                        "Content-Type": "text/plain; charset=utf-8",
                        "Transfer-Encoding": "chunked",
                        "Cache-Control": "no-cache",
                    },
                });
            } catch (error) {
                return new Response("File not found", { status: 404, headers });
            }
        }

        return new Response("Not Found", { status: 404, headers });
    },
});

console.log("🚀 Server running at http://localhost:3000");
