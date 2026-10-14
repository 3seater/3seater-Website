from PIL import Image,ImageDraw
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for kind in ('desktop','mobile'):
 for start in (1,11):
  w,h=(384,216) if kind=='desktop' else (195,422)
  sheet=Image.new('RGB',(5*w,2*(h+30)), '#ddd');draw=ImageDraw.Draw(sheet)
  for j,n in enumerate(range(start,start+10)):
   p=root/f'src/batch-three/captures/{n:02}.png' if kind=='desktop' else root/f'.impeccable/review/batch-three/mobile-{n:02}.png'
   im=Image.open(p).convert('RGB').resize((w,h));x=(j%5)*w;y=(j//5)*(h+30)
   draw.text((x+8,y+8),f'{n:02} {kind}',fill='#111');sheet.paste(im,(x,y+30))
  sheet.save(root/f'.impeccable/review/batch-three/{kind}-sheet-{start}.jpg')
