/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductTier {
  id: 'single' | 'kit_duo' | 'kit_quad';
  title: string;
  badge?: string;
  quantity: number;
  unitWeight: string; // '10g'
  price: number;
  pricePerUnitText: string;
  shippingText: string;
  shippingCost: number; // Always 0 (Frete Grátis EUA)
  buttonText: string;
  features: string[];
}

export interface GalleryArt {
  id: number;
  filename: string;
  src: string;
  fallbackSrc: string;
  title: string;
  tag: string;
  alt: string;
  isComparisonArte6?: boolean;
  comparisonNote?: string;
}

export interface ProductConfig {
  brand: {
    name: string;
    tagline: string;
    targetMarket: string;
    currency: string;
    currencySymbol: string;
    referenceProduct: string;
    storeDisclaimer: string;
  };
  hero: {
    kicker: string;
    title: {
      plainStart: string;
      highlight1: string;
      plainMiddle: string;
      highlight2: string;
      plainEnd: string;
    };
    subtitle: string;
    ctaButton: string;
    secondaryButton: string;
    keyPoints: string[];
  };
  tiers: {
    single: ProductTier;
    kitDuo: ProductTier;
    kitQuad: ProductTier;
  };
  gallery: GalleryArt[];
  productDetails: {
    overview: string;
    formulaHighlights: string[];
    benefits: string[];
    applicationAreas: string[];
    usageInstructions: string;
    precautions: string;
    packageContent: string;
  };
  benefits: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  routine: {
    title: string;
    subtitle: string;
    moments: {
      period: string;
      title: string;
      description: string;
    }[];
  };
  howToUse: {
    title: string;
    subtitle: string;
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
  };
  faq: {
    title: string;
    subtitle: string;
    questions: {
      question: string;
      answer: string;
    }[];
  };
  inactiveModules: {
    orderBump: {
      enabled: boolean;
      name: string;
      description: string;
      statusNote: string;
    };
    upsell: {
      enabled: boolean;
      name: string;
      description: string;
      statusNote: string;
    };
    metaPixel: {
      enabled: boolean;
      pixelId: string | null;
      statusNote: string;
      allowedEvents: string[];
      blockedEvents: string[];
    };
  };
  disclaimers: {
    prototypeNotice: string;
    shippingNotice: string;
    referenceNotice: string;
    arteNotice: string;
    copyright: string;
  };
}

