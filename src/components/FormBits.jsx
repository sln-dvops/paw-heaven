export function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  min,
  options,
  textarea = false,
  rows = 4,
  helper,
}) {
  const id = "field-" + name;
  const common = {
    id,
    name,
    value: value ?? "",
    onChange,
    required,
  };
  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-label="required"> *</span>}
      </label>
      {textarea ? (
        <textarea {...common} rows={rows} placeholder={placeholder} />
      ) : options ? (
        <select {...common}>
          <option value="">Select an option</option>
          {options.map((option) =>
            typeof option === "string" ? (
              <option key={option} value={option}>
                {option}
              </option>
            ) : (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ),
          )}
        </select>
      ) : (
        <input
          {...common}
          type={type}
          min={min}
          placeholder={placeholder}
          pattern={
            required && ["text", "tel"].includes(type) ? ".*\\S.*" : undefined
          }
          title={
            required && ["text", "tel"].includes(type)
              ? "Please enter more than spaces."
              : undefined
          }
        />
      )}
      {helper && <small>{helper}</small>}
    </div>
  );
}
export function FormError({ message }) {
  return message ? (
    <p role="alert" className="form-error">
      {message}
    </p>
  ) : null;
}
