import classNames from "classnames";
import type { MouseEvent, DragEvent } from "preact/compat";
import { useRef, useState } from "preact/hooks";

export function Home() {
	const inputRef = useRef<HTMLInputElement>(null);
	const [image, setImage] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [predection, setPredection] = useState<{
		cat: number;
		dog: number;
	} | null>(null);

	const handleFile = async (file: File) => {
		try {
			setLoading(true);
			setImage(file);

			const formData = new FormData();
			formData.append("image_file", file);

			await fetch(
				"https://cat-dog-classifier-284261643229.asia-south1.run.app/predict",
				{
					method: "POST",
					body: formData,
				}
			)
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

	const handleSubmit = (
		event: MouseEvent<HTMLDivElement> | DragEvent<HTMLDivElement>
	) => {
		event.preventDefault();

		if ("dataTransfer" in event && event.dataTransfer?.files?.length)
			handleFile(event.dataTransfer.files[0]);
		else inputRef.current?.click();
	};

	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) handleFile(file);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
			<h1 className="text-2xl text-gray-800 underline underline-offset-3">
				Cat Dog Classifier
			</h1>

			<div className="w-full flex-1 flex flex-col justify-center items-center max-w-sm relative">
				<div
					className={classNames(
						"w-11/12 h-8 flex justify-start items-center border border-b-0 border-gray-300 border-dashed rounded-t-lg overflow-hidden cursor-pointer duration-300",
						image ? "translate-y-0" : "translate-y-6"
					)}
					onClick={handleSubmit}
				>
					<div className="h-full w-24 bg-gray-200 flex justify-center items-center text-xs">
						Choose File
					</div>
					<div className="h-full flex-1 flex justify-start items-center text-xs px-4">
						{image?.name}
					</div>
				</div>
				<div
					className={classNames(
						"flex flex-col items-center justify-center z-20 bg-gray-100 w-full aspect-video border-2 border-gray-300 border-dashed rounded-lg hover:shadow duration-300 active:shadow-none overflow-hidden",
						!image && "cursor-pointer"
					)}
				>
					{image ? (
						<div className="flex flex-col items-center justify-center w-full h-full">
							<img
								src={URL.createObjectURL(image)}
								alt="image"
								className="object-contain"
							/>
						</div>
					) : (
						<div
							className="flex flex-col items-center justify-center w-full h-full"
							onClick={handleSubmit}
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleSubmit}
						>
							<svg
								class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 20 16"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
								/>
							</svg>
							<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
								<span class="font-semibold">
									Click to upload
								</span>{" "}
								or drag and drop
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								PNG, JPG, JPEG, ETC (MAX. 5MB)
							</p>
						</div>
					)}
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						class="hidden"
						onChange={handleFileChange}
					/>
				</div>
				<div
					className={classNames(
						"w-11/12 h-10 flex justify-start items-center border border-t-0 border-gray-300 border-dashed rounded-b-lg overflow-hidden cursor-pointer duration-300",
						loading || predection
							? "translate-y-0"
							: "-translate-y-8"
					)}
					onClick={handleSubmit}
				>
					{!loading && (
						<div className="h-full w-1/2 flex justify-center items-center text-xs border-r border-gray-300 border-dashed">
							Cat: {predection?.cat}%
						</div>
					)}
					{!loading && (
						<div className="h-full w-1/2 flex justify-center items-center text-xs">
							Dog: {predection?.dog}%
						</div>
					)}

					{loading && (
						<div class="w-full h-full flex justify-center items-center text-xs">
							<svg
								aria-hidden="true"
								class="w-5 h-5 mr-3 text-gray-200 animate-spin fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							Loading...
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
