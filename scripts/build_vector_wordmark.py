import matplotlib.path as mpath
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
import os

font_dir = r'C:\Users\ghula\.gemini\antigravity\brain\25987756-f562-4f05-bd55-7fa2a4452065\fonts'

def get_char_info(text, fp):
    ws = []
    for c in text:
        if c == ' ':
            ws.append(fp.get_size() * 0.35)
        else:
            tp = TextPath((0,0), c, prop=fp)
            bbox = tp.get_extents()
            ws.append(bbox.x1 - bbox.x0)
    return ws

def build_vector_text(text, fp, start_x, y, target_w):
    ws = get_char_info(text, fp)
    n = len(text)
    if n > 1:
        spacing = (target_w - sum(ws)) / (n - 1)
    else:
        spacing = 0
        
    commands = []
    curr_x = start_x
    for i, c in enumerate(text):
        if c != ' ':
            tp = TextPath((0, 0), c, prop=fp)
            for verts, code in tp.iter_segments():
                vx = [verts[k] + curr_x for k in range(0, len(verts), 2)]
                vy = [y - verts[k+1] for k in range(0, len(verts), 2)]
                if code == mpath.Path.MOVETO:
                    commands.append(f'M{vx[0]:.2f},{vy[0]:.2f}')
                elif code == mpath.Path.LINETO:
                    commands.append(f'L{vx[0]:.2f},{vy[0]:.2f}')
                elif code == mpath.Path.CURVE3:
                    commands.append(f'Q{vx[0]:.2f},{vy[0]:.2f} {vx[1]:.2f},{vy[1]:.2f}')
                elif code == mpath.Path.CURVE4:
                    commands.append(f'C{vx[0]:.2f},{vy[0]:.2f} {vx[1]:.2f},{vy[1]:.2f} {vx[2]:.2f},{vy[2]:.2f}')
                elif code == mpath.Path.CLOSEPOLY:
                    commands.append('Z')
        curr_x += ws[i] + spacing
    return ' '.join(commands)

target_w = 400.0
pad_x = 24.0
pad_y = 18.0

# SSA
fp_ssa = FontProperties(fname=os.path.join(font_dir, 'Montserrat-Black.ttf'), size=134)
d_ssa = build_vector_text('SSA', fp_ssa, pad_x, pad_y + 102, target_w)

# RESEARCH LAB
fp_res = FontProperties(fname=os.path.join(font_dir, 'Montserrat-ExtraBold.ttf'), size=39)
d_res = build_vector_text('RESEARCH LAB', fp_res, pad_x, pad_y + 142, target_w)

# Line Y
line_y = pad_y + 154

# SUBTITLE
fp_sub = FontProperties(fname=os.path.join(font_dir, 'Montserrat-Bold.ttf'), size=15.5)
d_sub = build_vector_text('SOFTWARE SECURITY ASSESSMENT', fp_sub, pad_x, pad_y + 174, target_w)

total_w = int(target_w + pad_x * 2)
total_h = int(pad_y + 188)

# SVG DARK
svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {total_h}" width="{total_w}" height="{total_h}" fill="none">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#042146"/>
      <stop offset="100%" stop-color="#082e5c"/>
    </linearGradient>
    <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00d2ff"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <filter id="whiteGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur1"/>
      <feGaussianBlur stdDeviation="7" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur2"/>
        <feMergeNode in="blur1"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Luminous White Glow Underlay -->
  <g filter="url(#whiteGlow)" opacity="0.95">
    <path d="{d_ssa}" stroke="#ffffff" stroke-width="12" stroke-linejoin="round" fill="#ffffff"/>
    <path d="{d_res}" stroke="#ffffff" stroke-width="8" stroke-linejoin="round" fill="#ffffff"/>
  </g>

  <!-- Razor Sharp White Keyline Border -->
  <path d="{d_ssa}" stroke="#ffffff" stroke-width="5.5" stroke-linejoin="round" fill="none"/>
  <path d="{d_res}" stroke="#ffffff" stroke-width="3.8" stroke-linejoin="round" fill="none"/>

  <!-- Deep Midnight Navy Fill -->
  <path d="{d_ssa}" fill="url(#navyGrad)"/>
  <path d="{d_res}" fill="url(#navyGrad)"/>

  <!-- Glowing Cyan Divider Line -->
  <line x1="{pad_x}" y1="{line_y}" x2="{pad_x + target_w}" y2="{line_y}" stroke="url(#cyanLine)" stroke-width="2.6" stroke-linecap="round"/>

  <!-- High-Tech Subtitle -->
  <path d="{d_sub}" fill="#38bdf8"/>
</svg>'''

with open('public/academic/ssa-wordmark-dark.svg', 'w', encoding='utf-8') as f:
    f.write(svg_dark)

# SVG LIGHT
svg_light = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {total_h}" width="{total_w}" height="{total_h}" fill="none">
  <defs>
    <linearGradient id="navyLightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#042146"/>
      <stop offset="100%" stop-color="#0a2850"/>
    </linearGradient>
    <linearGradient id="blueLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>

  <!-- Deep Midnight Navy Fill with crisp hairline definition -->
  <path d="{d_ssa}" fill="url(#navyLightGrad)" stroke="#031730" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="{d_res}" fill="url(#navyLightGrad)" stroke="#031730" stroke-width="0.8" stroke-linejoin="round"/>

  <!-- Divider Line -->
  <line x1="{pad_x}" y1="{line_y}" x2="{pad_x + target_w}" y2="{line_y}" stroke="url(#blueLine)" stroke-width="2.4" stroke-linecap="round"/>

  <!-- Subtitle -->
  <path d="{d_sub}" fill="#0369a1"/>
</svg>'''

with open('public/academic/ssa-wordmark-light.svg', 'w', encoding='utf-8') as f:
    f.write(svg_light)

print(f"Vector SVGs successfully generated: {total_w}x{total_h}")
