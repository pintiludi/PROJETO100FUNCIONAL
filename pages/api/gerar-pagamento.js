
import mercadopago from 'mercadopago';

mercadopago.configure({
  access_token: process.env.MP_TOKEN
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { valencia, simbolo } = req.body;

  if (!valencia || !simbolo || isNaN(valencia)) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  try {
    const pagamento = await mercadopago.preferences.create({
      items: [{
        title: `Compra de ${valencia} pontos`,
        quantity: 1,
        unit_price: parseFloat(valencia)
      }],
      metadata: { simbolo },
      back_urls: {
        success: 'https://google.com',
        failure: 'https://google.com',
        pending: 'https://google.com'
      },
      auto_return: 'approved'
    });

    return res.status(200).json({ link: pagamento.body.init_point, qr: pagamento.body.point_of_interaction.transaction_data.qr_code_base64 });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar pagamento', detalhe: err.message });
  }
}
