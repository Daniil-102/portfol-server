import express from 'express';
import { createTransport } from 'nodemailer';
import cors from 'cors';
import pkg from 'body-parser';


const app = express();
const port = process.env.PORT || 4445;

const { urlencoded, json } = pkg;
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello')
})
app.post('/send-email', async (req, res) => {
  const { name, email, phone } = req.body;

  const transporter1 = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const transporter2 = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL2,
      pass: process.env.PASS2,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let textContent = `Имя: ${name}\nEmail: ${email}`;
  if (phone) {
    textContent += `\nPhone: ${phone}`;
  }

  const mailOptions1 = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Заявка от роботодателя',
    text: textContent,
  };

  const mailOptions2 = {
    from: process.env.EMAIL2,
    to: email,
    subject: 'Acknowledgement of work offer',
    text: `Dear ${name},
        
We thank you for your offer of work. We have received your offer and will hold the necessary discussions in the near future. 
We are very interested in your offer and hope to provide you with feedback soon.

Respectfully,
    Daniel Kononchuk`,
  };

  try {
    await transporter1.sendMail(mailOptions1);
    await transporter2.sendMail(mailOptions2);

    res.status(200).send(`Письма успешно отправлены`);
  } catch (error) {
    console.error('Error sending data:', error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
