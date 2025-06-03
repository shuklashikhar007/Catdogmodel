import classNames from "classnames";

/**
 * 
 * @param color color of the bar 
 * @description creates rows of bar, at some angle
 */
export default function Bar({ color }: { color: boolean }) {
	return (
		<div className="w-56 absolute -rotate-12 flex flex-col justify-center items-center gap-1 -z-10">
			{Array.from({ length: 12 }).map(() => (
				<div className={classNames("w-full h-1", color ? "bg-green-300" : "bg-red-300")} />
			))}
		</div>
	);
}
