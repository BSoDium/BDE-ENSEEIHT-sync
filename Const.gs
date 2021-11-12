const jsonConst = {
  parsingPatterns: {
    summary: /(?<=<h4>)(\r|\n|.)*(?=<\/h4>)/gm,
    timestamps: /(?<=<p><em>)(\r|\n|.)*(?=<\/em><\/p>)/gm,
    description: /(?<=<div class="panel-body">)(\r|\n|.)*?(?=<\/div>)/gm,
    id: /(?<=href="\/event\/).*?(?=\/")/gm
  },
  historyValueSeparator: "/:/",
  dcodePatterns: {
    'nbsp': ' ',
    'cent': '¢',
    'pound': '£',
    'yen': '¥',
    'euro': '€',
    'copy': '©',
    'reg': '®',
    'lt': '<',
    'gt': '>',
    'quot': '"',
    'amp': '&',
    'apos': '\'',
    '#x27': '\''
  },
  keywordEmojis: {
    'Soiree': '🥃',
    'Afterwork': '🍺',
    'Hall C': '🎊',
    'WEI': '🎪',
    'JT': '🎞️',
    'Femmes': '👩',
    'Course': '🏃',
    'All\'INP': '🧑‍🎓',
    'Karting': '🏎️',
    'TED': '🎤',
    'Echecs': '♟️',
    'theatre': '🎭',
    'default': '✨'
  },
  summarizeUnicode: {
    'é': 'e',
    'è': 'e',
    'ç': 'c',
    'à': 'a',
    'ù': 'u',
    'ê': 'e',
    'â': 'a',
    'î': 'i',
    'ô': 'o',
    'û': 'u',
    'æ': 'ae',
  },
  url: {
    main : "https://billetterie.inpt.fr/event/",
    auth : "https://cas.inpt.fr/login?service=https%3A%2F%2Fbilletterie.inpt.fr%2Faccounts%2Fcas_login%2F%3Fnext%3D%252Fevent%252F"
  }
}



