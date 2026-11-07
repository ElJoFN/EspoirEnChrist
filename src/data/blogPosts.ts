export interface BlogPost {
  id: string;
  title: string;
  category: 'Méditation' | 'Enseignement' | 'Témoignage' | 'Vie Chrétienne';
  author: string;
  date: string;
  readTime: string;
  snippet: string;
  content: string;
  biblicalReference?: string;
  likesCount: number;
  featured?: boolean;
}

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Comment garder courage quand tout semble s'effondrer : Dieu reste fidèle",
    category: "Méditation",
    author: "Pasteur David",
    date: "7 Novembre 2026",
    readTime: "5 min",
    biblicalReference: "Lamentations 3:22-23",
    likesCount: 64,
    featured: true,
    snippet: "Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Découvrez comment puiser une force nouvelle.",
    content: `Dans les saisons de tempête, nos yeux ont naturellement tendance à se focaliser sur la hauteur des vagues plutôt que sur la puissance de Celui qui commande au vent.

Pourtant, l'Écriture nous rappelle avec force dans Lamentations 3:22-23 : « Les bontés de l'Éternel ne sont point épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Grande est ta fidélité ! »

1. Reconnaître que votre épreuve n'est pas la fin de l'histoire
Dieu ne commence jamais une œuvre pour l'abandonner en chemin. Ce qu'Il a promis pour votre vie, Il a la puissance et la fidélité de l'accomplir. L'attente n'est pas un refus divin, mais un temps d'affermissement et de préparation intérieure.

2. Choisir la louange au milieu du combat
Lorsque Paul et Silas étaient emprisonnés, ils ont choisi de chanter des cantiques au milieu de la nuit. C'est à ce moment précis que les fondations de la prison ont tremblé. La louange déplace le regard de nos limites humaines vers la souveraineté illimitée de Dieu.

3. Déclarer la fidélité de Dieu chaque matin
Chaque nouveau réveil est un témoignage vivant que Dieu n'en a pas fini avec vous. Prenez quelques minutes au lever pour proclamer : « Seigneur, je choisis la confiance, car tu es fidèle et ta grâce me suffit aujourd'hui. »`
  },
  {
    id: "post-2",
    title: "Témoignage : De l'obscurité du doute à la certitude du salut en Jésus",
    category: "Témoignage",
    author: "Marie-Thérèse R.",
    date: "4 Novembre 2026",
    readTime: "7 min",
    biblicalReference: "Psaume 40:2-3",
    likesCount: 98,
    featured: false,
    snippet: "Après des années d'angoisse et de recherche de repères, j'ai rencontré l'amour inconditionnel du Christ. Voici comment ma vie et ma famille ont été miraculeusement restaurées.",
    content: `Pendant de longues années, j'avançais avec un masque de réussite alors que mon cœur était vidé de paix véritable. Rien de ce que le monde proposait ne parvenait à combler ce vide intérieur.

C'est à travers un verset partagé un matin — Jérémie 29:11 (« Car je connais les projets que j'ai formés sur vous... projets de paix et non de malheur ») — que le Seigneur a touché mon âme en profondeur.

Pour la première fois, j'ai compris que Dieu ne me condamnait pas, mais qu'Il m'invitait à déposer mon fardeau à ses pieds. J'ai prié avec des larmes sincères dans ma chambre, et une paix indicible, une paix que je n'avais jamais ressentie auparavant, a inondé mon être.

Aujourd'hui, mon foyer est transformé. Mes proches ont vu la différence : là où régnait la nervosité, il y a la patience et l'écoute. Jésus n'est pas une théorie, Il est une présence vivante qui transforme concrètement nos existences.`
  },
  {
    id: "post-3",
    title: "Les secrets bibliques d'une prière fervente et persévérante",
    category: "Enseignement",
    author: "Équipe Pastorale",
    date: "1 Novembre 2026",
    readTime: "6 min",
    biblicalReference: "Jacques 5:16",
    likesCount: 52,
    featured: false,
    snippet: "La prière n'est pas une récitation mécanique, mais un dialogue intime de cœur à cœur avec le Père. Découvrez comment prier avec assurance et efficacité.",
    content: `Beaucoup de chrétiens se demandent pourquoi leurs prières semblent parfois sans réponse. Dans les Évangiles, Jésus nous a donné des principes clairs pour une vie d'intercession puissante.

1. Prier avec la foi d'un enfant
Venir devant Dieu avec simplicité. Dieu ne cherche pas des formules savantes ou de longs discours théâtraux, mais une foi authentique qui s'appuie sur Ses promesses.

2. Prier selon la volonté révélée dans la Parole
Quand vous priez une promesse que Dieu a déjà donnée dans la Bible (la paix, le pardon, la direction, la force), vous priez avec une autorité absolue. Dieu veille sur Sa Parole pour l'exécuter.

3. La persévérance dans l'intercession
Jésus a raconté la parabole de la veuve persévérante pour nous enseigner qu'il faut toujours prier et ne point se relâcher. La prière forge notre patience et affine notre confiance.`
  },
  {
    id: "post-4",
    title: "Vaincre l'anxiété par l'action de grâce : la méthode de l'apôtre Paul",
    category: "Vie Chrétienne",
    author: "Samuel & Esther",
    date: "28 Octobre 2026",
    readTime: "4 min",
    biblicalReference: "Philippiens 4:6-7",
    likesCount: 47,
    featured: false,
    snippet: "Face aux défis quotidiens, l'action de grâce est l'arme spirituelle suprême pour désamorcer l'angoisse et faire triompher la paix divine dans votre esprit.",
    content: `L'apôtre Paul écrivait ces mots inoubliables depuis une cellule de prison : « Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. »

Remarquez la clé souvent négligée : « avec des actions de grâces ».

Remercier Dieu AVANT même de voir l'exaucement visible est l'acte de foi le plus élevé. Cela signifie : « Seigneur, je ne vois pas encore la solution de mes yeux physiques, mais je te remercie déjà parce que Tu es fidèle et que Tu es à l'œuvre. »

Faites l'expérience dès aujourd'hui : listez 5 sujets de reconnaissance envers Dieu pour chaque motif d'inquiétude qui se présente à votre esprit.`
  },
  {
    id: "post-5",
    title: "La fidélité de Dieu dans le désert : Pourquoi l'attente fortifie la foi",
    category: "Méditation",
    author: "Pasteur David",
    date: "22 Octobre 2026",
    readTime: "5 min",
    biblicalReference: "Ésaïe 40:31",
    likesCount: 78,
    featured: false,
    snippet: "Ceux qui s'attendent à l'Éternel renouvellent leur force. L'attente n'est pas du temps perdu, mais le temps où Dieu façonne notre caractère.",
    content: `Dans la culture moderne de l'instantanéité, attendre est souvent perçu comme un échec ou une perte de temps. Pourtant, dans le plan de Dieu, le désert est l'école de la maturité.

Moïse a passé 40 ans au désert avant d'entrer dans son appel. David a attendu des années après avoir été oint roi avant de monter sur le trône.

Dans ces périodes de silence apparent, Dieu n'est pas inactif : Il prépare notre cœur à porter la bénédiction sans nous égarer. Rappelez-vous chaque jour : « Il a promis, Il accomplira ! »`
  },
  {
    id: "post-6",
    title: "Comment pardonner quand la blessure est profonde ?",
    category: "Enseignement",
    author: "Équipe Pastorale",
    date: "17 Octobre 2026",
    readTime: "6 min",
    biblicalReference: "Colossiens 3:13",
    likesCount: 112,
    featured: false,
    snippet: "Le pardon n'est pas une émotion, c'est une décision d'obéissance qui libère notre propre âme de la prison de l'amertume.",
    content: `Beaucoup confondent le pardon avec l'oubli immédiat ou l'approbation de l'offense. Pardonner ne veut pas dire déclarer que le mal commis n'était pas grave.

Pardonner signifie remettre la justice entre les mains de Dieu et refuser de nourrir la rancune. Comme Christ nous a pardonné alors que nous étions pécheurs, nous sommes appelés à relâcher ceux qui nous ont blessés.

Le premier bénéficiaire du pardon n'est pas le coupable, c'est celui qui pardonne : les chaînes du passé sont brisées.`
  },
  {
    id: "post-7",
    title: "L'importance vitale de la communion fraternelle au XXIe siècle",
    category: "Vie Chrétienne",
    author: "Samuel & Esther",
    date: "11 Octobre 2026",
    readTime: "5 min",
    biblicalReference: "Hébreux 10:24-25",
    likesCount: 59,
    featured: false,
    snippet: "Nous n'avons pas été créés pour marcher seuls. Découvrons la richesse de l'édification mutuelle et du soutien communautaire.",
    content: `Un charbon ardent isolé s'éteint rapidement, mais réuni avec d'autres charbons, il conserve sa chaleur et entretient une flamme vive.

La vie chrétienne est intrinsèquement communautaire. Prier les uns pour les autres, partager les fardeaux, célébrer les victoires ensemble sont les piliers d'une foi vivante et inébranlable.`
  },
  {
    id: "post-8",
    title: "Témoignage : Guéri de l'amertume après 10 ans de rupture familiale",
    category: "Témoignage",
    author: "Alain K.",
    date: "5 Octobre 2026",
    readTime: "8 min",
    biblicalReference: "Luc 15:20-24",
    likesCount: 134,
    featured: false,
    snippet: "Dieu a réconcilié ce que tous croyaient brisé à jamais. Voici comment l'amour du Christ a restauré notre famille.",
    content: `Pendant une décennie, un mur d'incompréhension et de silence s'était érigé entre mon frère et moi. Chaque tentative humaine de rapprochement échouait.

C'est lors d'une veillée de prière sur le thème de la réconciliation que le Saint-Esprit m'a convaincu d'abandonner mon orgueil et de faire le premier pas. J'ai envoyé un simple message de paix et de pardon.

Dieu a touché son cœur au même instant. Les larmes ont effacé dix années de ressentiment. Rien n'est impossible à notre Dieu fidèle.`
  }
];

// Local storage and reactive sync helpers (prepared for database / admin connection)
export const getStoredBlogPosts = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem('espoir_dynamic_blog_posts');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return DEFAULT_BLOG_POSTS;
  } catch (e) {
    return DEFAULT_BLOG_POSTS;
  }
};

export const saveStoredBlogPosts = (posts: BlogPost[], notify: boolean = false): void => {
  try {
    const current = localStorage.getItem('espoir_dynamic_blog_posts');
    const newStr = JSON.stringify(posts);
    if (current !== newStr) {
      localStorage.setItem('espoir_dynamic_blog_posts', newStr);
    }
    if (notify && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('espoir_data_updated', { detail: { type: 'blog' } }));
    }
  } catch (e) {
    console.error('Error saving dynamic blog posts:', e);
  }
};
