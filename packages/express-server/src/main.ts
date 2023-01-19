import express from 'express';
import { join } from 'path';

const PORT = process.env.PORT || '3000';
const app = express();

app.enable('trust proxy');
app.use((request, response, next) => {
  if (process.env.NODE_ENV === 'production' && !request.secure) {
    return response.redirect('https://' + request.headers.host + request.url);
  }
  next();
});

const clientPath = join(__dirname, '../../docusaurus/build');
app.use(express.static(clientPath));

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