export const productConfig: ProductConfig = {
  brand: {
    name: 'Rosa Balm',
    tagline: 'Multi Balm facial e corporal coreano em bastão 10g',
    targetMarket: 'Estados Unidos (USD)',
    currency: 'USD',
    currencySymbol: '$',
    referenceProduct: 'Medicube PDRN Pink Collagen Volume Multi Balm 10g',
    storeDisclaimer:
      'Rosa Balm é uma loja independente de curadoria. Este protótipo utiliza o produto Medicube PDRN Pink Collagen Volume Multi Balm 10g como referência de catálogo e especificações, sem vínculo oficial de representação, revenda autorizada ou parceria com a marca fabricante.',
  },
  hero: {
    kicker: 'K-Beauty · Cuidados Faciais',
    title: {
      plainStart: 'Seu toque de ',
      highlight1: 'hidratação',
      plainMiddle: ' e ',
      highlight2: 'luminosidade',
      plainEnd: ', onde você estiver.',
    },
    subtitle:
      'Um balm facial em bastão para complementar sua rotina de cuidado com uma aplicação prática.',
    ctaButton: 'Escolher meu kit',
    secondaryButton: 'Ver especificações completas',
    keyPoints: [
      'Bálsamo coreano em bastão de 10g para rosto e corpo',
      'Fórmula com PDRN, colágeno, Volufiline e peptídeos',
      'Frete Grátis incluso para todos os pedidos nos EUA',
    ],
  },
  tiers: {
    single: {
      id: 'single',
      title: '1 Stick (10g)',
      badge: 'Individual',
      quantity: 1,
      unitWeight: '10g',
      price: 24.99,
      pricePerUnitText: '$24.99 / unidade',
      shippingText: 'Free Shipping',
      shippingCost: 0,
      buttonText: 'Escolher 1 Stick',
      features: [
        '1x Balm em bastão de 10g',
        'Frete Grátis para todo os EUA',
        'Acabamento hidratado e luminoso',
        'Aplicação direta e prática',
      ],
    },
    kitDuo: {
      id: 'kit_duo',
      title: '2 Sticks (20g total)',
      badge: 'Kit em destaque',
      quantity: 2,
      unitWeight: '2x 10g (20g total)',
      price: 34.99,
      pricePerUnitText: '$17.50 / unidade',
      shippingText: 'Free Shipping',
      shippingCost: 0,
      buttonText: 'Escolher Kit em Destaque',
      features: [
        '2x Balms em bastão de 10g (20g total)',
        'Frete Grátis para todo os EUA',
        'Ideal para manter um em casa e outro na bolsa',
        'Praticidade duplicada para o dia a dia',
      ],
    },
    kitQuad: {
      id: 'kit_quad',
      title: '4 Sticks (40g total)',
      badge: 'Super Econômico',
      quantity: 4,
      unitWeight: '4x 10g (40g total)',
      price: 59.99,
      pricePerUnitText: '$15.00 / unidade (Menor preço por grama)',
      shippingText: 'Free Shipping',
      shippingCost: 0,
      buttonText: 'Escolher 4 Sticks',
      features: [
        '4x Balms em bastão de 10g (40g total)',
        'Frete Grátis para todo os EUA',
        'Menor preço unitário do catálogo ($15.00/un)',
        'Reserva completa para rotina facial e corporal',
      ],
    },
  },
  gallery: [
    {
      id: 1,
      filename: '01-art-en.png',
      src: '/assets/01-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_hero_1791199906964.jpg',
      title: 'Instant Hydration & Natural Glow',
      tag: '01 · Visão Geral',
      alt: 'Art 01: Instant Hydration & Natural Glow - Medicube Multi-Use Balm',
    },
    {
      id: 2,
      filename: '02-art-en.png',
      src: '/assets/02-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_application_1791199941551.jpg',
      title: 'Glides On Smoothly',
      tag: '02 · Sensorial',
      alt: 'Art 02: Glides On Smoothly - A lightweight non-greasy balm',
    },
    {
      id: 3,
      filename: '03-art-en.png',
      src: '/assets/03-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_texture_1791199926096.jpg',
      title: 'Powerful Ingredients',
      tag: '03 · Ativos',
      alt: 'Art 03: Powerful Ingredients for Healthier-Looking Skin (PDRN, Collagen, Hyaluronic Acid)',
    },
    {
      id: 4,
      filename: '04-art-en.png',
      src: '/assets/04-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_application_1791199941551.jpg',
      title: 'Multi-Use Balm Areas',
      tag: '04 · Áreas de Aplicação',
      alt: 'Art 04: Multi-Use Balm - Under eyes, forehead, cheeks, smile lines, neck, lips',
    },
    {
      id: 5,
      filename: '05-art-en.png',
      src: '/assets/05-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_hero_1791199906964.jpg',
      title: 'Pink Collagen Balm Splash',
      tag: '05 · Embalagem & Textura',
      alt: 'Art 05: Medicube 5% Volufiline PDRN Pink Collagen Volume Multi Balm stick with water splash',
    },
    {
      id: 6,
      filename: '06-art-en.png',
      src: '/assets/06-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_texture_1791199926096.jpg',
      title: 'Visibly Smoother Radiant Skin',
      tag: '06 · Referência de Layout',
      alt: 'Art 06: Layout visual de comparação - Apenas para prévia de layout',
      isComparisonArte6: true,
      comparisonNote:
        'Comparação ilustrativa de layout; não representa resultado clínico ou depoimento validado. Disponível apenas nesta prévia.',
    },
    {
      id: 7,
      filename: '07-art-en.png',
      src: '/assets/07-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_hero_1791199906964.jpg',
      title: 'Perfect for On-the-Go',
      tag: '07 · Portabilidade',
      alt: 'Art 07: Perfect for On-the-Go - Compact, travel-friendly and easy to use',
    },
    {
      id: 8,
      filename: '08-art-en.png',
      src: '/assets/08-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_texture_1791199926096.jpg',
      title: 'A Silky, Lightweight Texture',
      tag: '08 · Textura',
      alt: 'Art 08: A Silky, Lightweight Texture - Melts into skin without feeling sticky or greasy',
    },
    {
      id: 9,
      filename: '09-art-en.png',
      src: '/assets/09-art-en.png',
      fallbackSrc: '/src/assets/images/rosa_balm_application_1791199941551.jpg',
      title: 'Glow Anytime, Anywhere',
      tag: '09 · Rotina',
      alt: 'Art 09: Glow Anytime, Anywhere - Simple, effective, beautifully you',
    },
  ],
  productDetails: {
    overview:
      'Medicube PDRN Pink Collagen Volume Multi Balm 10g. Bálsamo facial e corporal coreano em formato de bastão, desenvolvido para proporcionar hidratação prática e cuidado direcionado às áreas com ressecamento, linhas finas e aparência de perda de volume. Sua fórmula combina PDRN, colágeno, Volufiline, NAD, peptídeos, retinol, cafeína, vitamina E e ácido hialurônico. A textura suave derrete ao entrar em contato com a pele, desliza facilmente e proporciona acabamento hidratado e luminoso sem sensação pesada ou pegajosa.',
    formulaHighlights: [
      'PDRN & Colágeno',
      'Volufiline',
      'NAD',
      'Peptídeos',
      'Retinol',
      'Cafeína',
      'Vitamina E',
      'Ácido Hialurônico',
    ],
    benefits: [
      'Ajuda a hidratar áreas secas',
      'Auxilia no cuidado da aparência de linhas finas',
      'Promove aparência mais firme e preenchida',
      'Ajuda a melhorar a luminosidade',
      'Textura suave e não pegajosa',
      'Formato prático em bastão',
      'Ideal para retoques ao longo do dia',
      'Livre de fragrância e corantes artificiais',
      'Produto de tecnologia coreana (K-Beauty)',
      'Conteúdo de 10g por unidade',
    ],
    applicationAreas: [
      'Abaixo dos olhos',
      'Bochechas',
      'Testa',
      'Linhas do sorriso',
      'Ao redor dos lábios',
      'Pescoço',
      'Colo',
      'Áreas ressecadas do rosto ou corpo',
    ],
    usageInstructions:
      'Gire para expor pequena quantidade, deslize delicadamente e espalhe se necessário. Reaplique para hidratação e luminosidade, antes ou sobre maquiagem.',
    precautions:
      'Uso externo. Evite contato direto com os olhos. Em caso de irritação suspenda uso. Mantenha fora do alcance de crianças, local fresco longe do sol.',
    packageContent: '1 balm de 10g por unidade.',
  },
  benefits: {
    title: 'Cuidado direcionado com formato em bastão',
    subtitle:
      'Desenvolvido para proporcionar hidratação prática e cuidado direcionado às áreas com ressecamento, linhas finas e perda de volume.',
    items: [
      {
        title: 'Hidratação e Áreas Secas',
        description:
          'Ajuda a hidratar profundamente áreas secas do rosto e corpo com acabamento suave e luminoso.',
      },
      {
        title: 'Aparência Firme e Preenchida',
        description:
          'Auxilia no cuidado da aparência de linhas finas e promove aspecto mais firme e revitalizado.',
      },
      {
        title: 'Textura Suave e Não Pegajosa',
        description:
          'Fórmula que derrete suavemente ao entrar em contato com a pele, deslizando com extrema facilidade.',
      },
      {
        title: 'Praticidade para Retoques',
        description:
          'Formato prático em bastão de 10g ideal para levar na bolsa e reaplicar ao longo do dia.',
      },
    ],
  },
  routine: {
    title: 'Momentos ideais de aplicação',
    subtitle:
      'Uma textura emoliente para revitalizar o viço da pele em três momentos do seu dia.',
    moments: [
      {
        period: 'Manhã',
        title: 'Despertar e Viço Radiante',
        description:
          'Aplique nas áreas indicadas após a limpeza facial para uma hidratação luminosa matinal.',
      },
      {
        period: 'Dia',
        title: 'Retoque Prático sem Complicação',
        description:
          'Revitalize pontos ressecados ou linhas finas a qualquer hora, antes ou sobre a maquiagem.',
      },
      {
        period: 'Noite',
        title: 'Cuidado Noturno Reconfortante',
        description:
          'Aplique suavemente nas bochechas, testa, pescoço e colo para hidratação durante o repouso.',
      },
    ],
  },
  howToUse: {
    title: 'Modo de Uso Recomendado',
    subtitle:
      'Passos simples e práticos para obter o melhor resultado do seu Multi Balm 10g.',
    steps: [
      {
        number: '01',
        title: 'Gire para expor pequena quantidade',
        description:
          'Gire suavemente a base para expor uma pequena porção do produto necessária para a aplicação.',
      },
      {
        number: '02',
        title: 'Deslize e espalhe delicadamente',
        description:
          'Deslize suavemente sobre as áreas desejadas (rosto, pescoço ou corpo) e espalhe se necessário.',
      },
      {
        number: '03',
        title: 'Reaplique e feche bem a tampa',
        description:
          'Reaplique sempre que desejar hidratação e luminosidade, antes ou sobre maquiagem. Feche a tampa após o uso.',
      },
    ],
  },
  faq: {
    title: 'Perguntas Frequentes',
    subtitle:
      'Informações claras sobre o produto de referência, compras e entrega nos Estados Unidos.',
    questions: [
      {
        question: 'Qual é o produto de referência e o que ele oferece?',
        answer:
          'Trata-se do Medicube PDRN Pink Collagen Volume Multi Balm 10g, um bálsamo facial e corporal coreano em formato de bastão formulado com PDRN, colágeno, Volufiline, peptídeos e ácido hialurônico para hidratação prática e viço luminoso.',
      },
      {
        question: 'Quais são as áreas indicadas de aplicação?',
        answer:
          'Pode ser aplicado abaixo dos olhos, bochechas, testa, linhas do sorriso, ao redor dos lábios, pescoço, colo e quaisquer áreas ressecadas do rosto ou corpo.',
      },
      {
        question: 'Como utilizar o produto no dia a dia?',
        answer:
          'Gire a base para expor uma pequena quantidade, deslize suavemente sobre a pele e espalhe delicadamente se necessário. Pode ser reaplicado para hidratação e viço, antes ou sobre a maquiagem.',
      },
      {
        question: 'Como funciona o envio para os Estados Unidos?',
        answer:
          'Todos os pedidos contam com Frete Grátis para todo o território dos EUA. Os prazos oficiais de entrega encontram-se em confirmação com a cadeia logística.',
      },
      {
        question: 'A loja Rosa Balm é o fabricante oficial da Medicube?',
        answer:
          'Não. A Rosa Balm atua como loja de curadoria independente. Não afirmamos representação exclusiva, parceria corporativa, revenda autorizada ou autenticidade além do produto apresentado como referência visual e técnica.',
      },
    ],
  },
  inactiveModules: {
    orderBump: {
      enabled: false,
      name: 'Order Bump',
      description: 'Oferta complementar no fluxo de compra.',
      statusNote: 'Módulo desativado até definição oficial de catálogo.',
    },
    upsell: {
      enabled: false,
      name: 'Upsell',
      description: 'Oferta pós-compra de unidades adicionais.',
      statusNote: 'Módulo desativado até homologação comercial.',
    },
    metaPixel: {
      enabled: false,
      pixelId: null,
      statusNote:
        'Desativado. Requer configuração e consentimento. Sem disparo de Purchase.',
      allowedEvents: [],
      blockedEvents: ['Purchase'],
    },
  },
  disclaimers: {
    prototypeNotice:
      'Protótipo em ambiente de revisão prévia para o mercado dos EUA. O módulo de checkout permanece desativado até confirmação definitiva do fornecimento real. Nenhum pagamento é processado.',
    shippingNotice:
      'Frete Grátis garantido para os Estados Unidos em todos os kits (1, 2 e 4 unidades).',
    referenceNotice:
      'As especificações e dados do produto baseiam-se na descrição pública do Medicube PDRN Pink Collagen Volume Multi Balm 10g e servem como referência de produto, sem validação formal de fornecedor ou representação oficial da marca.',
    arteNotice: 'Arte ilustrativa baseada na referência do produto.',
    copyright: '© 2026 Rosa Balm. Protótipo de e-commerce para os EUA.',
  },
};
