# last_reigns

## C'est quoi Last-Reings?

Last-Reings est un jeu sur navigateur entièrement réalisé en HTML5/CSS et Typescript.
Le jeu avait à la base pour unique ambition de m'exercer à Typescript, n'ayant jamais touché
que du Javascript auparavant. L'exercice me plaisant, j'ai poursuivi jusqu'à "finir" le jeu.

## Gameplay

le jeu tire son inspiration principale de "Reigns", jeu mobile dont la boucle de gameplay repose
sur des dilemmes présentés au joueur auquel il peut répondre "oui" ou "non", les réponses influant l'état de 
diverses statistiques. J'ai repris directement cette boucle de gameplay en y ajoutant une gestion minimaliste de royaume.

Après une phase de choix, le joueur se retrouve façe à une seconde phase de jeu centré sur de la gestion minimaliste.
Le joeuur peut construire des batiments pour l'aider à gérer ses statistiques (ou aggraver les choses, c'est selon) moyennant
certains coûts.
Vient ensuite la dernière phase, les invasions. Si une invasion doit se produire ce tour (les espaces entre les invasions sont 
aléatoires mais soumis à certaines conditions), on oppose les statistiques actuelles du joueur pour les opposer aux exigences 
de l'invasion.
Si les statistiques sont bonnes, le jeu continue sur une autre boucle Choix/Gestion/Invasion.

Si le joueur surpasse la 5ème invasion c'est une victoire!

