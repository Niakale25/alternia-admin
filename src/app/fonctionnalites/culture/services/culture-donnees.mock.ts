import { ContenuCulturelDTO, RegionMalienne } from '../modeles/culture.modele';

export const REGIONS_MALI: RegionMalienne[] = [
  {
    id: 'bamako',
    nom: 'District de Bamako',
    surnom: 'Les Trois Caïmans',
    couleur: '#314999',
    badgeBg: 'rgba(49, 73, 153, 0.08)',
    icone: 'building'
  },
  {
    id: 'koulikoro',
    nom: 'Koulikoro',
    surnom: 'Monts Mandingues & Vallée du Niger',
    couleur: '#F1851F',
    badgeBg: 'rgba(241, 133, 31, 0.08)',
    icone: 'mountain'
  },
  {
    id: 'kayes',
    nom: 'Kayes',
    surnom: 'Cité des Rails & Chutes du Félou',
    couleur: '#40BBCC',
    badgeBg: 'rgba(64, 187, 204, 0.08)',
    icone: 'waves'
  },
  {
    id: 'sikasso',
    nom: 'Sikasso',
    surnom: 'Le Kénédougou & Grenier du Mali',
    couleur: '#10B981',
    badgeBg: 'rgba(16, 185, 129, 0.08)',
    icone: 'sprout'
  },
  {
    id: 'segou',
    nom: 'Ségou',
    surnom: 'Cité des Balanzans & Royaume Bambara',
    couleur: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.08)',
    icone: 'tree-pine'
  },
  {
    id: 'mopti',
    nom: 'Mopti',
    surnom: 'Venise Malienne & Delta Intérieur',
    couleur: '#EC4899',
    badgeBg: 'rgba(236, 72, 153, 0.08)',
    icone: 'anchor'
  },
  {
    id: 'tombouctou',
    nom: 'Tombouctou',
    surnom: 'Cité des 333 Saints & Manuscrits Anciens',
    couleur: '#EAB308',
    badgeBg: 'rgba(234, 179, 8, 0.08)',
    icone: 'book-open'
  },
  {
    id: 'gao',
    nom: 'Gao',
    surnom: 'Cité Impériale des Askia & Fleuve Niger',
    couleur: '#F97316',
    badgeBg: 'rgba(249, 115, 22, 0.08)',
    icone: 'crown'
  },
  {
    id: 'kidal',
    nom: 'Kidal',
    surnom: 'Adrar des Ifoghas & Massif Saharien',
    couleur: '#06B6D4',
    badgeBg: 'rgba(6, 182, 212, 0.08)',
    icone: 'sun'
  },
  {
    id: 'menaka',
    nom: 'Ménaka',
    surnom: 'Terre Pastorale & Confluent des Savoirs',
    couleur: '#14B8A6',
    badgeBg: 'rgba(20, 184, 166, 0.08)',
    icone: 'compass'
  },
  {
    id: 'taoudenit',
    nom: 'Taoudénit',
    surnom: 'Grands Espaces Sahariens & Mines de Sel',
    couleur: '#64748B',
    badgeBg: 'rgba(100, 116, 139, 0.08)',
    icone: 'layers'
  }
];

