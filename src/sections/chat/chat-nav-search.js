// @mui
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClickAwayListener from '@mui/material/ClickAwayListener';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatNavSearch({ value, onSearchContact, onClickAway }) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <TextField
        fullWidth
        value={value}
        onChange={onSearchContact}
        placeholder="Search contacts..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2.5 }}
      />
    </ClickAwayListener>
  );
}

ChatNavSearch.propTypes = {
  onClickAway: PropTypes.func,
  onSearchContact: PropTypes.func,
  value: PropTypes.string,
};
