import homepage from './public/index.html'

Bun.serve({
  routes: {
    '/': homepage,
  },
  development: {
    hmr: false,
  },
  async fetch(req) {
    const url = new URL(req.url) // Parse URL properly

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-File-Name',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    // POST /api/upload
    if (url.pathname === '/api/upload' && req.method === 'POST') {
      const filename = req.headers.get('X-File-Name')
      if (!filename) return new Response('Missing X-File-Name header', { status: 400, headers })

      console.log(`Receiving stream for ${filename}`)

      if (req.body) {
        const reader = req.body.getReader()
        try {
          while (true) {
            const { done } = await reader.read()
            if (done) break
          }
        } catch {
          console.log(`Upload interrupted for ${filename}`)
          return new Response('Interrupted', { status: 200, headers })
        }
      }

      return new Response('Upload success', { status: 200, headers })
    }

    // GET /api/stream-markdown - Stream markdown file character by character
    if (url.pathname === '/api/stream-markdown' && req.method === 'GET') {
      const delay = parseInt(url.searchParams.get('delay') || '300')

      try {
        const file = Bun.file('./public/sample-response.md')
        const content = await file.text()

        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder()
            let position = 0

            while (position < content.length) {
              // Fixed chunk size of 100 characters
              const chunkSize = 100
              const chunk = content.slice(position, position + chunkSize)
              controller.enqueue(encoder.encode(chunk))
              position += chunkSize
              await new Promise((resolve) => setTimeout(resolve, delay))
            }
            controller.close()
          },
        })

        return new Response(stream, {
          headers: {
            ...headers,
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache',
          },
        })
      } catch (_error) {
        return new Response('File not found', { status: 404, headers })
      }
    }

    // GET /api/problem/:problemId - Serve problem markdown file
    if (url.pathname.startsWith('/api/problem/') && req.method === 'GET') {
      const problemId = url.pathname.replace('/api/problem/', '')

      // Map problemId to folder path
      const folderMap: Record<string, string> = {
        toast: 'toast',
        checkbox: 'nested-checkboxes',
        accordion: 'accordion',
        tabs: 'tabs',
        tooltip: 'tooltip',
        table: 'table',
        markdown: 'markdown',
        squareGame: 'square-game',
        progressBar: 'progress-bar',
        uploadComponent: 'upload-component',
        infiniteCanvas: 'infinite-canvas',
        gallery: 'gallery',
        gptChat: 'gpt-chat',
        heatmap: 'heatmap',
        heatmapCanvas: 'heatmap-canvas',
        redditThread: 'reddit-thread',
        starRating: 'star-rating',
        videoPlayer: 'video-player',
      }

      const folder = folderMap[problemId]
      if (!folder) {
        return new Response('Problem not found', { status: 404, headers })
      }

      try {
        const file = Bun.file(`./src/done/${folder}/problem.md`)
        const content = await file.text()
        return new Response(content, {
          headers: {
            ...headers,
            'Content-Type': 'text/plain; charset=utf-8',
          },
        })
      } catch {
        return new Response('Problem file not found', { status: 404, headers })
      }
    }

    // GET /api/typeahead - Search typeahead entries
    if (url.pathname === '/api/typeahead' && req.method === 'GET') {
      const query = url.searchParams.get('query') || ''
      const limit = parseInt(url.searchParams.get('limit') || '10')

      // Simulate 2s delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      try {
        const file = Bun.file('./src/problems/components/13-typeahead/data.json')
        // TODO: caching strategy for production, but for now file read is fine
        const text = await file.text()
        const data = JSON.parse(text) as Array<{ query: string; id: string; value: string }>

        const filtered = data
          .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
          .slice(0, limit)

        return new Response(JSON.stringify(filtered), {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        })
      } catch (e) {
        console.error(e)
        return new Response('Error processing request', { status: 500, headers })
      }
    }

    return new Response('Not Found', { status: 404, headers })
  },
})

console.log('🚀 Server running at http://localhost:3000')
