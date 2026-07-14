from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
MASTER_SIZE = 720


def ellipse_mask(box: tuple[int, int, int, int]) -> Image.Image:
    mask = Image.new("L", (MASTER_SIZE, MASTER_SIZE), 0)
    ImageDraw.Draw(mask).ellipse(box, fill=255)
    return mask


def make_master() -> Image.Image:
    size = MASTER_SIZE
    image = Image.new("RGB", (size, size), "#eef0f1")

    background = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(background)
    bg_draw.ellipse((60, 60, 660, 660), fill=(255, 255, 255, 150))
    background = background.filter(ImageFilter.GaussianBlur(90))
    image = Image.alpha_composite(image.convert("RGBA"), background)

    ring = ImageDraw.Draw(image)
    ring.ellipse((106, 106, 614, 614), outline="#d9a0a2", width=5)

    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse((178, 402, 542, 604), fill=(36, 5, 7, 105))
    shadow = shadow.filter(ImageFilter.GaussianBlur(34))
    image = Image.alpha_composite(image, shadow)

    draw = ImageDraw.Draw(image)
    draw.ellipse((174, 350, 546, 566), fill="#4c070a")
    draw.ellipse((174, 324, 546, 518), fill="#78090e")

    cap_box = (184, 216, 536, 456)
    cap_mask = ellipse_mask(cap_box)
    cap = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cap_pixels = cap.load()
    top, bottom = cap_box[1], cap_box[3]
    start = (248, 53, 59)
    end = (184, 9, 18)
    for y in range(top, bottom + 1):
        ratio = (y - top) / (bottom - top)
        color = tuple(round(start[i] * (1 - ratio) + end[i] * ratio) for i in range(3))
        for x in range(cap_box[0], cap_box[2] + 1):
            if cap_mask.getpixel((x, y)):
                cap_pixels[x, y] = (*color, 255)
    image = Image.alpha_composite(image, cap)

    draw = ImageDraw.Draw(image)
    draw.ellipse(cap_box, outline="#920b12", width=10)
    highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(highlight).ellipse((228, 244, 406, 324), fill=(255, 255, 255, 72))
    highlight = highlight.filter(ImageFilter.GaussianBlur(10))
    image = Image.alpha_composite(image, highlight)

    return image.convert("RGB")


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)
    master = make_master()
    resampling = Image.Resampling.LANCZOS
    outputs = {
        "icon-16x16.png": 16,
        "icon-32x32.png": 32,
        "icon-48x48.png": 48,
        "apple-touch-icon.png": 180,
    }
    for filename, size in outputs.items():
        master.resize((size, size), resampling).save(PUBLIC / filename, optimize=True)

    master.save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
    )


if __name__ == "__main__":
    main()
