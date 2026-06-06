import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

// Image generation
export default async function Icon() {
  const avatarUrl = "https://avatars.githubusercontent.com/u/149287500?s=64";

  return new ImageResponse(
    (
      <img
        src={avatarUrl}
        width="64"
        height="64"
        alt="Favicon"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          margin: 0,
          padding: 0,
        }}
      />
    ),
    {
      ...size,
    }
  );
}
