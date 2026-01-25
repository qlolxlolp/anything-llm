"use client"

import { useEffect, useRef } from "react"

export default function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouse = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext("webgl")
    if (!gl) return

    const vertexSrc = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `
    const fragmentSrc = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float circle(vec2 uv, vec2 p, float r) {
        return smoothstep(r, r - 0.002, distance(uv, p));
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = dot(i, vec2(127.1, 311.7));
        float b = dot(i + vec2(1.0, 0.0), vec2(269.5, 183.3));
        float c = dot(i + vec2(0.0, 1.0), vec2(113.5, 271.9));
        float d = dot(i + vec2(1.0, 1.0), vec2(246.1, 167.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(fract(sin(a) * 43758.5453), fract(sin(b) * 43758.5453), u.x),
                   mix(fract(sin(c) * 43758.5453), fract(sin(d) * 43758.5453), u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.y = 1.0 - uv.y;
        vec2 m = u_mouse;

        float t = u_time * 0.2;
        vec3 base = vec3(0.02, 0.05, 0.10); // nano blue-black
        vec3 accent = vec3(0.15, 0.35, 0.75);

        float field = 0.0;
        for (int i = 0; i < 20; i++) {
          float fi = float(i);
          vec2 p = vec2(
            fract(sin(fi * 12.9898 + t) * 43758.5453),
            fract(sin(fi * 78.233 + t * 1.3) * 24627.3789)
          );
          p += (m - 0.5) * 0.08;
          float r = 0.02 + 0.015 * fract(sin(fi * 5.123 + t * 0.7));
          field += 1.0 - circle(uv, p, r);
        }

        float flow = noise(uv * 3.0 + t * 0.6);
        vec3 col = base + accent * 0.25 * flow + accent * 0.05 * field;

        // soft vignette
        float vig = smoothstep(0.95, 0.4, distance(uv, vec2(0.5)));
        col *= 0.85 + 0.15 * vig;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      return shader
    }
    const vsh = compile(gl.VERTEX_SHADER, vertexSrc)
    const fsh = compile(gl.FRAGMENT_SHADER, fragmentSrc)
    const program = gl.createProgram()!
    gl.attachShader(program, vsh)
    gl.attachShader(program, fsh)
    gl.linkProgram(program)
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()!
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, "a_position")
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uResolution = gl.getUniformLocation(program, "u_resolution")
    const uTime = gl.getUniformLocation(program, "u_time")
    const uMouse = gl.getUniformLocation(program, "u_mouse")

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const loop = (ts: number) => {
      gl.uniform2f(uResolution, canvas.width, canvas.height)
      gl.uniform1f(uTime, ts * 0.001)
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = (e.clientX - rect.left) / rect.width
      mouse.current.y = (e.clientY - rect.top) / rect.height
    }
    canvas.addEventListener("mousemove", onMove)

    return () => {
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
