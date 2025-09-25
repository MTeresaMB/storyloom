import Button from './Button'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            type="button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}


