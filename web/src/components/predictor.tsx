import classNames from "classnames";
import type { MouseEvent, DragEvent } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";
import Bar from "@/components/bar";
import RotatingCircle from "@/components/rotating-circle";
import UploadCloud from "@/components/upload-cloud";

/**
 * @description container to show, update, predict cat or dog
 */
export default function Predictor() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [predection, setPredection] = useState<{ cat: number; dog: number } | null>(null);

	useEffect(() => {
		/*
		 * dude server do cold start, if it didn't tackle request for long
		 * so it's better to hit before user name any request
		 */
		(async () => await fetch(`${import.meta.env.VITE_API_URL}`))();
	}, []);

	/**
	 * Takes a image, set loading spinner, send to backend, set result
	 * @param file attach image which to be predicted
	 */
	const handleFile = async (file: File) => {
		try {
			setLoading(true);
			setImage(file);

			const formData = new FormData();
			formData.append("image_file", file);

			await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					const cat = parseFloat(data.cat) * 100;
					const dog = parseFloat(data.dog) * 100;

					setPredection({ cat, dog });
				});
		} catch (error) {
			alert((error as Error).message);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Handle new files update, triggered from either drag and drop or click
	 */
	const handleFileChangeDragOrClick = (event: MouseEvent<HTMLDivElement> | DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		if ("dataTransfer" in event && event.dataTransfer?.files?.length) handleFile(event.dataTransfer.files[0]);
		else inputRef.current?.click();
	};

	/**
	 * Handle new files update, triggered from click on input box, after image loaded
	 */
	const handleFileChangeInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) handleFile(file);
	};

	return (
		<div className="w-full flex-1 flex flex-col justify-center items-center max-w-xs sm:max-w-md relative z-30 bg-gray-100 rounded-2xl">
			{/* Image File, and Name (top section) */}
			<div
				className={classNames(
					"w-11/12 h-8 flex justify-start items-center border border-b-0 border-gray-300 border-dashed rounded-t-lg overflow-hidden cursor-pointer duration-300",
					image ? "translate-y-0 mt-4" : "translate-y-6"
				)}
				onClick={handleFileChangeDragOrClick}
			>
				<div className="h-full w-24 bg-gray-200 flex justify-center items-center text-xs">Choose File</div>
				<div className="h-full flex-1 flex justify-start items-center text-xs px-4">{image?.name}</div>
			</div>

			{/* Image Preview (middle section) */}
			<div
				className={classNames(
					"flex flex-col items-center justify-center z-20 bg-gray-100 w-full aspect-video border-2 border-gray-300 border-dashed rounded-lg hover:shadow duration-300 active:shadow-none overflow-hidden",
					!image && "cursor-pointer"
				)}
			>
				{image ? (
					<div className="flex flex-col items-center justify-center w-full h-full">
						<img src={URL.createObjectURL(image)} alt="image" className="object-scale-down h-full w-full" />
					</div>
				) : (
					<div
						className="flex flex-col items-center justify-center w-full h-full"
						onClick={handleFileChangeDragOrClick}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleFileChangeDragOrClick}
					>
						<UploadCloud />
						<p class="mb-2 text-sm sm:text-sbase text-gray-500 uppercase">
							<span class="sm:text-sm uppercase font-anonymous-bold">Click to upload</span> or drag and drop
						</p>
						<p class="text-xs text-gray-500 uppercase">PNG, JPG, JPEG, ETC (MAX. 5MB)</p>
					</div>
				)}
				<input ref={inputRef} type="file" accept="image/*" class="hidden" onChange={handleFileChangeInput} />
			</div>

			{/* Predection (lower section) */}
			<div
				onClick={handleFileChangeDragOrClick}
				className={classNames(
					"w-11/12 h-10 flex justify-start items-center border border-t-0 border-gray-300 border-dashed rounded-b-lg overflow-hidden cursor-pointer duration-300",
					loading || predection ? "translate-y-0 mb-4" : "-translate-y-8"
				)}
			>
				{!loading && predection && (
					<div className="h-full w-1/2 relative flex justify-center items-center text-xs sm:text-sm font-bold overflow-hidden border-r border-gray-300 border-dashed">
						<Bar color={predection.cat > 50} />
						Cat: {predection.cat}%
					</div>
				)}

				{!loading && predection && (
					<div className="h-full w-1/2 relative flex justify-center items-center text-xs sm:text-sm font-bold overflow-hidden">
						<Bar color={predection.dog > 50} />
						Dog: {predection.dog}%
					</div>
				)}

				{/* loading spinner, with request in progress */}
				{loading && (
					<div class="w-full h-full flex justify-center items-center text-xs">
						<RotatingCircle />
						Loading...
					</div>
				)}
			</div>
		</div>
	);
}
