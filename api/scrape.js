export default async function handler(req, res) {
    if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
    }

  const { url } = req.body;

  if (!url) {
        return res.status(400).json({ error: 'URL obrigatória' });
  }

  try {
        const response = await fetch(url, {
                headers: {
                          'User-Agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
                }
        });

      const html = await response.text();

      const titleMatch =
              html.match(/<title>(.*?)<\/title>/i) ||
              html.match(/property="og:title" content="(.*?)"/i);

      const priceMatch = html.match(/R\$ ?\d+([.,]\d+)?/);

      return res.status(200).json({
              nome: titleMatch ? titleMatch[1] : null,
              preco: priceMatch ? priceMatch[0] : null
      });
  } catch (error) {
        return res.status(500).json({ error: 'Erro ao acessar a URL' });
  }
}
