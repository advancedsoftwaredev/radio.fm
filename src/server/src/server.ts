import express from 'express';
import path from 'path';

const app = express();
const port = 8080;

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
app.use(express.static(__dirname + '/../../web/out'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
