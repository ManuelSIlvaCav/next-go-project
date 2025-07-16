import { Fredoka, Lato } from "next/font/google";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
});

const latto = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "100", "900"],
  variable: "--font-latto",
});

export { fredoka, latto };