export const CONTENUS_CULTURELS_INITIAUX: ContenuCulturelDTO[] = [
  // ── 1. Figure Historique : Soundiata Keïta
  {
    id: 'fig-soundiata',
    type: 'figure',
    nom: 'Soundiata Keïta',
    titreHonorifique: 'Fondateur de l\'Empire du Manden & Mansa Suprême',
    periode: '1190 – 1255',
    regionId: 'koulikoro',
    regionNom: 'Koulikoro (Manden)',
    tag: 'Bâtisseur d\'Empire',
    photoUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=60',
    photoCredits: 'Archives Nationales du Mali / Patrimoine Manden',
    resume: 'Héros fondateur de l\'Empire du Mali au XIIIe siècle, proclamateur de la Charte de Kouroukan Fouga (l\'une des premières déclarations universelles des droits humains).',
    citationHistorique: 'La paix et la concorde reposent sur le respect de chaque voix au conseil.',
    faitsCles: [
      { titre: 'Victoire de Krina (1235)', description: 'Triomphe décisif contre Soumaoro Kanté et unification des provinces du Manden.' },
      { titre: 'Kouroukan Fouga (1236)', description: 'Proclamation de la constitution orale garantissant la paix sociale et les droits de la personne.' }
    ],
    chapitres: [
      {
        titre: 'L\'Enfance et la Prophétie',
        contenu: 'Né infirme, Soundiata surmonta l\'adversité grâce à un courage exceptionnel et à la bénédiction de sa mère Sogolon Kédjou.',
        citation: 'L\'arbre qui doit grandir plonge d\'abord ses racines dans l\'humilité.',
        auteurCitation: 'Balla Fasséké Kouyaté'
      }
    ],
    elementsConnexes: [
      { id: 'vil-kangaba', type: 'ville', titre: 'Kangaba (Kouroukan Fouga)' },
      { id: 'cnt-epopee-manden', type: 'conte', titre: 'L\'Épopée du Manden' }
    ],
    publie: true,
    dateCreation: '2026-01-15T10:00:00Z',
    dateModification: '2026-02-10T14:30:00Z'
  },

  // ── 2. Figure Historique : Mansa Moussa
  {
    id: 'fig-mansa-moussa',
    type: 'figure',
    nom: 'Mansa Kankou Moussa',
    titreHonorifique: 'Mansa du Mali & Bâtisseur du Rayonnement Africain',
    periode: '1280 – 1337',
    regionId: 'tombouctou',
    regionNom: 'Tombouctou',
    tag: 'Souverain Universel',
    photoUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?w=800&auto=format&fit=crop&q=60',
    photoCredits: 'Atlas Catalan (1375) / Bibliothèque Nationale',
    resume: 'Dixième Mansa de l\'Empire du Mali, réputé pour son pèlerinage mémorable à La Mecque et pour avoir fait de Tombouctou et Djenné des phares intellectuels de l\'Afrique.',
    citationHistorique: 'Le savoir est le plus précieux des trésors qu\'un royaume puisse offrir à ses enfants.',
    faitsCles: [
      { titre: 'Pèlerinage à La Mecque (1324)', description: 'Traversée du Caire avec une suite majestueuse marquant durablement les annales méditerranéennes.' },
      { titre: 'Construction de Djingareyber', description: 'Commande de la Grande Mosquée de Tombouctou à l\'architecte Abou Ishaq es-Sahéli.' }
    ],
    chapitres: [
      {
        titre: 'L\'Âge d\'Or de la Renaissance Malienne',
        contenu: 'Sous son règne, le Mali devint un centre d\'échanges intellectuels mondial avec les universités de Sankoré et Sidi Yahya.'
      }
    ],
    elementsConnexes: [
      { id: 'mon-djingareyber', type: 'monument', titre: 'Mosquée Djingareyber' },
      { id: 'vil-tombouctou', type: 'ville', titre: 'Tombouctou la Mystique' }
    ],
    publie: true,
    dateCreation: '2026-01-18T11:20:00Z',
    dateModification: '2026-02-12T09:15:00Z'
  },

  // ── 3. Monument Historique : Grande Mosquée de Djenné
  {
    id: 'mon-djenne',
    type: 'monument',
    nom: 'Grande Mosquée de Djenné',
    sousTitre: 'Le plus grand édifice en terre crue au monde',
    ere: 'Fondations XIIIe siècle, reconstruction 1907',
    regionId: 'mopti',
    regionNom: 'Mopti (Djenné)',
    tag: 'Patrimoine Mondial UNESCO',
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60',
    photoCredits: 'Mission Culturelle de Djenné',
    localisationDetails: 'Place du Marché, Djenné, Delta Intérieur du Niger',
    presentation: 'Chef-d\'œuvre absolu de l\'architecture soudano-sahélienne en banco (terre crue mêlée de paille et de balle de riz).',
    architectureEtMateriaux: 'Pisé / Banco sculpté avec torons de palmier rônier servant d\'échafaudage permanent.',
    pourquoiCestImportant: 'Symbole vivant de solidarité communautaire à travers le crépi annuel réunissant tous les habitants.',
    faitsCles: [
      { titre: 'Crépi Annuel (Le Crépissage)', description: 'Fête populaire et rituel millénaire de restauration collective du monument.' },
      { titre: 'Inscription UNESCO (1988)', description: 'Reconnaissance mondiale au titre de chef-d\'œuvre du génie créateur humain.' }
    ],
    chapitres: [
      {
        titre: 'Le Génie de la Terre Crue',
        contenu: 'Les maçons traditionnels de Djenné, les Barey, transmettent de père en fils les secrets de résistance thermique et structurelle du banco.'
      }
    ],
    elementsConnexes: [
      { id: 'vil-djenne', type: 'ville', titre: 'Ancienne Cité de Djenné' }
    ],
    publie: true,
    dateCreation: '2026-01-20T14:00:00Z',
    dateModification: '2026-02-15T16:45:00Z'
  },

  // ── 4. Cité & Village : Tombouctou
  {
    id: 'vil-tombouctou',
    type: 'ville',
    nom: 'Tombouctou',
    sousTitre: 'La Cité des 333 Saints & Perle du Désert',
    regionId: 'tombouctou',
    regionNom: 'Tombouctou',
    tag: 'Cité Millénaire',
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
    photoCredits: 'Institut des Hautes Études Ahmed Baba',
    fondation: 'Fondée vers 1100 par des nomades Touaregs autour du puits de Bouctou',
    resume: 'Carrefour historique des caravanes transsahariennes et métropole de savoir réputée pour ses centaines de milliers de manuscrits anciens.',
    identiteCulturelle: 'Symbiose unique entre cultures touarègue, songhaï, arabe et peule.',
    traditionsEtPatrimoine: 'Conservation des manuscrits sur la médecine, l\'astronomie, le droit et la philosophie.',
    faitsCles: [
      { titre: 'Université de Sankoré', description: 'L\'une des premières universités du monde au XVe siècle comptant plus de 25 000 étudiants.' },
      { titre: 'Manuscrits de Tombouctou', description: 'Trésor documentaire inestimable préservé dans les bibliothèques familiales privées.' }
    ],
    chapitres: [
      {
        titre: 'Le Sanctuaire du Savoir',
        contenu: 'Les 333 saints reposant autour de la cité protègent symboliquement la tradition spirituelle et la tolérance.'
      }
    ],
    elementsConnexes: [
      { id: 'fig-mansa-moussa', type: 'figure', titre: 'Mansa Kankou Moussa' }
    ],
    publie: true,
    dateCreation: '2026-01-22T08:30:00Z',
    dateModification: '2026-02-18T10:00:00Z'
  },

  // ── 5. Conte Interactif : Le Secret de l'Arbre Baobab
  {
    id: 'cnt-arbre-baobab',
    type: 'conte',
    titre: 'Le Secret du Grand Baobab des Ancêtres',
    sousTitre: 'Conte initiatique sous les étoiles du Manden',
    origine: 'Tradition Orale Mandingue',
    regionId: 'koulikoro',
    regionNom: 'Koulikoro',
    tag: 'Conte Initiatique',
    photoUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=60',
    photoCredits: 'Contes et Légendes du Mali / Griot Fasséké',
    resume: 'Un jeune voyageur s\'égare dans la savane sacrée et rencontre le gardien du baobab centenaire, qui lui pose une énigme sur le respect des aînés et de la nature.',
    narrateur: 'Griot Mamadou Kouyaté',
    dureeAudio: '5 min 20',
    dureeLecture: '4 min',
    enVedette: true,
    morale: 'Celui qui honore la racine n\'a jamais soif des fruits. La patience ouvre toutes les portes de la sagesse.',
    scenes: [
      {
        id: 'sc-1',
        numeroScene: 1,
        titre: 'La Rencontre à la Croisée des Chemins',
        texteNarratif: 'Le soleil décline derrière les collines dorées. À l\'orée de la forêt, un baobab gigantesque dresse ses branches vers le ciel. Un vieil homme drapé de bogolan t\'attend sous l\'arbre.',
        atmosphere: 'Crépuscule serein, chant des grillons et souffle tiède de l\'harmattan',
        insightCulturel: 'Au Mali, le baobab est considéré comme l\'arbre des réunions et le témoin des serments.',
        estEpilogue: false,
        choix: [
          {
            id: 'ch-1',
            libelle: 'Saluer le vieil homme selon la formule coutumière',
            description: 'Tu t\'inclines avec humilité et demandes des nouvelles de sa famille et de sa journée.',
            sceneSuivanteId: 'sc-2',
            traitSagesse: 'Voie du Respect et de la Tradition'
          },
          {
            id: 'ch-2',
            libelle: 'Lui demander précipitamment le chemin le plus rapide',
            description: 'Tu es pressé d\'arriver avant la nuit noire et passes outre les civilités.',
            sceneSuivanteId: 'sc-3',
            traitSagesse: 'Voie de l\'Impatience'
          }
        ]
      },
      {
        id: 'sc-2',
        numeroScene: 2,
        titre: 'La Parole d\'Or sous le Feuillage',
        texteNarratif: 'Le vieil homme sourit d\'un éclat chaleureux. Tu as la parole douce de celui qui sait écouter. Assieds-toi, voici l\'eau fraîche de bienvenue. Il te révèle le chant secret qui apaise les cours d\'eau.',
        atmosphere: 'Lumière étoilée et son cristallin de la Kora',
        insightCulturel: 'L\'hospitalité (Diatiguiya) est la première valeur morale enseignée aux enfants du pays.',
        estEpilogue: true,
        choix: []
      },
      {
        id: 'sc-3',
        numeroScene: 3,
        titre: 'La Leçon du Silence',
        texteNarratif: 'L\'ancien te regarde avec douceur sans prononcer un mot. Le vent souffle dans les branches et te rappelle : Qui court trop vite trébuche sur un grain de sable.',
        atmosphere: 'Silence profond de la nuit',
        insightCulturel: 'Le silence d\'un aîné est une invitation à la réflexion personnelle.',
        estEpilogue: true,
        choix: []
      }
    ],
    elementsConnexes: [
      { id: 'dev-baobab', type: 'devinette', titre: 'Devinette du Baobab' }
    ],
    publie: true,
    dateCreation: '2026-02-01T15:00:00Z',
    dateModification: '2026-02-20T11:10:00Z'
  },

  // ── 6. Devinette Traditionnelle « N'Da ! »
  {
    id: 'dev-pirogue',
    type: 'devinette',
    formuleIntro: 'N\'Da ! — N\'Da n\'sira !',
    enigmeTexte: 'Je glisse sur le ventre sans jamais marcher sur terre, je porte des centaines d\'hommes et nourris les villages du fleuve. Qui suis-je ?',
    indices: [
      'Je suis sculptée dans le bois du grand arbre',
      'Je danse sur les vagues du Djoliba (fleuve Niger)',
      'Les Bozo sont mes maîtres et mes compagnons fidèles'
    ],
    options: ['Le Crocodile', 'La Pirogue (Kouloun)', 'Le Filet de Pêche', 'Le Poisson Capitaine'],
    bonneReponse: 'La Pirogue (Kouloun)',
    explicationCulturelle: 'La pirogue traditionnelle (Kouloun) est le poumon du commerce et de la vie des pêcheurs Bozo sur le fleuve Niger depuis des siècles.',
    proverbe: 'La pirogue ne refuse jamais l\'eau qui la fait flotter.',
    regionId: 'mopti',
    regionNom: 'Mopti (Delta)',
    categorie: 'Objets Sacrés & Savoirs',
    difficulte: 'Initié',
    recompenseXp: 50,
    photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=60',
    publie: true,
    dateCreation: '2026-02-05T09:00:00Z',
    dateModification: '2026-02-22T17:00:00Z'
  },

  // ── 7. Devinette Traditionnelle : Le Bogolan
  {
    id: 'dev-bogolan',
    type: 'devinette',
    formuleIntro: 'N\'Da ! — N\'Da n\'sira !',
    enigmeTexte: 'Je nais du coton blanc, je bois la boue noire du fleuve et le suc des feuilles, puis je raconte l\'histoire de tout un peuple. Qui suis-je ?',
    indices: [
      'Mon nom signifie littéralement "fait avec la terre"',
      'Je protège les chasseurs et honore les reines',
      'Ségou et Kolokani sont mes berceaux réputés'
    ],
    options: ['Le Tissu Bogolan', 'Le Masque Dogon', 'La Kora sacrée', 'La Poterie de Kalabougou'],
    bonneReponse: 'Le Tissu Bogolan',
    explicationCulturelle: 'Le Bogolan est une technique artisanale ancestrale de teinture végétale et d\'argile ferrugineuse porteuse de symboles protecteurs.',
    proverbe: 'Les motifs du tissu ne trompent jamais celui qui sait lire la tradition.',
    regionId: 'segou',
    regionNom: 'Ségou',
    categorie: 'Arts & Artisanat',
    difficulte: 'Apprenti',
    recompenseXp: 75,
    photoUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
    publie: true,
    dateCreation: '2026-02-07T12:00:00Z',
    dateModification: '2026-02-24T14:15:00Z'
  },

  // ── 8. Quiz Culturel : Kouroukan Fouga
  {
    id: 'qz-kouroukan',
    type: 'quiz',
    question: 'En quelle année a été proclamée la Charte de Kouroukan Fouga par Soundiata Keïta et ses alliés ?',
    options: ['1236', '1312', '1492', '1050'],
    indexCorrect: 0,
    explication: 'La Charte de Kouroukan Fouga a été proclamée en 1236 après la victoire de Krina. Elle comprend 44 articles régissant les droits de l\'homme et l\'organisation sociale.',
    categorie: 'Histoire',
    regionId: 'koulikoro',
    regionNom: 'Koulikoro',
    recompenseXp: 40,
    publie: true,
    dateCreation: '2026-02-10T16:00:00Z',
    dateModification: '2026-02-25T11:00:00Z'
  },

  // ── 9. Quiz Culturel : La Falaise de Bandiagara
  {
    id: 'qz-bandiagara',
    type: 'quiz',
    question: 'Quel peuple emblématique du Mali vit le long de la spectaculaire falaise de Bandiagara ?',
    options: ['Les Dogons', 'Les Peuls', 'Les Soninkés', 'Les Touaregs'],
    indexCorrect: 0,
    explication: 'Le Pays Dogon s\'étend le long de la falaise de Bandiagara sur plus de 150 km, mondialement réputé pour son architecture troglodyte et son astronomie sacrée (Sirius).',
    categorie: 'Traditions',
    regionId: 'mopti',
    regionNom: 'Mopti',
    recompenseXp: 35,
    publie: true,
    dateCreation: '2026-02-12T14:30:00Z',
    dateModification: '2026-02-26T09:20:00Z'
  },

  // ── 10. Témoignage Oral : La Forge Sacrée
  {
    id: 'tem-forge-sacree',
    type: 'temoignage',
    conteur: 'Doyen Bakary Kanté',
    qualiteConteur: 'Maître Forgeron du Manden & Gardien du Feu',
    lieu: 'Kangaba, Région de Koulikoro',
    titreHistoire: 'La Flamme et le Secret du Fer',
    duree: '4 min 15',
    extrait: 'Chez nous, le forgeron ne frappe pas seulement le fer ; il sculpte la paix du village et apaise les querelles avec la sagesse du soufflet.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
    audioUrl: 'https://cdn.example.com/audio/temoignage-forge.mp3',
    epoqueOuAnnee: 'Tradition transmise depuis le XIIIe siècle',
    regionId: 'koulikoro',
    regionNom: 'Koulikoro',
    publie: true,
    dateCreation: '2026-02-15T18:00:00Z',
    dateModification: '2026-02-27T15:30:00Z'
  }
];
