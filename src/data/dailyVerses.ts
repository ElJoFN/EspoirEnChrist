export interface BibleVerse {
  id: string;
  reference: string;
  book: string;
  chapter: number;
  verse: string;
  text: string;
  textSemeur?: string;
  textCourant?: string;
  context: string;
  meditation: string;
  prayer: string;
  theme: string;
}

export const DAILY_VERSES: BibleVerse[] = [
  {
    id: "v-01",
    reference: "Jean 3:16",
    book: "Jean",
    chapter: 3,
    verse: "16",
    text: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    textSemeur: "Oui, Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que tout homme qui croit en lui ne perde pas la vie, mais bénéficie de la vie éternelle.",
    textCourant: "Car Dieu a tellement aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne soit pas perdu, mais ait la vie éternelle.",
    context: "Paroles de Jésus à Nicodème, expliquant le plan parfait du salut universel par l'amour inconditionnel de Dieu.",
    meditation: "L'amour de Dieu pour vous est incommensurable. Il n'a pas retenu ce qu'il avait de plus cher afin de vous offrir une relation éternelle et une espérance inébranlable.",
    prayer: "Seigneur Dieu, merci pour ton amour infini manifesté en Jésus-Christ. Remplis mon cœur de cet amour et aide-moi à vivre chaque jour dans la certitude de ton salut. Amen.",
    theme: "Amour & Salut"
  },
  {
    id: "v-02",
    reference: "Jérémie 29:11",
    book: "Jérémie",
    chapter: 29,
    verse: "11",
    text: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
    textSemeur: "Car moi, je connais les projets que j'ai conçus pour vous, déclare l'Éternel, des projets de paix et non de malheur, afin de vous donner un avenir et une espérance.",
    textCourant: "Moi, l'Éternel, je sais bien quels projets j'ai formés pour vous : ce sont des projets de paix et non de malheur, pour vous donner un avenir plein d'espoir.",
    context: "Message de consolation adressé au peuple en exil, lui rappelant que la fidélité de Dieu surpasse toute épreuve temporaire.",
    meditation: "Même au milieu de l'incertitude ou des tempêtes de la vie, le plan de Dieu pour votre existence reste rempli de bienveillance, de restauration et d'espoir suprême.",
    prayer: "Père céleste, je te confie mes inquiétudes et mon avenir. Je crois que tes projets pour moi dépassent mes craintes. Accorde-moi la paix et la foi. Amen.",
    theme: "Espoir & Avenir"
  },
  {
    id: "v-03",
    reference: "Psaume 23:1-3",
    book: "Psaume",
    chapter: 23,
    verse: "1-3",
    text: "L'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de meurs pâturages, il me dirige près des eaux paisibles. Il restaure mon âme.",
    textSemeur: "L'Éternel est mon berger. Je ne manquerai de rien. Grâce à lui, je me repose dans de verts pâturages, il me conduit au bord des eaux paisibles. Il me rend des forces neuves.",
    textCourant: "Le Seigneur est mon berger, je ne manque de rien. Sur des prés d'herbe fraîche il me fait reposer, il me mène vers les eaux du repos et me rend des forces.",
    context: "Célèbre psaume de David exprimant une confiance totale envers Dieu, le Bon Berger attentif et bienveillant.",
    meditation: "Vous n'avez pas à porter seul le poids de la journée. Le Seigneur connaît vos besoins et désire renouveler votre âme épuisée près des eaux du repos.",
    prayer: "Jésus, mon Bon Berger, guide mes pas aujourd'hui. Apaise mon cœur troublé et restaure mes forces intérieures par ta présence bienveillante. Amen.",
    theme: "Paix & Protection"
  },
  {
    id: "v-04",
    reference: "Ésaïe 40:31",
    book: "Ésaïe",
    chapter: 40,
    verse: "31",
    text: "Mais ceux qui s'attendent à l'Éternel renouvelleront leur force; ils prendront leur vol comme des aigles; ils courront et ne se lasseront point, ils marcheront et ne se fatigueront point.",
    textSemeur: "Mais ceux qui comptent sur l'Éternel renouvellent leur force. Ils prennent leur envol comme des aigles. Ils courent sans se fatiguer, ils marchent sans se lasser.",
    textCourant: "Mais ceux qui mettent leur espoir dans le Seigneur trouvent des forces nouvelles. Ils prennent leur envol comme les aigles. Ils courent sans se fatiguer.",
    context: "Promesse divine de renouvellement pour ceux qui placent leur attente et leur confiance en Dieu.",
    meditation: "Lorsque vos ressources physiques ou émotionnelles sont affaiblies, tournez votre regard vers l'Éternel. Sa grâce insuffle une vigueur capable d'affronter toute montagne.",
    prayer: "Seigneur, je dépose mon épuisement entre tes mains. Renouvelle mes forces aujourd'hui et fais-moi planer au-dessus de mes inquiétudes avec foi. Amen.",
    theme: "Force & Courage"
  },
  {
    id: "v-05",
    reference: "Philippiens 4:6-7",
    book: "Philippiens",
    chapter: 4,
    verse: "6-7",
    text: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.",
    textSemeur: "Ne vous inquiétez de rien, mais en toute circonstance, demandez à Dieu dans la prière avec des remerciements ce dont vous avez besoin. Alors la paix de Dieu gardera vos cœurs.",
    textCourant: "Ne vous inquiétez de rien, mais en toute occasion, présentez vos demandes à Dieu dans la prière et la supplication, avec des remerciements. Et la paix de Dieu gardera votre esprit.",
    context: "Exhortation de l'apôtre Paul depuis sa captivité, montrant le secret de la sérénité inébranlable.",
    meditation: "La prière est le remède divin contre l'anxiété. En remettant vos fardeaux avec reconnaissance, la paix de Dieu vient dresser une garde protectrice autour de votre esprit.",
    prayer: "Dieu de paix, je t'abandonne mes craintes et mes incertitudes. Remplis mon esprit d'une tranquillité suprême qui dépasse ma propre compréhension. Amen.",
    theme: "Sérénité & Prière"
  },
  {
    id: "v-06",
    reference: "Romains 8:28",
    book: "Romains",
    chapter: 8,
    verse: "28",
    text: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
    textSemeur: "Du reste, nous savons que tout contribue au bien de ceux qui aiment Dieu, de ceux qui sont appelés conformément à son plan.",
    textCourant: "Nous savons que Dieu fait tout concourir au bien de ceux qui l'aiment, de ceux qu'il a appelés selon son projet.",
    context: "Paul affirme que rien ne peut contrecarrer le projet glorieux de Dieu dans la vie du croyant.",
    meditation: "Rien de ce que vous traversez n'est perdu. Même les moments difficiles sont transformés par Dieu en instruments de bénédiction et d'affermissement.",
    prayer: "Seigneur, même quand je ne comprends pas les circonstances, je choisis de croire que tu orchestres tout pour mon bien. Merci pour ta souveraineté. Amen.",
    theme: "Confiance & Providence"
  },
  {
    id: "v-07",
    reference: "Matthieu 11:28",
    book: "Matthieu",
    chapter: 11,
    verse: "28",
    text: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",
    textSemeur: "Venez à moi, vous tous qui êtes fatigués et courbés sous le fardeau, et moi je vous donnerai du repos.",
    textCourant: "Venez à moi, vous tous qui êtes fatigués et portez de lourds fardeaux, et je vous donnerai du repos.",
    context: "Invitation chaleureuse de Jésus à tous ceux qui ploient sous les contraintes et les blessures de la vie.",
    meditation: "Jésus ne vous demande pas de venir parfaits, mais de venir tels que vous êtes avec vos fatigues et vos doutes. Son joug est doux et son fardeau est léger.",
    prayer: "Jésus mon Sauveur, je viens à toi avec tout mon fardeau. Décharge-moi et accorde-moi le vrai repos du cœur et de l'âme. Amen.",
    theme: "Repos & Compassion"
  }
];

export function getVerseOfTheDay(offsetDays: number = 0): BibleVerse {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - startOfYear.getTime()) + (startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear + offsetDays) % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}
