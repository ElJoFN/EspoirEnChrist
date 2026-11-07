export interface GuidanceTopic {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  passage: string;
  verseText: string;
  explanation: string;
  prayer: string;
}

export const BIBLE_GUIDANCE_TOPICS: GuidanceTopic[] = [
  {
    id: "paix",
    title: "En quête de Paix",
    subtitle: "Face au stress et à l'anxiété",
    iconName: "Shield",
    color: "from-blue-600 to-indigo-700",
    passage: "Jean 14:27",
    verseText: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.",
    explanation: "La paix que Jésus offre n'est pas une simple absence de conflit, mais une certitude intérieure profonde que Dieu règne souverainement sur votre vie.",
    prayer: "Seigneur Jésus, tu es le Prince de la Paix. Calme les vagues de mon esprit et accorde-moi un repos inébranlable."
  },
  {
    id: "epreuve",
    title: "Face à l'Épreuve",
    subtitle: "Dans les moments de deuil ou d'incertitude",
    iconName: "HeartHandshake",
    color: "from-amber-600 to-orange-700",
    passage: "Psaume 34:18",
    verseText: "L'Éternel est près de ceux qui ont le cœur brisé, et il sauve ceux qui ont l'esprit dans l'abattement.",
    explanation: "Dieu ne reste pas à distance lorsque la douleur survient. Il s'approche avec tendresse pour consoler les cœurs blessés et relever ceux qui tombent.",
    prayer: "Père céleste, dans ma faiblesse, je me réfugie près de toi. Sois mon rocher et ma forteresse au milieu de cette épreuve."
  },
  {
    id: "guerison",
    title: "Guérison & Restauration",
    subtitle: "Pour le corps, l'âme et l'esprit",
    iconName: "Sparkles",
    color: "from-emerald-600 to-teal-700",
    passage: "Jérémie 17:14",
    verseText: "Guéris-moi, Éternel, et je serai guéri; sauve-moi, et je serai sauvé; car tu es ma gloire.",
    explanation: "Jésus est le Grand Médecin. Il restaure ce qui a été brisé et apporte son souffle de vie là où la fatigue et la maladie ont pris place.",
    prayer: "Seigneur Jésus, j'invoque ton nom au-dessus de toute douleur et de toute maladie. Remplis mon corps et mon âme de ta puissance de vie."
  },
  {
    id: "espoir",
    title: "Espoir & Orientation",
    subtitle: "Chercher la direction de Dieu",
    iconName: "Compass",
    color: "from-purple-600 to-indigo-800",
    passage: "Proverbes 3:5-6",
    verseText: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ton sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.",
    explanation: "Lorsque l'horizon semble flou, la confiance en Dieu transforme nos hésitations en une marche assurée sur le chemin de sa lumière.",
    prayer: "Esprit de Dieu, éclaire ma route. Donne-moi le discernement pour faire des choix qui honorent ta volonté et manifestent ton espérance."
  },
  {
    id: "reconnaissance",
    title: "Joie & Gratitude",
    subtitle: "Célébrer les bontés de Dieu",
    iconName: "Sun",
    color: "from-amber-500 to-yellow-600",
    passage: "Psaume 103:1-2",
    verseText: "Mon âme, bénis l'Éternel ! Que tout ce qui est en moi bénisse son saint nom ! Mon âme, bénis l'Éternel, et n'oublie aucun de ses bienfaits !",
    explanation: "La gratitude transforme notre regard quotidien. Se souvenir des bienfaits de Dieu alimente notre joie et fortifie notre foi pour l'avenir.",
    prayer: "Seigneur, merci pour la vie, la grâce et le souffle que tu me donnes. Mon cœur déborde de louange pour ta grande bonté !"
  }
];
