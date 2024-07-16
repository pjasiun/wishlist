import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

import Button from '@mui/material/Button'

function ConfirmDialog({ open, processing, onCancel, onSubmit }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        component: 'form',
        onSubmit: onSubmit,
      }}
    >
      <DialogTitle>Rezerwacja</DialogTitle>
      <DialogContent>
        <p className="Dialog-text">
          Podaj swoje imię, żebyśmy wiedzieli kto zarezerwował prezent. Twoje
          imię będzie widoczne wyłącznie dla rodziców Laury.
        </p>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          label="Twoje imię"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Anuluj</Button>
        <Button type="submit" variant="contained" disabled={processing}>
          {processing ? 'Rezerwuję...' : 'Rezerwuj'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
