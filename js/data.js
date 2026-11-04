/* =========================================================
   Dados do casamento.
   O array "gifts" abaixo só é usado em MODO DEMONSTRAÇÃO, antes
   de configurar a Planilha Google (js/config.js). Depois de
   configurada, a lista de presentes real vem da planilha, e
   vocês cadastram/editam os itens direto nela (veja README.md).
   ========================================================= */

const WEDDING_DATA = {
  couple: {
    groom: "Dhiogo",
    bride: "Laura",
  },
  event: {
    date: "2027-07-17T16:30:00",
    dateLabel: "17 de Julho de 2027",
    timeLabel: "16h30",
    venueName: "Spaço Verde",
    address: "Anel Viário St. Oeste - Luizote de Freitas, Uberlândia - MG - 38400-402",
    fullAddressForMaps: "Spaço Verde, Anel Viário St. Oeste, Luizote de Freitas, Uberlândia - MG, 38400-402",
  },
  gifts: [
    {
      id: "pix-lua-de-mel",
      name: "Cota Lua de Mel",
      description: "Ajude-nos a realizar a viagem dos sonhos depois do casamento.",
      price: "A partir de R$ 50,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "jogo-panelas",
      name: "Jogo de Panelas",
      description: "Para prepararmos nossas primeiras refeições juntos.",
      price: "R$ 450,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "jogo-cama",
      name: "Jogo de Cama Casal",
      description: "Noites tranquilas no nosso novo lar.",
      price: "R$ 280,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "liquidificador",
      name: "Liquidificador",
      description: "Para os sucos e vitaminas do dia a dia.",
      price: "R$ 220,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "jogo-jantar",
      name: "Jogo de Jantar",
      description: "Para recebermos a família e os amigos com carinho.",
      price: "R$ 390,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "kit-churrasco",
      name: "Kit Churrasco",
      description: "Para os churrascos de fim de semana com quem a gente ama.",
      price: "R$ 310,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "aspirador",
      name: "Aspirador de Pó",
      description: "Praticidade para cuidar da nossa casa nova.",
      price: "R$ 500,00",
      image: "assets/images/brasao.png",
    },
    {
      id: "pix-mobilia",
      name: "Ajude a Mobiliar Nosso Lar",
      description: "Contribuição livre para os móveis da nossa casa.",
      price: "Valor livre",
      image: "assets/images/brasao.png",
    },
  ],
};
