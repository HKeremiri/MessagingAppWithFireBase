import Grid2 from "@mui/material/Grid2";

export default function Message({ message, user }) {
  const createdAt = new Date(message.createdAt).toLocaleString();
  const isCurrentUser = message.senderId === user.uid;

  return (
    <Grid2 style={{ textAlign: isCurrentUser ? 'right' : 'left' }}>
      <p><strong>{isCurrentUser ? 'You:' : 'Sender:'}</strong> {message.text}</p>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>{createdAt}</p>
    </Grid2>
  );
}
