# FLR — Gestion des opérations d'entreprise

Application web de gestion pour une entreprise multi-secteurs (BTP, location d'engins, services annexes).
Elle remplace les fichiers Excel épars par un outil unique où l'on suit **qui fait quoi, ce qui a été livré, et ce qui reste à payer**.

> Statut : version 1 fonctionnelle. L'application tourne et couvre le périmètre métier décrit ci-dessous.
> Elle n'a pas encore de gestion de rôles ni d'envoi d'emails (voir [Limites connues](#limites-connues)).

---

## Le problème qu'elle résout

Avant, tout vivait dans des classeurs Excel : pas d'historique fiable des livraisons, des paiements
saisis deux fois, aucun moyen de savoir en un coup d'œil combien il reste à payer sur un chantier,
et aucune alerte quand une tâche prend du retard.

FLR centralise ces données et répond à quatre questions du quotidien :

- Où en sont mes chantiers en cours ?
- Qu'est-ce qui a réellement été livré, et en combien de fois ?
- Combien dois-je à mes fournisseurs, combien mes clients me doivent-ils ?
- Quelles tâches sont en retard ou arrivent à échéance cette semaine ?

---

## Ce que fait l'application

| Module | Ce qu'on y fait |
|---|---|
| **Tableau de bord** | KPIs du jour : chantiers actifs, livraisons en attente, CA prévu / encaissé, dettes fournisseurs restantes, derniers paiements et dernières réceptions |
| **Paramètres entreprise** | Identité de la société : nom, IFU, RCCM, responsable légal, contacts — sert de référence aux documents générés |
| **Services & Activités** | Hiérarchie métier : un service (BTP, Location…) contient des activités (Terrassement, Maçonnerie, Location d'engins…). Chaque opération est rattachée à une activité |
| **Intervenants** | Annuaire unifié : clients, fournisseurs, partenaires, responsables internes |
| **Chantiers** | Projet client : libellé, lieu, activité, responsable, dates, statut, et toutes ses livraisons |
| **Livraisons & BL** | Commande passée à un fournisseur pour un chantier, avec **réceptions partielles** : chaque bon de livraison ajoute une quantité reçue, le reste à recevoir se calcule tout seul |
| **Locations** | Contrats de location de matériel : tarif unitaire, unité de temps, montant prévu, dates, statut |
| **Paiements** | Paiements échelonnés rattachés **soit** à une livraison, **soit** à un contrat de location (relation polymorphe), avec date, montant, mode et référence |
| **Planification** | Plannings découpés en tâches : responsable, dates, priorité, statut, ordre. Une planification peut être rattachée à n'importe quelle entité métier |
| **Notifications** | Alertes générées automatiquement sur les tâches : en retard, à livrer aujourd'hui, échéance dans les 3 jours. Elles se créent, se mettent à jour et disparaissent seules |
| **Statistiques** | Reporting filtrable (période, chantier, service, activité, client, fournisseur) avec une vue imprimable |

### Deux mécanismes à comprendre avant de lire le code

**Les livraisons partielles.** Une `Livraison` porte la quantité commandée. Chaque `PartialDelivery`
est un bon de livraison réellement reçu. L'attribut calculé `total_recu` sur la livraison est la
somme des quantités reçues — il n'est jamais stocké en base, toujours recalculé
([Livraison.php](app/Models/Livraison.php)).

**Les paiements polymorphes.** Un `Payment` pointe vers un `payable` qui est soit une `Livraison`
(ce qu'on doit au fournisseur), soit un `RentalContract` (ce que le client nous doit). D'où la route
unique `POST /payments/{type}/{id}` ([web.php:77](routes/web.php#L77)).

**Les notifications de tâches** ne sont pas produites par un job planifié : elles sont
resynchronisées à chaque affichage du tableau de bord, via `syncTaskAlertNotifications()`
([DashboardController.php](app/Http/Controllers/DashboardController.php)). Une tâche terminée voit
ses alertes supprimées automatiquement.

---

## Stack technique

- **PHP 8.3+** / **Laravel 13**
- **React 18** + **Inertia.js 2** (monolithe, pas d'API REST séparée : les contrôleurs renvoient directement des pages React)
- **Tailwind CSS 3** + **Vite 8**
- **MySQL** en développement et production (SQLite possible pour les tests)
- **Laravel Breeze** pour l'authentification, **Ziggy** pour les routes côté JS

---

## Installation

### Prérequis

- PHP 8.3 ou plus, avec Composer
- Node.js 20+ et npm
- MySQL 8 (ou MariaDB)

### Mise en route

```bash
git clone <url-du-depot> flr
cd flr

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Ouvrez `.env` et renseignez la base de données :

```dotenv
APP_NAME=FLR

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=flr
DB_USERNAME=root
DB_PASSWORD=
```

Créez la base `flr` dans MySQL, puis :

```bash
php artisan migrate
```

### Lancer en développement

Tout d'un coup (serveur, queue, logs et Vite en parallèle) :

```bash
composer dev
```

Ou séparément, dans deux terminaux :

```bash
php artisan serve   # http://localhost:8000
npm run dev
```

Créez ensuite votre compte via **S'inscrire** sur la page d'accueil, puis commencez par
**Paramètres** (identité de l'entreprise) et **Services** — le reste de l'application s'appuie
sur cette hiérarchie service → activité.

### Mise en production

```bash
composer install --no-dev --optimize-autoloader
npm run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

---

## Tests

```bash
composer test        # ou : php artisan test
```

Note : la suite de tests est encore celle livrée par défaut avec Breeze (authentification, profil).
Les modules métier ne sont pas couverts.

---

## Organisation du code

```
app/
  Http/Controllers/     un contrôleur par module métier
  Models/               Eloquent : Chantier, Livraison, PartialDelivery, Payment,
                        RentalContract, Planification, Task, AppNotification…
database/migrations/    schéma complet, dans l'ordre chronologique
resources/js/
  Pages/                pages Inertia, un dossier par module
  Layouts/              AuthenticatedLayout (avec Sidebar) et GuestLayout
  Components/           champs de formulaire, modale, dropdown, navigation
routes/web.php          toutes les routes applicatives, groupées par module
docs/                   cahier des charges technique (CDC)
```

Toutes les routes métier sont derrière le middleware `auth` ; le tableau de bord exige en plus
`verified`.

---

## Limites connues

Ces points sont prévus au cahier des charges mais **pas encore implémentés** :

- **Rôles et permissions** : tout utilisateur connecté accède à tous les modules. Il n'y a pas de
  colonne de rôle sur `users`.
- **Notifications par email** : les alertes sont uniquement dans l'application. `MAIL_MAILER` est
  sur `log` par défaut, aucun mailable n'existe.
- **Export PDF / Excel** : `barryvdh/laravel-dompdf` est installé mais pas encore utilisé. Le seul
  export disponible est la vue imprimable des statistiques (`/statistics/print`).
- **Upload du logo** de l'entreprise : la colonne `logo` existe sur `entreprise_configs`, mais le
  formulaire de paramètres n'accepte pas encore de fichier.
- **Couverture de tests** des modules métier.

---

## Documentation

Le cahier des charges technique complet (contexte, périmètre, description de chaque module) se
trouve dans [docs/](docs/).

---

## Licence

Projet privé. Squelette Laravel sous licence MIT.
