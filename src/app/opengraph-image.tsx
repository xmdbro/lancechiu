import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  FaGithub,
  FaInstagram,
  FaLastfm,
  FaLinkedinIn,
} from "react-icons/fa6";
import { createRainFrame } from "@/lib/ascii-rain";

export const alt = "Lance Chiu — portfolio and writing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const rainFrame = createRainFrame({
  columns: 27,
  rows: 28,
  time: 2.75,
});
const libreBaskervilleRegular = await readFile(
  join(process.cwd(), "assets/fonts/LibreBaskerville-Regular.ttf"),
);
const libreBaskervilleBold = await readFile(
  join(process.cwd(), "assets/fonts/LibreBaskerville-Bold.ttf"),
);

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 35% 44%, #ffffff 0%, #f3f1eb 52%, #f3f1eb 100%)",
          color: "#171715",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -25,
            right: -50,
            display: "flex",
            width: 480,
            height: 710,
            overflow: "hidden",
          }}
        >
          {rainFrame.map((cell) => (
            <span
              key={`${cell.column}-${cell.row}`}
              style={{
                position: "absolute",
                top: cell.row * 22.1,
                left: cell.column * 17.2,
                display: "flex",
                color: cell.isHead ? "#171715" : "#3b3a36",
                fontFamily: "monospace",
                fontSize: 14,
                lineHeight: 1,
                opacity: cell.alpha * 0.68,
              }}
            >
              {cell.character}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 760,
            marginLeft: 150,
            marginTop: -12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Libre Baskerville",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -3.5,
              lineHeight: 0.95,
            }}
          >
            Lance Chiu
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 18,
              fontFamily: "Libre Baskerville",
              fontSize: 29,
              lineHeight: 1.2,
            }}
          >
            hi@lancechiu.com
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 48,
              fontFamily: "Libre Baskerville",
              fontSize: 26,
            }}
          >
            <span>Portfolio</span>
            <span style={{ margin: "0 18px", color: "#77766f" }}>/</span>
            <span>Resume</span>
            <span style={{ margin: "0 18px", color: "#77766f" }}>/</span>
            <span>Writing</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 30,
              color: "#77766f",
              gap: 22,
            }}
          >
            <FaLinkedinIn aria-hidden="true" size={23} />
            <FaGithub aria-hidden="true" size={23} />
            <FaInstagram aria-hidden="true" size={23} />
            <FaLastfm aria-hidden="true" size={23} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 54,
            bottom: 38,
            display: "flex",
            color: "#77766f",
            fontFamily: "sans-serif",
            fontSize: 12,
            letterSpacing: 2.2,
            textTransform: "uppercase",
          }}
        >
          lancechiu.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Libre Baskerville",
          data: libreBaskervilleRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Libre Baskerville",
          data: libreBaskervilleBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
