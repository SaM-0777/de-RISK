import localFont from "next/font/local";

export const delight = localFont({
  src: [
    {
      path: "./_fonts/delight-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./_fonts/delight-extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./_fonts/delight-light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./_fonts/delight-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./_fonts/delight-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./_fonts/delight-semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./_fonts/delight-bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./_fonts/delight-extrabold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./_fonts/delight-black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-delight",
});

