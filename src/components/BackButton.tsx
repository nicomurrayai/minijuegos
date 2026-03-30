type BackButtonProps = {
  label?: string
  onClick: () => void
}

export function BackButton({
  label = 'Volver al menu principal',
  onClick,
}: BackButtonProps) {
  return (
    <button className="back-button" type="button" onClick={onClick}>
      <span aria-hidden="true" className="back-button__icon">
        ‹
      </span>
      <span className="visually-hidden">{label}</span>
    </button>
  )
}
