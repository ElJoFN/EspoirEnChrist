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
  }
];

// Local storage and reactive sync helpers (prepared for database / admin connection)
export const getStoredBlogPosts = (): BlogPost[] => {
  try {
    const saved = localStorage.getItem('espoir_dynamic_blog_posts');
    return saved ? JSON.parse(saved) : DEFAULT_BLOG_POSTS;
  } catch (e) {
    return DEFAULT_BLOG_POSTS;
  }
};

export const saveStoredBlogPosts = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem('espoir_dynamic_blog_posts', JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving dynamic blog posts:', e);
  }
};
