
import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];

function processImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 640;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Unable to process image.");

        const cropSize = Math.min(img.width, img.height);
        const x = (img.width - cropSize) / 2;
        const y = (img.height - cropSize) / 2;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        ctx.drawImage(
          img,
          x,
          y,
          cropSize,
          cropSize,
          0,
          0,
          size,
          size
        );

        resolve(canvas.toDataURL("image/jpeg", 0.78));
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to open this image."));
    };

    img.src = url;
  });
}

export default function ImageUpload({
  value,
  onChange,
  label = "Pet Photo",
  required = false,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setProcessing(true);

    try {
      const image = await processImage(file);
      onChange(image);
    } catch {
      setError("Unable to process this image. Try another photo.");
    } finally {
      setProcessing(false);
      event.target.value = "";
    }
  };

  const removeImage = () => {
    onChange("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="form-field">
      <label>{label}</label>

      <div className="pet-upload">
        {value ? (
          <div className="pet-upload-preview">
            <img src={value} alt="Selected pet" />

            <button
              type="button"
              className="pet-upload-remove"
              onClick={removeImage}
              aria-label="Remove photo"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="pet-upload-empty">
            <ImagePlus size={32} />
            <p>No photo selected</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFile}
          style={{ display: "none" }}
          aria-label={label}
        />

        <button
          type="button"
          className="button button-outline button-sm"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={17} />
          {processing
            ? "Processing..."
            : value
              ? "Change Photo"
              : "Choose Photo"}
        </button>

        <small>One image only · JPG, PNG or WebP · Max 5 MB</small>

        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}

        {required && !value && (
          <small>Please select a pet photo before submitting.</small>
        )}
      </div>
    </div>
  );
}
