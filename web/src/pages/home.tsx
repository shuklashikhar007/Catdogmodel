import Predictor from "@/components/predictor";
import { ScrollAnimation } from "@/components/scroll-animation";
import TextAnimation from "@/components/text-animation";

/**
 * words, and colors for text animation
 */
const words = ["cat", "dogs"];
const colors = ["text-pink-300", "text-blue-300", "text-yellow-300", "text-green-300", "text-purple-300", "text-red-300"];

/**
 * @description home page
 */
export default function Home() {
	return (
		<ScrollAnimation>
			<div className="absolute w-full h-full flex items-center justify-center opacity-0">
				<TextAnimation words={words} colors={colors} words_length={100} rows={20} classNames="-z-10" />
				<Predictor />
			</div>
		</ScrollAnimation>
	);
}
