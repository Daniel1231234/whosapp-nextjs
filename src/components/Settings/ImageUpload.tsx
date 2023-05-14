'use client'

import { useCallback, useState } from "react";
import {
  useDropzone,
  DropzoneRootProps,
  DropzoneInputProps,
} from "react-dropzone";
import Button from "../UI/Button";
import { PhoneOutgoingIcon } from "lucide-react";

const ImageUploader = () => {
  const [isPending, setIsPending] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const uploadImage = async (image: File) => {
    setError(false);
    setIsPending(true);
    const formData = new FormData();
    formData.append("image", image);
    console.log(formData);
    // try {
    //   const res = await fetch("/api/upload", {
    //     method: "POST",
    //     body: formData,
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   if (!res.ok) {
    //     throw Error("Internal Server Error");
    //   }
    //   const data = await res.json();
    //   setUrl(data.path);
    //   setIsPending(false);
    // } catch (error) {
    //   console.log(error);
    //   setIsPending(false);
    //   setError(true);
    // }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      let file = acceptedFiles[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImage(reader.result);
          uploadImage(file);
        }
      };
    },
    [setImage, uploadImage]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
      "text/html": [".html", ".htm"],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="col-span-full">
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
      >
        Photo
      </label>
      <div
        {...getRootProps({
          className:
            "mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-50 px-6 py-10",
        })}
      >
        <div className="text-center">
          <PhoneOutgoingIcon
            className="mx-auto h-12 w-12 text-gray-300"
            aria-hidden="true"
          />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="image"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span className="py-4 px-1">Upload a file</span>
              <input
                {...getInputProps({ name: "image", id: "image" })}
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
