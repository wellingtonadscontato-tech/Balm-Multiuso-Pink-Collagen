/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { shopifyCheckout } from './shopifyCheckout';
export { shopifyCheckout };

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

export interface ProductConfig {
  brand: {
    name: string;
    tagline: string;
    targetMarket: string;
    currency: string;
    currencySymbol: string;
    referenceProduct: string;
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
  assets: {
    heroArt: string; // 01-art-en.png
    applicationArt: string; // 02-art-en.png
    ingredientsArt: string; // 03-art-en.png
    areasArt: string; // 04-art-en.png
    productArt: string; // 05-art-en.png
    portabilityArt: string; // 07-art-en.png
    textureArt: string; // 08-art-en.png
    routineArt: string; // 09-art-en-v2.png
    productIsolated: string; // product-isolated.png
    productKit2: string; // product-kit-2.png
    productKit4: string; // product-kit-4.png
  };
  productDetails: {
    overview: string;
    formulaHighlights: string[];
    benefits: string[];
    applicationAreas: string[];
    usageInstructions: string;
    precautions: string;
    packageContent: string;
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
    copyright: string;
  };
}

const SUPABASE_BASE_URL = 'https://lpgzamgqjcoicmostfln.supabase.co/storage/v1/object/public/product-artwork/';

export const productConfig: ProductConfig = {
  brand: {
    name: 'Rosa Balm',
    tagline: 'Multi Balm facial e corporal coreano em bastão 10g',
    targetMarket: 'Estados Unidos (USD)',
    currency: 'USD',
    currencySymbol: '$',
    referenceProduct: 'Medicube PDRN Pink Collagen Volume Multi Balm 10g',
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
  assets: {
    heroArt: `${SUPABASE_BASE_URL}01-art-en.png`,
    applicationArt: `${SUPABASE_BASE_URL}02-art-en.png`,
    ingredientsArt: `${SUPABASE_BASE_URL}03-art-en.png`,
    areasArt: `${SUPABASE_BASE_URL}04-art-en.png`,
    productArt: `${SUPABASE_BASE_URL}05-art-en.png`,
    portabilityArt: `${SUPABASE_BASE_URL}07-art-en.png`,
    textureArt: `${SUPABASE_BASE_URL}08-art-en.png`,
    routineArt: `${SUPABASE_BASE_URL}09-art-en-v2.png`,
    productIsolated: `${SUPABASE_BASE_URL}product-isolated.png`,
    productKit2: `${SUPABASE_BASE_URL}product-kit-2.png`,
    productKit4: `${SUPABASE_BASE_URL}product-kit-4.png`,
  },
  tiers: {
    single: {
      id: 'single',
      title: '1 Stick',
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
      title: '2 Sticks',
      badge: 'Kit em destaque',
      quantity: 2,
      unitWeight: '20g total',
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
      title: '4 Sticks',
      badge: 'Super Econômico',
      quantity: 4,
      unitWeight: '40g total',
      price: 59.99,
      pricePerUnitText: '$15.00 / unidade',
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
          'Todos os pedidos contam com Frete Grátis para todo o território dos EUA. Prazo de entrega a confirmar.',
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
      'Protótipo em ambiente de revisão prévia para o mercado dos EUA. O checkout permanece desativado até confirmação do fornecimento real. Nenhum pagamento é processado.',
    shippingNotice:
      'Frete Grátis garantido para os Estados Unidos em todos os kits (1, 2 e 4 unidades).',
    copyright: '© 2026 Rosa Balm. Todos os direitos reservados.',
  },
};
