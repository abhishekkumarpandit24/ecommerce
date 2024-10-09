import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  recipients,
  onSendCompose,
  onSendMessage,
  currentConversationId,
}) {
  const router = useRouter();

  useEffect(() => {
    if (currentConversationId) {
      router.push(`${paths.dashboard.chat}?id=${currentConversationId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversationId]);

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChange = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSend = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        if (message) {
          if (currentConversationId) {
            onSendMessage(message);
          } else {
            onSendCompose(message);
          }
        }
        setMessage('');
      }
    },
    [currentConversationId, message, onSendCompose, onSendMessage]
  );

  return (
    <>
      <InputBase
        value={message}
        onKeyUp={handleSend}
        onChange={handleChange}
        placeholder="Type a message"
        disabled={!recipients.length && !currentConversationId}
        startAdornment={
          <IconButton>
            <Iconify icon="eva:smiling-face-fill" />
          </IconButton>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0 }}>
            <IconButton onClick={handleAttach}>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>
            <IconButton onClick={handleAttach}>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>
            <IconButton>
              <Iconify icon="solar:microphone-bold" />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          height: 56,
          flexShrink: 0,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      />

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}

ChatMessageInput.propTypes = {
  currentConversationId: PropTypes.string,
  onSendCompose: PropTypes.func,
  onSendMessage: PropTypes.func,
  recipients: PropTypes.array,
};
