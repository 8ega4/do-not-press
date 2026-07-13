type EmergencyButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
  size?: "hero" | "play";
};

export function EmergencyButton({ disabled, onClick, label = "押す", size = "play" }: EmergencyButtonProps) {
  return (
    <button
      type="button"
      className={`emergency-button emergency-button--${size}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className="emergency-button__ring" aria-hidden="true">
        <span className="emergency-button__base">
          <span className="emergency-button__cap" />
        </span>
      </span>
      {size === "play" && <span className="sr-only">{label}</span>}
    </button>
  );
}
