export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { valencia, simbolo } = req.body;

  if (!valencia || !simbolo) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const resposta = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer APP_USR-3292758186398540-071212-2fd4b8a392a9c7fb4de3b7b44416ee04-1809350050`,
      },
      body: JSON.stringify({
        transaction_amount: Number(valencia),
        description: `Compra de pontos para o token ${simbolo}`,
        payment_method_id: "pix",
        payer: {
          email: simbolo + "@gmail.com",
          first_name: simbolo,
          identification: {
            type: "CPF",
            number: "12345678909"
          }
        }
      }),
    });

    const json = await resposta.json();

    if (json.point_of_interaction?.transaction_data?.ticket_url) {
      return res.status(200).json({
        link: json.point_of_interaction.transaction_data.ticket_url,
        qr: json.point_of_interaction.transaction_data.qr_code_base64,
      });
    } else {
      return res.status(500).json({ error: "Falha ao gerar pagamento", detalhes: json });
    }
  } catch (erro) {
    return res.status(500).json({ error: "Erro interno", detalhes: erro.message });
  }
}
