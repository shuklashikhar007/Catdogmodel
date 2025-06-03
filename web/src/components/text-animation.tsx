import { useEffect, useRef } from "preact/hooks";
import { gsap } from "gsap";

interface Props {
	words: string[]; // what different words to show
	colors: string[]; // different colors for complete row
	rows: number; // number of rows
	words_length: number; // words in each row
	classNames?: string; // extra classnames
}

/**
 *
 * @param words what different words to show
 * @param colors different colors for complete row
 * @param rows number of rows
 * @param words_length words in each row
 * @param classNames extra classnames
 * @description text moving animation, at random direction, random speed
 * @returns
 */
export default function TextAnimation({ colors, rows, words, words_length, classNames }: Props) {
	const rowsRef = useRef<HTMLDivElement[]>([]);

	useEffect(() => {
		rowsRef.current.forEach((row) => {
			const direction = Math.random() > 0.5 ? -1 : 1; // sets random direction to move
			const speed = Math.max(Math.random(), 0.6) * 100; // random speed between 60sec to 100sec per completion

			gsap.to(row, {
				xPercent: direction * -50,
				duration: speed,
				ease: "linear",
				repeat: -1,
				modifiers: {
					xPercent: (x) => parseFloat(x) % 100,
				},
			});
		});
	}, []);

	return (
		<div className={`w-full h-full absolute overflow-hidden flex flex-col justify-center ${classNames}`}>
			{Array.from({ length: rows }).map((_, i) => {
				const word = words[i % 2];
				const color = colors[i % colors.length];

				return (
					<div key={i} className="overflow-hidden whitespace-nowrap w-full">
						<div
							ref={(el) => {
								if (el) rowsRef.current[i] = el;
							}}
							className={`flex text-xs ${color} py-1`}
						>
							<span className="flex-shrink-0 whitespace-nowrap">{Array(words_length).fill(word).join("   •   ")}</span>
							<span className="flex-shrink-0 whitespace-nowrap">{Array(words_length).fill(word).join("   •   ")}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
