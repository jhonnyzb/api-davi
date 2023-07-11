import express from 'express'
import fetch from 'node-fetch';
import https from "https";
import fs from "fs";
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.get('/auth-daviplata', async (req, res) => {
  const data = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'UK67GogoRliAuUm9HNAURzzHn3K2EHxemYKTPtFHgtkESrC2',
    client_secret: 'wcYPCx1DpdjA9ybAQHkRkVqv3Iq8QuOLSoLZGaMYcX0kwgH68RJfvwIdj9TqzuNu',
    scope: 'daviplata'
  });

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data,
    agent: new https.Agent({
      cert: fs.readFileSync('certified/cert_dummy_lab_v2.crt'),
      key: fs.readFileSync('certified/cert_dummy_lab_key_v2.pem'),
    })
  };
  try {
    const response = await fetch('https://apislab.daviplata.com/oauth2Provider/type1/v1/token', options);
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al autenticar daviplata' });
  }
});

app.get('/buy-daviplata', async (req, res) => {
  const data = {
    valor: req.body.value,
    numeroIdentificacion: req.body.document,
    tipoDocumento: req.body.typeDocument,
  };

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + req.body.token,
      'Content-Type': 'application/json',
      'x-ibm-client-id': 'UK67GogoRliAuUm9HNAURzzHn3K2EHxemYKTPtFHgtkESrC2',
    },
    body: JSON.stringify(data),
    agent: new https.Agent({
      cert: fs.readFileSync('certified/cert_dummy_lab_v2.crt'),
      key: fs.readFileSync('certified/cert_dummy_lab_key_v2.pem'),
    })
  };
  try {
    const response = await fetch('https://apislab.daviplata.com/daviplata/v1/compra', options);
    const responseData = await response.json();
    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al comprar daviplata' });
  }
});


app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
})